import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get("/:claimId", async (req: any, res: any) => {
    try {
        const user = req?.user;

        if (!user) {
            return res.status(401).json({ message: "User not authorized" });
        }

        const { claimId } = req.params;

        const auctions = await prisma.auctionPhase.findMany({
            where: {
                claimId
            }
        });

        return res.status(200).json({ auctions });
    } catch (error) {
        return res.status(500).json({ error: `Error fetching auctions for claim ${req.params.claimId}` });
    }
});

export default router;