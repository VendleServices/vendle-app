import { Router } from 'express';
import { prisma } from '../../db/prisma.js';
import { getUser } from '../../auth/server.js';

const router = Router();

router.get('/:claimId', async (req, res) => {
  try {
    const { claimId } = req.params;

    const user = await getUser(req);

    if (!user) {
      return res.status(401).json({ error: 'No user found' });
    }

    const claim = await prisma.claim.findUnique({
      where: {
        id: claimId,
        userId: user.id
      }
    });

    return res.status(200).json({ claim });
  } catch (error) {
    console.error('Error fetching claim:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:claimId', async (req, res) => {
  try {
    const { claimId } = req.params;

    const user = await getUser(req);
    if (!user) {
      return res.status(401).json({ error: 'No user found' });
    }

    await prisma.claim.delete({
      where: {
        id: claimId,
        userId: user.id
      }
    });

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error deleting claim:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const claimData = req.body; // Assumes body-parser middleware is used

    await prisma.claim.create({
      data: {
        ...claimData,
        userId: user.id
      }
    });

    return res.status(201).json({ data: claimData });
  } catch (error) {
    console.error('Error creating claim:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
