import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const auctions = await prisma.auction.findMany({
      include: {
        user: true,
        claim: true
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
      bid_count: 0, // TODO: Add bid count logic
      end_date: auction.auctionEndDate.toISOString(),
      property_address: auction.claim ? `${auction.claim.street}, ${auction.claim.city}, ${auction.claim.state} ${auction.claim.zipCode}` : '',
      project_type: auction.claim?.projectType || '',
      design_plan: auction.claim?.designPlan || '',
      description: auction.description || ''
    }));
    
    res.status(200).json({ data: transformedAuctions });
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch auctions' });
  }
});

// POST /api/auctions - Create new auction
router.post('/', async (req, res) => {
  try {
    const auctionData = req.body;
    console.log('Received auction data:', JSON.stringify(auctionData, null, 2));
    
    // Required fields validation
    const requiredFields = [
      'claim_id',
      'title',
      'starting_bid',
      'auction_end_date'
    ];
    
    const missingFields = requiredFields?.filter(field => !auctionData[field]);
    if (missingFields?.length > 0) {
      return res.status(400).json({
        status: 'error', 
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const auction = await prisma.auction.create({
      data: {
        claimId: auctionData.claim_id,
        title: auctionData.title,
        description: auctionData.description || '',
        startingBid: auctionData.starting_bid,
        currentBid: auctionData.starting_bid,
        auctionEndDate: new Date(auctionData.auction_end_date),
        totalJobValue: auctionData.total_job_value || null,
        overheadAndProfit: auctionData.overhead_and_profit || null,
        costBasis: auctionData.cost_basis || null,
        materials: auctionData.materials || null,
        salesTaxes: auctionData.sales_taxes || null,
        depreciation: auctionData.depreciation || null,
        reconstructionType: auctionData.reconstruction_type || null,
        needs3rdPartyAdjuster: auctionData.needs_3rd_party_adjuster || false,
        hasDeductibleFunds: auctionData.has_deductible_funds || false,
        fundingSource: auctionData.funding_source || null,
        status: 'open',
        userId: auctionData.userId, // <-- use userId
      }
    });
    
    res.json({ 
      status: 'success', 
      auction 
    });
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create auction' });
  }
});

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