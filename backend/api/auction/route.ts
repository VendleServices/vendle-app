import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get('/', async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const dbUser = await prisma.user.findUnique({
            where: {
                id: user.id,
            }
        });

        const isHomeowner = dbUser?.userType === "homeowner";

        let auctions = [];

        if (isHomeowner) {
            auctions = await prisma.auctionPhase.findMany({
                where: {
                    claim: {
                        user: {
                            id: user.id,
                        }
                    }
                },
                include: {
                    claim: {
                        include: {
                            user: true,
                        },
                    },
                    bids: true,
                },
            })
        } else {
            auctions = await prisma.auctionPhase.findMany({
                where: {
                    participants: {
                        some: {
                            userId: user?.id,
                        }
                    }
                },
                include: {
                    claim: {
                        include: {
                            pdfs: true,
                        }
                    },
                    participants: true,
                    bids: true,
                }
            });
        }

        return res.status(200).json({ auctions });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching auctions "});
    }
});

router.get("/:auctionId", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Error retrieving auction" });
        }

        const { auctionId } = req.params;

        const auction = await prisma.auctionPhase.findUnique({
            where: {
                id: auctionId,
            },
            include: {
                claim: {
                    include: {
                        pdfs: true,
                    }
                },
                bids: true,
                participants: true,
            }
        });

        const totalAuction = {
            ...auction?.claim,
            ...auction,
        }

        return res.status(200).json({ totalAuction });
    } catch (error) {
        return res.status(500).json({ error: "Error retrieving auction" });
    }
});

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

router.post("/:claimId", async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ message: "User not authorized" });
        }

        const { claimId } = req.params;
        const { number, startDate, endDate } = req.body;

        await prisma.claim.update({
            where: {
                id: claimId
            },
            data: {
                status: "ACTIVE"
            }
        });
        
        const newAuction = await prisma.auctionPhase.create({
            data: {
                claimId,
                number,
                startDate,
                endDate,
                status: "ACTIVE"
            }
        });

        const approvedParticipants = await prisma.claimParticipant.findMany({
            where: {
                claimId,
                status: "APPROVED"
            }
        }) || [];

        // assign approved claim participants to this newly created auctionPhase
        if (approvedParticipants?.length > 0) {
            await prisma.claimParticipant.updateMany({
                where: {
                    id: {
                        in: approvedParticipants?.map((p: any) => p.id)
                    }
                },
                data: {
                    auctionPhaseId: newAuction.id
                }
            })
        }

        // invalidate invitations

        await prisma.claimInvitation.deleteMany({
            where: {
                claimId
            }
        });

        return res.status(201).json({ newAuction });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error creating auction" });
    }
});

export default router;