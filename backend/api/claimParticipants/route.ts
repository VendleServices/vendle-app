import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get("/:claimId", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { claimId } = req.params;

        const claimParticipants = await prisma.claimParticipant.findMany({
            where: {
                claimId
            },
            include: {
                user: true
            }
        });

        return res.status(200).json({ claimParticipants });
    } catch (error) {
        return res.status(500).json({ error: `Error fetching claim participants for ${ req.params.claimId }` });
    }
});

router.get("/:claimId/auctionPhase/:auctionPhaseId", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { claimId, auctionPhaseId } = req.params;

        const claimParticipants = await prisma.claimParticipant.findMany({
            where: {
                claimId,
                auctionPhaseId
            }
        });

        return res.status(200).json({ claimParticipants });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching claim auction participants." });
    }
});

router.post("/:claimId", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { claimId } = req.params;

        const claimParticipant = await prisma.claimParticipant.create({
            data: {
                claimId,
                userId: user?.id
            }
        });

        return res.status(201).json({ claimParticipant });
    } catch (error) {
        return res.status(500).json({ error: "Error creating claim participant" });
    }
});

router.put("/status/:claimParticipantId", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { claimParticipantId } = req.params;
        const { newStatus } = req.body;

        const updatedParticipant = await prisma.claimParticipant.update({
            where: {
                id: claimParticipantId
            },
            data: {
                status: newStatus
            }
        });

        return res.status(200).json({ updatedParticipant });
    } catch (error) {
        return res.status(500).json({ error: "Error updating status of claim participant" });
    }
})

export default router;