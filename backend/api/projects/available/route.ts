import { Router } from 'express';
import { pool } from '../../../lib/db.js';

const router = Router();

// GET /api/projects/available - Get available projects
router.get('/', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT * FROM projects WHERE status = \'available\' ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching available projects:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch available projects' });
  } finally {
    if (client) client.release();
  }
});

export default router; 