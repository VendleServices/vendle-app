import { Router } from 'express';
import { prisma } from "../../db/prisma";

const router = Router();

router.get('/', async (req, res) => {
  res.json({ status: 'success', message: 'FEMA claim endpoint ready' });
});

router.post('/', async (req: any, res) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const femaData = req.body;

    const femaSubmission = await prisma.fema.create({
      data: {
        ...femaData,
        userId: user.id
      }
    });

    return res.status(201).json({ femaSubmission });
  } catch (error) {
    console.error('Error processing FEMA claim:', error);
    res.status(500).json({ status: 'error', message: 'Failed to process FEMA claim' });
  }
});

export default router;