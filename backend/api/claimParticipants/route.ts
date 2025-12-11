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

export default router;