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
                    },
                    status: "ACTIVE"
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
                    },
                    status: "ACTIVE"
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
                bids: {
                    include: {
                        user: true,
                    }
                },
                participants: true,
            }
        });

        const expandedBidInfo = auction?.bids?.map((bid: any) => ({
            contractor_id: bid?.userId,
            contractor_name: '',
            bid_amount: bid?.amount,
            bid_description: '',
            phone_number: bid?.user?.companyWebsite,
            email: bid?.user?.email,
            company_name: bid?.user?.companyName,
            company_website: bid?.user.phoneNumber,
            license_number: null,
            years_experience: null,
        })) || [];

        let phase1Bids: any = []

        if (auction?.number === 2) {
            const claimId = auction?.claimId;
            const auctionPhaseOne = await prisma.auctionPhase.findFirst({
                where: {
                    claimId,
                    number: 1
                },
                include: {
                    bids: {
                        include: {
                            user: true,
                        }
                    },
                }
            });

            phase1Bids = auctionPhaseOne?.bids || [];
        }

        const totalAuction = {
            ...auction?.claim,
            ...auction,
            phase1Bids: phase1Bids,
            expandedBidInfo
        }

        return res.status(200).json({ totalAuction });
    } catch (error) {
        return res.status(500).json({ error: "Error retrieving auction" });
    }
});

router.put("/:auctionId", async (req: any, res: any) => {
    const user = req?.user;
    if (!user) {
        return res.status(401).json({ error: "Not authorized" });
    }

    const { auctionId } = req.params;
    const { selectedParticipants } = req.body;

    if (!Array.isArray(selectedParticipants) || selectedParticipants.length === 0) {
        return res.status(400).json({ error: "No participants selected" });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const auction = await tx.auctionPhase.findUnique({
                where: { id: auctionId },
                include: { claim: true }
            });

            if (!auction) {
                throw new Error("Auction not found");
            }

            if (auction.status === "CLOSED") {
                throw new Error("Auction already closed");
            }

            // permission check
            if (auction.claim.userId !== user.id) {
                throw new Error("Forbidden");
            }

            // close phase 1
            await tx.auctionPhase.update({
                where: { id: auctionId },
                data: { status: "CLOSED" }
            });

            // create phase 2
            const phase2 = await tx.auctionPhase.create({
                data: {
                    claimId: auction.claimId,
                    number: auction.number + 1,
                    startDate: auction.claim.phase2Start,
                    endDate: auction.claim.phase2End,
                    status: "ACTIVE"
                }
            });

            // update phase 1 participants
            await tx.claimParticipant.updateMany({
                where: {
                    claimId: auction.claimId,
                    auctionPhaseId: auctionId,
                    userId: { in: selectedParticipants }
                },
                data: { status: "ADVANCED" }
            });

            await tx.claimParticipant.updateMany({
                where: {
                    claimId: auction.claimId,
                    auctionPhaseId: auctionId,
                    userId: { notIn: selectedParticipants }
                },
                data: { status: "REJECTED" }
            });

            // create phase 2 participants
            await tx.claimParticipant.createMany({
                data: selectedParticipants.map((userId: string) => ({
                    userId,
                    claimId: auction.claimId,
                    status: "APPROVED",
                    invitedBy: user.id,
                    auctionPhaseId: phase2.id
                }))
            });

            return phase2;
        });

        return res.status(201).json({ phase2Auction: result });
    } catch (error: any) {
        return res.status(500).json({ error: error.message || "Error updating auction" });
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