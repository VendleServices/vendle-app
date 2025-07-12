import { Router } from 'express';
import { pool } from '../../../lib/db.js';

const router = Router();

// GET /api/start-claim/fema - Get FEMA claim info
router.get('/', async (req, res) => {
  res.json({ status: 'success', message: 'FEMA claim endpoint ready' });
});

// POST /api/start-claim/fema - Submit FEMA claim
router.post('/', async (req, res) => {
  try {
    const femaData = req.body;
    res.json({ status: 'success', message: 'FEMA claim submitted' });
  } catch (error) {
    console.error('Error processing FEMA claim:', error);
    res.status(500).json({ status: 'error', message: 'Failed to process FEMA claim' });
  }
});

export default router;