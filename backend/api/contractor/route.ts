import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get("/contractors", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const contractors = await prisma.user.findMany({
            where: {
                userType: "contractor",
            }
        }) || [];

        return res.status(200).json({ contractors });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching contractors" });
    }
});

export default router;