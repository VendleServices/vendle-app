import { Router } from 'express';
import { pool } from '../../lib/db.js';

const router = Router();

// GET /api/onboarding - Get onboarding status
router.get('/', async (req, res) => {
  res.json({ status: 'success', message: 'Onboarding endpoint ready' });
});

// POST /api/onboarding - Submit onboarding data
router.post('/', async (req, res) => {
  try {
    const onboardingData = req.body;
    res.json({ status: 'success', message: 'Onboarding data received' });
  } catch (error) {
    console.error('Error processing onboarding:', error);
    res.status(500).json({ status: 'error', message: 'Failed to process onboarding' });
  }
});

export default router;