import { Router } from 'express';
import Stripe from 'stripe'
import { prisma } from '../../db/prisma.js';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

router.post("/create-checkout-session", async (req: any, res) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "User not authorized" });
        }

        const { bidId, claimId } = req.body;

        if (!bidId || !claimId) {
            return res.status(400).json({ error: "Missing bid id or claim id" });
        }

        const bid = await prisma.bid.findUnique({
            where: {
                id: bidId
            },
            include: {
                claim: true,
                user: true,
            }
        });

        if (!bid) {
            return res.status(404).json({ error: "Missing bid" });
        }

        if (bid?.claim?.userId !== user?.id) {
            return res.status(403).json({ error: "Forbidden access" });
        }

        const bidAmountCents = Math.round(bid.amount) * 100;
        const totalAmountCents = Math.round(bidAmountCents * 1.05);

        // idempotency check
        const existingPayment = await prisma.payment.findFirst({
            where: {
                bidId,
                status: "PENDING"
            }
        });

        if (existingPayment?.stripeSessionId) {
            try {
                const existingSession = await stripe.checkout.sessions.retrieve(existingPayment?.stripeSessionId);
                if (existingSession?.status === "open") {
                    return res.status(200).json({ checkoutUrl: existingSession.url });
                }
            } catch (error) {
                console.log(error);
            }
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Project: ${bid?.claim?.title}`,
                            description: `Contractor: ${
                                bid?.user?.companyName || bid?.user?.email
                            } – Bid + 5% platform fee`,
                        },
                        unit_amount: totalAmountCents,
                    },
                    quantity: 1
                },
            ],
            metadata: {
                bidId,
                claimId,
                homeownerId: user?.id,
                contractorId: bid?.userId,
                bidAmount: bid?.amount?.toString(),
                platformFee: ((bid?.amount ?? 0) * 0.05)?.toString(),
            },
            success_url: `${process.env.FRONTEND_URL}/auction/${claimId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/auction/${claimId}?payment=cancelled`,
            customer_email: user.email,
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        });

        await prisma.payment.upsert({
            where: { id: existingPayment?.id || "new-payment" },
            create: {
                bidId,
                claimId,
                homeownerId: user.id,
                contractorId: bid.userId,
                amount: totalAmountCents / 100,
                bidAmount: bid.amount,
                platformFee: bid.amount * 0.05,
                stripeSessionId: session.id,
                status: "PENDING"
            },
            update: {
                stripeSessionId: session.id,
                status: "PENDING"
            }
        });

        return res.status(200).json({ checkoutUrl: session.url });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error creating checkout-session" });
    }
});

router.get("/status/:bidId", async (req: any, res) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "User not authorized" });
        }

        const { bidId } = req.params;

        const payment = await prisma.payment.findFirst({
            where: {
                bidId,
            },
            orderBy: { createdAt: "desc" }
        });

        if (!payment) {
            return res.status(404).json({ error: "No payment found for this bid" });
        }

        return res.status(200).json({ payment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error getting payment status" });
    }
})

export default router;

