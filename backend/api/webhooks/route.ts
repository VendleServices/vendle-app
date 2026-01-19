import crypto from "crypto";
import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '../../db/prisma.js';

const router = Router();

const CALENDLY_WEBHOOK_SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

router.post('/stripe', async (req: any, res: any) => {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
        return res.status(400).json({ error: "Missing stripe signature" });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            signature,
            STRIPE_WEBHOOK_SECRET
        );
    } catch (error: any) {
        return res.status(400).json({ error: error?.message || "Error creating stripe event" });
    }

    switch (event.type) {
        case "checkout.session.completed":
            await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
            break;

        case "checkout.session.expired":
            await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
            break;

        case "payment_intent.payment_failed":
            await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
            break;

        default:
            console.log(`Unhandled event: ${event.type}`);
    }

    return res.status(200).json({ received: true });
});

router.post("/calendly", async (req: any, res) => {
    try {
        // Get raw body for signature verification
        // const rawBody = JSON.stringify(req.body);
        // const signature = req.headers['calendly-webhook-signature'];

        // Verify webhook signature
        // if (!verifyCalendlySignature(rawBody, signature)) {
        //     console.error('Invalid Calendly webhook signature');
        //     return res.status(401).json({ error: "Invalid signature" });
        // }

        const { event, payload } = req.body;

        // Handle different event types
        switch (event) {
            case "invitee.created":
                return await handleInviteeCreated(payload, res);
            case "invitee.canceled":
                return await handleInviteeCanceled(payload, res);
            default:
                // Acknowledge receipt of unhandled events
                return res.status(200).json({ received: true });
        }
    } catch (error) {
        console.error('Calendly webhook error:', error);
        return res.status(500).json({ error: "Webhook processing failed" });
    }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const { bidId, claimId, contractorId } = session.metadata || {}

    if (!bidId || !claimId) return;

    await prisma.$transaction(async (tx) => {
        await tx.payment.updateMany({
            where: {
                stripeSessionId: session.id
            },
            data: {
                status: "COMPLETED",
                stripePaymentIntentId: session.payment_intent as string,
                completedAt: new Date(),
            }
        });

        await tx.claim.update({
            where: {
                id: claimId
            },
            data: {
                winnerId: contractorId,
                status: "CLOSED"
            }
        });

        const bid = await tx.bid.findUnique({
            where: { id: bidId },
            include: { auctionPhase: true },
        });

        if (bid?.auctionPhaseId) {
            await tx.auctionPhase.update({
                where: { id: bid.auctionPhaseId },
                data: { status: "CLOSED" }
            });
        }

        await tx.project.create({
            data: {
                claimId,
                contractorId: contractorId!,
                status: "ACTIVE",
            }
        });

        await tx.claimParticipant.updateMany({
            where: { claimId, userId: contractorId },
            data: {
                status: "APPROVED"
            }
        });
    });
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
    await prisma.payment.updateMany({
        where: {
            stripeSessionId: session.id,
            status: "PENDING"
        },
        data: {
            status: "EXPIRED"
        }
    });
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    await prisma.payment.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: {
            status: "FAILED"
        }
    });
}

async function handleInviteeCreated(payload: any, res: any) {
    const bookingToken: string | undefined = payload?.tracking?.utm_campaign;
    if (!bookingToken) {
        return res.status(400).json({ error: "Missing booking token" });
    }

    const calendlyEventUri = payload?.event?.uri;
    if (!calendlyEventUri) {
        return res.status(400).json({ error: "Missing event URI" });
    }

    // Idempotency check - if meeting already exists for this event, return success
    const existingMeeting = await prisma.meeting.findUnique({
        where: { calendlyEventUri }
    });

    if (existingMeeting) {
        return res.status(200).json({ message: "Meeting already exists", meeting: existingMeeting });
    }

    const bookingAttempt = await prisma.bookingAttempt.findUnique({
        where: { bookingToken }
    });

    if (!bookingAttempt) {
        return res.status(404).json({ error: "Booking attempt not found" });
    }

    const newBooking = await prisma.$transaction(async (trx: any) => {
        const meeting = await trx.meeting.create({
            data: {
                bookingToken,
                contractorId: bookingAttempt.contractorId,
                homeownerId: bookingAttempt.homeownerId,
                startTime: new Date(payload.event.start_time),
                endTime: new Date(payload.event.end_time),
                inviteeEmail: payload.invitee.email,
                calendlyEventUri,
                status: "SCHEDULED"
            }
        });

        await trx.bookingAttempt.update({
            where: { bookingToken },
            data: { status: "CONFIRMED" }
        });

        return meeting;
    });

    return res.status(201).json({ meeting: newBooking });
}

async function handleInviteeCanceled(payload: any, res: any) {
    const calendlyEventUri = payload?.event?.uri;
    if (!calendlyEventUri) {
        return res.status(400).json({ error: "Missing event URI" });
    }

    const meeting = await prisma.meeting.findUnique({
        where: { calendlyEventUri }
    });

    if (!meeting) {
        // Meeting might not exist if it was never created - that's ok
        return res.status(200).json({ message: "Meeting not found, nothing to cancel" });
    }

    // Already canceled - idempotency
    if (meeting.status === "CANCELED") {
        return res.status(200).json({ message: "Meeting already canceled" });
    }

    const updatedMeeting = await prisma.$transaction(async (trx: any) => {
        const canceled = await trx.meeting.update({
            where: { calendlyEventUri },
            data: {
                status: "CANCELED",
                canceledAt: new Date()
            }
        });

        // Also update the booking attempt status
        await trx.bookingAttempt.update({
            where: { bookingToken: meeting.bookingToken },
            data: { status: "CANCELED" }
        });

        return canceled;
    });

    return res.status(200).json({ message: "Meeting canceled", meeting: updatedMeeting });
}

function verifyCalendlySignature(payload: string, signature: string | undefined): boolean {
    if (!CALENDLY_WEBHOOK_SIGNING_KEY || !signature) {
        return false;
    }

    // Calendly signature format: t=timestamp,v1=signature
    const parts = signature.split(',');
    const timestampPart = parts.find(p => p.startsWith('t='));
    const signaturePart = parts.find(p => p.startsWith('v1='));

    if (!timestampPart || !signaturePart) {
        return false;
    }

    const timestamp = timestampPart.slice(2);
    const providedSignature = signaturePart.slice(3);

    // Check timestamp is within 3 minutes to prevent replay attacks
    const currentTime = Math.floor(Date.now() / 1000);
    const webhookTime = parseInt(timestamp, 10);
    if (Math.abs(currentTime - webhookTime) > 180) {
        return false;
    }

    // Create the signed payload string
    const signedPayload = `${timestamp}.${payload}`;

    // Compute the expected signature
    const expectedSignature = crypto
        .createHmac('sha256', CALENDLY_WEBHOOK_SIGNING_KEY)
        .update(signedPayload)
        .digest('hex');

    // Use timing-safe comparison
    return crypto.timingSafeEqual(
        Buffer.from(providedSignature),
        Buffer.from(expectedSignature)
    );
}

export default router;