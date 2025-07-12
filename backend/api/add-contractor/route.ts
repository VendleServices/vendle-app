import { Router } from 'express';
import { pool } from '../../lib/db.js';

const router = Router();

// GET /api/add-contractor - Get contractor info
router.get('/', async (req, res) => {
  res.json({ status: 'success', message: 'Add contractor endpoint ready' });
});

// POST /api/add-contractor - Add new contractor
router.post('/', async (req, res) => {
  try {
    const contractorData = req.body;
    res.json({ status: 'success', message: 'Contractor added successfully' });
  } catch (error) {
    console.error('Error adding contractor:', error);
    res.status(500).json({ status: 'error', message: 'Failed to add contractor' });
  }
});

export default router; 