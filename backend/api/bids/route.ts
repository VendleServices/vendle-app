import { Router } from 'express';
import { pool } from '../../lib/db.js';

const router = Router();

// GET /api/bids - Get all bids
router.get('/', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT * FROM bids ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch bids' });
  } finally {
    if (client) client.release();
  }
});

// POST /api/bids - Create new bid
router.post('/', async (req, res) => {
  let client;
  try {
    const bidData = req.body;
    client = await pool.connect();
    
    const result = await client.query(
      'INSERT INTO bids (auction_id, contractor_id, amount, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [bidData.auction_id, bidData.contractor_id, bidData.amount, bidData.description]
    );
    
    res.json({ status: 'success', bid: result.rows[0] });
  } catch (error) {
    console.error('Error creating bid:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create bid' });
  } finally {
    if (client) client.release();
  }
});

export default router; 