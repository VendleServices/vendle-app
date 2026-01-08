import { Router } from 'express';
import { prisma } from '../../db/prisma.js';
import { emailQueue } from "../../queues/emailQueue";

const router = Router();

router.get('/', async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "not authorized" });
        }

        const claimInvitations = await prisma.claimInvitation.findMany({
            where: {
                contractorId: user.id,
                status: "PENDING",
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
                claimId,
                invitedBy: user.id
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

        const contractor = await prisma.user.findFirst({
            where: {
                id: contractorId,
            }
        });

        await emailQueue.add('invite-contractor', { email: contractor?.email || "", subject: "You're invited!", message: "You have been invited to participate in a restoration. Please visit Vendle to view the invitation!" });

        return res.status(201).json({ newInvitation });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error creating claim invitation" });
    }
});

router.put("/:invitationId", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const { invitationId } = req.params;
        const { invitationAccepted } = req.body;

        const updatedInvitation = await prisma.claimInvitation.update({
            where: {
                id: invitationId,
            },
            data: {
                status: invitationAccepted ? 'ACCEPTED' : "DECLINED"
            }
        });

        if (invitationAccepted) {
            await prisma.claimParticipant.create({
                data: {
                    claimId: updatedInvitation.claimId,
                    userId: user.id,
                    invitedBy: updatedInvitation?.invitedBy,
                    status: "APPROVED"
                }
            });
        }

        return res.status(200).json({ updatedInvitation });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error updating invitation status "})
    }
});

export default router;