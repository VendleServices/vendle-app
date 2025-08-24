import { Router } from 'express';
import { prisma } from "../../db/prisma";

const router = Router();

// POST /api/bids - Create new bid
router.post('/', async (req: any, res) => {
  try {
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: "User not authorized" });
    }

    const bidData = req.body;

    const bid = await prisma.bid.create({
      data: {
        ...bidData,
        userId: user.id,
      }
    });

    return res.status(201).json({ bid });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error creating bid" });
  }
});

router.get('/:auctionId', async (req: any, res) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({ error: "User not authorized" });
    }

    const { auctionId } = req.params;

    const bids = await prisma.bid.findMany({
      where: {
        auctionId,
      }
    }) || [];

    return res.status(200).json({ bids });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error retrievings bids" });
  }
});

export default router; 