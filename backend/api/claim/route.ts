import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

// GET /api/claim - Get claims for a specific user
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'user_id is required' 
      });
    }

    const claims = await prisma.claim.findMany({
      where: {
        userId: user_id as string
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(claims);
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch claims' });
  }
});

// POST /api/claim - Create new claim
router.post('/', async (req, res) => {
  try {
    const claimData = req.body;
    
    const claim = await prisma.claim.create({
      data: {
        userId: claimData.user_id,
        street: claimData.street || '',
        city: claimData.city || '',
        state: claimData.state || '',
        zipCode: claimData.zipCode || '',
        projectType: claimData.projectType || '',
        designPlan: claimData.designPlan || '',
        insuranceEstimateFilePath: claimData.insuranceEstimateFilePath || '',
        needsAdjuster: claimData.needsAdjuster || false,
        insuranceProvider: claimData.insuranceProvider || ''
      }
    });
    
    res.json({ status: 'success', claim });
  } catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create claim' });
  }
});

export default router;