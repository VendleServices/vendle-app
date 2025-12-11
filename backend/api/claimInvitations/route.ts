import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get("/:claimId", async (req: any, res: any)=> {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { claimId } = req.params;

        const claimInvitations = await prisma.claimInvitation.findMany({
            where: {
                claimId
            }
        });

        return res.status(200).json({ claimInvitations });
    } catch (error) {
        return res.status(500).json({ error: "Error getting claim invitations" });
    }
});

router.post("/:claimId", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { claimId } = req.params;
        const { contractorId } = req.body;

        const newInvitation = await prisma.claimInvitation.create({
            data: {
                claimId,
                contractorId,
            }
        });

        return res.status(201).json({ newInvitation });
    } catch (error) {
        return res.status(500).json({ error: "Error creating claim invitation" });
    }
});

export default router;