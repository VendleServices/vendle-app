import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get('/:claimId', async (req: any, res: any) => {
    try {
        const user = req?.user;

        if (!user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const { claimId } = req.params;

        const pdfs = await prisma.claimPdf.findMany({
            where: {
                claimId,
            }
        }) || [];

        return res.status(200).json({ pdfs });
    } catch (error) {
        return res.status(500).json({ error: "Error getting claim pdfs" });
    }
});

export default router;