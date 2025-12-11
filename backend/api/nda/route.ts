import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.post("/:claimId", async (req: any, res: any) => {
    try {
        const user = req?.user;

        if (!user) {
            return res.status(401).json({ message: "User not authorized" });
        }

        const userId = user.id;
        const { claimId } = req.params;

        const nda = await prisma.nda.create({
            data: {
                userId,
                claimId,
            }
        });

        return res.status(201).json({ message: "NDA signed" });
    } catch (error) {
        return res.status(500).json({ error: "Error signing nda." });
    }
});

router.put("/:ndaId", async (req: any, res: any)=> {
    try {
        const user = req?.user;

        if (!user) {
            return res.status(401).json({ message: "User not authorized" });
        }

        const body = req.body;
        const acceptedStatus: boolean = body?.acceptedStatus;
        const { ndaId } = req.params;
        const claimId = req.query.claimId;

        const updatedNda = await prisma.nda.update({
            where: {
                id: ndaId,
                claimId,
            },
            data: {
                accepted: acceptedStatus,
            }
        });

        return res.status(200).json({ error: "NDA accepted" });
    } catch (error) {
        return res.status(500).json({ error: "Error updating nda status" });
    }
});

export default router;