import { Router } from 'express';
import { pool } from '../../lib/db.js';

const router = Router();

// GET /api/auctions - Get all auctions
router.get('/', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        a.auction_id,
        a.claim_id,
        a.title,
        a.description,
        a.status,
        CAST(a.starting_bid AS FLOAT) as starting_bid,
        CAST(COALESCE(MIN(b.amount), a.starting_bid) AS FLOAT) as current_bid,
        COUNT(b.bid_id) as bid_count,
        TO_CHAR(a.auction_end_date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as end_date,
        CAST(a.total_job_value AS FLOAT) as total_job_value,
        CAST(a.overhead_and_profit AS FLOAT) as overhead_and_profit,
        a.cost_basis,
        CAST(a.materials AS FLOAT) as materials,
        CAST(a.sales_taxes AS FLOAT) as sales_taxes,
        CAST(a.depreciation AS FLOAT) as depreciation,
        a.reconstruction_type,
        a.needs_3rd_party_adjuster,
        a.has_deductible_funds,
        a.funding_source,
        a.scope_of_work,
        a.photos,
        'General Restoration' as project_type,
        'Standard' as design_plan,
        'Property Location' as property_address
      FROM auctions a
      LEFT JOIN bids b ON a.auction_id = b.auction_id
      GROUP BY a.auction_id, a.claim_id, a.title, a.description, a.status, a.starting_bid, a.auction_end_date, 
               a.total_job_value, a.overhead_and_profit, a.cost_basis, a.materials, a.sales_taxes, a.depreciation,
               a.reconstruction_type, a.needs_3rd_party_adjuster, a.has_deductible_funds, a.funding_source,
               a.scope_of_work, a.photos
      ORDER BY a.created_at DESC
    `);
    
    console.log('Database query result:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch auctions' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// POST /api/auctions - Create new auction
router.post('/', async (req, res) => {
  let client;
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
    
    const missingFields = requiredFields.filter(field => !auctionData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'error', 
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    client = await pool.connect();
    
    const result = await client.query(
      `INSERT INTO auctions (
        claim_id,
        title,
        description,
        starting_bid,
        current_bid,
        auction_end_date,
        total_job_value,
        overhead_and_profit,
        cost_basis,
        materials,
        sales_taxes,
        depreciation,
        reconstruction_type,
        needs_3rd_party_adjuster,
        has_deductible_funds,
        funding_source,
        scope_of_work,
        photos,
        status
      ) VALUES ($1, $2, $3, $4, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'open')
      RETURNING *`,
      [
        auctionData.claim_id,
        auctionData.title,
        auctionData.description || '',
        auctionData.starting_bid,
        auctionData.auction_end_date,
        auctionData.total_job_value || null,
        auctionData.overhead_and_profit || null,
        auctionData.cost_basis || null,
        auctionData.materials || null,
        auctionData.sales_taxes || null,
        auctionData.depreciation || null,
        auctionData.reconstruction_type || null,
        auctionData.needs_3rd_party_adjuster || false,
        auctionData.has_deductible_funds || false,
        auctionData.funding_source || null,
        auctionData.scope_of_work || null,
        auctionData.photos || null
      ]
    );
    
    res.json({ 
      status: 'success', 
      auction: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create auction' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// PATCH /api/auctions/:id - Update auction
router.patch('/:id', async (req, res) => {
  let client;
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

    client = await pool.connect();
    
    const result = await client.query(
      `UPDATE auctions 
       SET status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE auction_id = $2
       RETURNING *`,
      [updateData.status, auctionId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error', 
        message: 'Auction not found'
      });
    }
    
    res.json({ 
      status: 'success', 
      auction: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating auction:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update auction' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// DELETE /api/auctions/:id - Delete auction
router.delete('/:id', async (req, res) => {
  let client;
  try {
    const auctionId = req.params.id;
    
    if (!auctionId) {
      return res.status(400).json({
        status: 'error', 
        message: 'Auction ID is required'
      });
    }

    client = await pool.connect();
    
    const result = await client.query(
      'DELETE FROM auctions WHERE auction_id = $1 RETURNING *',
      [auctionId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error', 
        message: 'Auction not found'
      });
    }
    
    res.json({ 
      status: 'success', 
      message: 'Auction deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting auction:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete auction' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

export default router; 