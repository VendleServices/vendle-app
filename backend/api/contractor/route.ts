import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get("/", async (req: any, res: any) => {
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

router.get("/:contractorId", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { contractorId } = req.params;
        const contractor = await prisma.user.findUnique({
            where: {
                id: contractorId
            }
        });

        const ndaSigned = contractor?.ndaSigned;

        return res.status(200).json({ ndaSigned });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching contractors" });
    }
})

router.put('/:contractorId', async (req: any, res: any) => {
    try {
        const user = req?.user;

        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { contractorId } = req.params;

        const updatedContractor = await prisma.user.update({
            where: {
                id: contractorId
            },
            data: {
                ndaSigned: true
            }
        });

        return res.status(200).json({ updatedContractor });
    } catch (error) {
        return res.status(500).json({ error: "Error signing NDA" });
    }
})

export default router;