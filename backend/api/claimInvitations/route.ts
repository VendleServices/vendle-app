import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get('/', async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "not authorized" });
        }

        const claimInvitations = await prisma.claimInvitation.findMany({
            where: {
                contractorId: user.id
            },
            include: {
                claim: {
                    include: {
                        user: {
                            select: {
                                email: true
                            }
                        }
                    }
                }
            }
        }) || [];

        return res.status(200).json({ claimInvitations });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching invitations" });
    }
});

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
                invitedBy: user?.id || "Anonymous",
            }
        });

        return res.status(201).json({ newInvitation });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error creating claim invitation" });
    }
});

router.put("/:invitationId/accept", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { invitationId } = req.params;

        // Update invitation status to ACCEPTED
        const updatedInvitation = await prisma.claimInvitation.update({
            where: {
                id: invitationId
            },
            data: {
                status: "ACCEPTED"
            }
        });

        // Create claim participant
        const participant = await prisma.claimParticipant.create({
            data: {
                claimId: updatedInvitation.claimId,
                userId: user.id,
                invitedBy: updatedInvitation.invitedBy,
            }
        });

        return res.status(200).json({ invitation: updatedInvitation, participant });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error accepting invitation" });
    }
});

router.put("/:invitationId/decline", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { invitationId } = req.params;

        const updatedInvitation = await prisma.claimInvitation.update({
            where: {
                id: invitationId
            },
            data: {
                status: "DECLINED"
            }
        });

        return res.status(200).json({ invitation: updatedInvitation });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error declining invitation" });
    }
});

export default router;