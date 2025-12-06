import { Router } from 'express';
import { prisma } from '../../db/prisma.js';
import multer from 'multer';
import { processClaimDocument } from "../../utils/processClaimDocument";
import OpenAI from "openai";

// configure multer to store uploaded files in memory as a buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const router = Router();

router.get('/', async (req: any, res) => {
  try {
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: "Not authorized "});
    }

    const auctions = await prisma.auction.findMany({
      include: {
        user: true,
        claim: true,
        ndas: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('Database query result:', auctions);

    const transformedAuctions = auctions.map(auction => ({
      auction_id: auction.id,
      claim_id: auction.claimId,
      title: auction.title,
      status: auction.status,
      starting_bid: auction.startingBid,
      current_bid: auction.currentBid || auction.startingBid,
      bid_count: 0, // TODO: Add bid count logic,
      start_date: auction.createdAt.toISOString(),
      end_date: auction.auctionEndDate.toISOString(),
      property_address: auction.claim ? `${auction.claim.street}, ${auction.claim.city}, ${auction.claim.state}, ${auction.claim.zipCode}` : '',
      project_type: auction.claim?.projectType || '',
      design_plan: auction.claim?.designPlan || '',
      description: auction?.aiSummary || auction?.description || '',
      ndas: auction?.ndas || [],
      userEmail: auction?.user?.email,
      phase1StartDate: auction?.claim?.phase1Start || "",
      phase1EndDate: auction?.claim?.phase1End || "",
      phase2StartDate: auction?.claim?.phase2Start || "",
      phase2EndDate: auction?.claim?.phase2End || "",
      homeownerName: auction?.user?.email,
      insuranceEstimatePdf: auction?.insuranceEstimatePdf || '',
    }));
    
    res.status(200).json({ data: transformedAuctions });
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch auctions' });
  }
});

// POST /api/auctions - Create new auction
router.post('/', upload.single('file'), async (req: any, res) => {
  try {
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: "Not authorized "});
    }

    const file: File = req.file;

    let aiClaimSummary: any = "";

    if (file) {
      aiClaimSummary = await processClaimDocument(file);
      aiClaimSummary = typeof aiClaimSummary === "object" ? aiClaimSummary?.document?.text : aiClaimSummary;

      const response = await openai.responses.create({
        model: "gpt-5",
        input: `Summarize the following information into a short paragraph of 120 words or less: ${aiClaimSummary}`,
      });

      aiClaimSummary = response?.output_text;
    }

    const auctionData = req.body;
    console.log('Received auction data:', JSON.stringify(auctionData, null, 2));

    const auction = await prisma.auction.create({
      data: {
        auctionEndDate: new Date(auctionData.auction_end_date),
        claimId: auctionData.claim_id,
        costBasis: auctionData.cost_basis || null,
        currentBid: parseFloat(auctionData.starting_bid),
        depreciation: parseFloat(auctionData.depreciation) || null,
        description: auctionData.description || '',
        fundingSource: auctionData.funding_source || null,
        hasDeductibleFunds: auctionData?.has_deductible_funds === "true" || false,
        insuranceEstimatePdf: auctionData.insuranceEstimatePdf || '',
        materials: parseFloat(auctionData.materials) || null,
        needs3rdPartyAdjuster: auctionData?.needs_3rd_party_adjuster === "true" || false,
        overheadAndProfit: parseFloat(auctionData.overhead_and_profit) || null,
        reconstructionType: auctionData.reconstruction_type || null,
        salesTaxes: parseFloat(auctionData.sales_taxes) || null,
        startingBid: parseFloat(auctionData.starting_bid),
        status: 'open',
        title: auctionData.title,
        totalJobValue: parseFloat(auctionData.total_job_value) || null,
        userId: user.id,
        aiSummary: aiClaimSummary as string,
      }
    });
    
    return res.status(201).json({ auction });
  } catch (error) {
    console.error('Error creating auction:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to create auction' });
  }
});

router.get('/:auctionId', async (req: any, res) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({ error: "Not authorized "});
    }

    const { auctionId } = req.params;

    const auction = await prisma.auction.findUnique({
      where: {
        id: auctionId,
      },
      include: {
        ndas: true,
      }
    });

    if (!auction) {
      return res.status(404).json({ error: "Auction Not Found" });
    }

    return res.status(200).json({ auction });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error retrieving auction" });
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const auctionId = req.params.id;
    
    if (!auctionId) {
      return res.status(400).json({
        status: 'error', 
        message: 'Auction ID is required'
      });
    }

    const updateData = req.body;
    console.log('Received update data:', updateData);

    const auction = await prisma.auction.update({
      where: { id: auctionId },
      data: {
        status: updateData.status,
        updatedAt: new Date()
      }
    });
    
    res.json({ 
      status: 'success', 
      auction 
    });
  } catch (error) {
    console.error('Error updating auction:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update auction' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const auctionId = req.params.id;
    
    if (!auctionId) {
      return res.status(400).json({
        status: 'error', 
        message: 'Auction ID is required'
      });
    }

    await prisma.auction.delete({
      where: { id: auctionId }
    });
    
    res.json({ 
      status: 'success', 
      message: 'Auction deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting auction:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete auction' });
  }
});

export default router; 