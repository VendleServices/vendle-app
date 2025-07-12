import { Router } from 'express';
import { pool } from '../../lib/db.js';

const router = Router();

// GET /api/claim - Get all claims
router.get('/', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT * FROM claims ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch claims' });
  } finally {
    if (client) client.release();
  }
});

// POST /api/claim - Create new claim
router.post('/', async (req, res) => {
  let client;
  try {
    const claimData = req.body;
    client = await pool.connect();
    
    const result = await client.query(
      'INSERT INTO claims (user_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [claimData.user_id, claimData.title, claimData.description, 'pending']
    );
    
    res.json({ status: 'success', claim: result.rows[0] });
  } catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create claim' });
  } finally {
    if (client) client.release();
  }
});

export default router;