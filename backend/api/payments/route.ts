import { Router } from 'express';
import Stripe from 'stripe'
import { prisma } from '../../db/prisma.js';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Milestone percentages configuration
const MILESTONE_CONFIG: Record<string, { percentage: number; label: string; order: number }> = {
    DOWN_PAYMENT: { percentage: 0.20, label: "Down Payment", order: 1 },
    STAGE_1: { percentage: 0.20, label: "Stage 1", order: 2 },
    STAGE_2: { percentage: 0.20, label: "Stage 2", order: 3 },
    FINAL_STAGE: { percentage: 0.30, label: "Final Stage", order: 4 },
    RETAINAGE: { percentage: 0.10, label: "Retainage", order: 5 },
};

router.post("/create-checkout-session", async (req: any, res) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "User not authorized" });
        }

        const { bidId, claimId, milestoneStage = "DOWN_PAYMENT" } = req.body;

        if (!bidId || !claimId) {
            return res.status(400).json({ error: "Missing bid id or claim id" });
        }

        const milestoneConfig = MILESTONE_CONFIG[milestoneStage];
        if (!milestoneConfig) {
            return res.status(400).json({ error: "Invalid milestone stage" });
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

        // Calculate milestone amount
        const milestoneBaseAmount = bid.amount * milestoneConfig.percentage;
        const milestoneFee = milestoneBaseAmount * 0.05;
        const milestoneTotal = milestoneBaseAmount + milestoneFee;

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

        // Convert to cents for Stripe
        const milestoneBaseAmountCents = Math.round(milestoneBaseAmount * 100);
        const milestoneFeeCents = Math.round(milestoneFee * 100);

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card", "us_bank_account"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `${milestoneConfig.label} (${milestoneConfig.percentage * 100}% of Base Total)`,
                            description: `Project: ${bid?.claim?.title} | Contractor: ${bid?.user?.companyName || bid?.user?.email}`,
                        },
                        unit_amount: milestoneBaseAmountCents,
                    },
                    quantity: 1
                },
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Vendle Service Fee (5%)",
                            description: "Platform fee for project management and support",
                        },
                        unit_amount: milestoneFeeCents,
                    },
                    quantity: 1
                },
            ],
            metadata: {
                bidId,
                claimId,
                homeownerId: user?.id,
                contractorId: bid?.userId,
                milestoneStage,
                milestoneBaseAmount: milestoneBaseAmount.toString(),
                platformFee: milestoneFee.toString(),
                bidAmount: bid?.amount?.toString(),
            },
            success_url: `${process.env.FRONTEND_URL}/auction/${claimId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/auction/${claimId}?payment=cancelled`,
            customer_email: user.email,
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        });

        await prisma.payment.upsert({
            where: {
                stripeSessionId: session.id,
            },
            create: {
                bidId,
                claimId,
                homeownerId: user.id,
                contractorId: bid.userId,
                amount: milestoneTotal,
                bidAmount: milestoneBaseAmount,
                platformFee: milestoneFee,
                stripeSessionId: session.id,
                status: "PENDING",
            },
            update: {
                status: "PENDING",
            },
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
});

// Get milestones for a project
router.get("/milestones/:projectId", async (req: any, res) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "User not authorized" });
        }

        const { projectId } = req.params;

        const milestones = await prisma.paymentMilestone.findMany({
            where: { projectId },
            orderBy: { createdAt: "asc" }
        });

        // Determine current stage (first unpaid milestone)
        const currentStage = milestones.find(m => m.status !== "PAID")?.stage || null;

        return res.status(200).json({
            milestones,
            currentStage,
            paidStages: milestones.filter(m => m.status === "PAID").map(m => m.stage)
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error fetching milestones" });
    }
});

// Get milestone breakdown for a bid (before project exists)
router.get("/breakdown/:bidId", async (req: any, res) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "User not authorized" });
        }

        const { bidId } = req.params;

        const bid = await prisma.bid.findUnique({
            where: { id: bidId }
        });

        if (!bid) {
            return res.status(404).json({ error: "Bid not found" });
        }

        const baseAmount = bid.amount;
        const serviceFee = baseAmount * 0.05;
        const allInTotal = baseAmount + serviceFee;

        const breakdown = Object.entries(MILESTONE_CONFIG).map(([stage, config]) => ({
            stage,
            label: config.label,
            percentage: config.percentage * 100,
            amount: baseAmount * config.percentage,
            order: config.order
        })).sort((a, b) => a.order - b.order);

        return res.status(200).json({
            baseAmount,
            serviceFee,
            allInTotal,
            breakdown,
            currentStage: "DOWN_PAYMENT",
            paidStages: []
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error calculating breakdown" });
    }
});

export default router;

