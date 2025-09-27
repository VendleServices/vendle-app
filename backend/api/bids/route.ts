import { Router } from 'express';
import { prisma } from "../../db/prisma";

const router = Router();

// POST /api/bids - Create new bid
router.post('/:auctionId', async (req: any, res) => {
  try {
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: "User not authorized" });
    }

    const { auctionId } = req.params;
    if (!auctionId) {
        return res.status(404).json({ error: "Auction not found "});
    }

    const bidData = req.body;

    const bid = await prisma.bid.create({
      data: {
        allowance: Number(bidData?.allowance) || 0,
        amount: Number(bidData?.amount) || 0,
        budgetTotal: Number(bidData?.budgetTotal) || 0,
        laborCosts: Number(bidData?.laborCosts) || 0,
        overhead: Number(bidData?.overhead) || 0,
        profit: Number(bidData?.profit) || 0,
        subContractorExpenses: Number(bidData?.subContractorExpenses) || 0,
        bidPdfPath: bidData?.bidPdfPath || '',
        auctionId,
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
      },
      include: {
        user: true,
      },
    }) || [];

    const expandedBidInfo = bids?.map((bid) => ({
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
    }));

    return res.status(200).json({ expandedBidInfo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error retrievings bids" });
  }
});

export default router; 