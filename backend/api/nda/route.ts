import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.post("/:auctionId", async (req: any, res: any) => {
    try {
        const user = req?.user;

        if (!user) {
            return res.status(401).json({ message: "User not authorized" });
        }

        const userId = user.id;
        const { auctionId } = req.params;

        const nda = await prisma.nda.create({
            data: {
                userId,
                auctionId,
            }
        });

        return res.status(201).json({ message: "NDA signed" });
    } catch (error) {
        return res.status(500).json({ error: "Error signing nda." });
    }
});

export default router;