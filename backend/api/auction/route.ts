import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get('/', async (req: any, res: any) => {
    try {
        const user = req?.user;
        if (!user) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const auctions = await prisma.auctionPhase.findMany({
            where: {
                participants: {
                    some: {
                        userId: user?.id,
                    }
                }
            },
            include: {
                claim: true,
                participants: true,
                bids: true,
            }
        });

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
                claim: true,
                bids: true,
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

        const newAuction = await prisma.auctionPhase.create({
            data: {
                claimId,
                number,
                startDate,
                endDate,
            }
        });

        return res.status(201).json({ newAuction });
    } catch (error) {
        return res.status(500).json({ error: "Error creating auction" });
    }
});

export default router;