import { Router } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get('/', async (req: any, res) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({ error: 'Not Authorized' });
    }

    const claims = await prisma.claim.findMany({
      where: {
        userId: user.id
      }
    }) || [];

    return res.status(200).json({ claims });
  } catch (error) {
    console.error('Error fetching claims:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:claimId', async (req: any, res) => {
  try {
    const { claimId } = req.params;
    const user = req?.user;
    if (!user) {
      return res.status(401).json({ error: 'Not Authorized' });
    }

    const claim = await prisma.claim.findUnique({
      where: {
        id: claimId,
      }
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    return res.status(200).json({ claim });
  } catch (error) {
    console.error('Error fetching claim:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:claimId', async (req: any, res) => {
  try {
    const { claimId } = req.params;

    const user = req?.user;
    if (!user) {
      return res.status(401).json({ error: 'No user found' });
    }

    await prisma.claim.delete({
      where: {
        id: claimId,
      }
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting claim:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req: any, res) => {
  try {
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const claimData = req.body;
    console.log('Creating claim with data:', claimData);
    console.log('User ID:', user.id);

    const createdClaim = await prisma.claim.create({
      data: {
        street: claimData.street,
        city: claimData.city,
        state: claimData.state,
        zipCode: claimData.zipCode,
        damageTypes: claimData.damageTypes,
        hasFunctionalUtilities: claimData.hasFunctionalUtilities,
        hasDumpster: claimData.hasDumpster,
        isOccupied: claimData.isOccupied,
        phase1Start: claimData.phase1Start,
        phase1End: claimData.phase1End,
        phase2Start: claimData.phase2Start,
        phase2End: claimData.phase2End,
        projectType: claimData.projectType,
        designPlan: claimData.designPlan,
        needsAdjuster: claimData.needsAdjuster,
        userId: user.id,
      }
    });

    const imageData = claimData?.imageUrls?.map((url: string) => ({
      supabase_url: url,
      claimId: createdClaim.id
    })) || [];

    await prisma.image.createMany({
      data: imageData,
    });

    const pdfData = claimData?.pdfUrls?.map((url: string) => ({
      supabase_url: url,
      claimId: createdClaim.id
    })) || [];

    await prisma.claimPdf.createMany({
      data: pdfData,
    });

    console.log('Claim created successfully:', createdClaim.id);

    return res.status(201).json({ claim: createdClaim });
  } catch (error) {
    console.error('Error creating claim:', error);
    return res.status(500).json({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
