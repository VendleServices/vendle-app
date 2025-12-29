import { Router } from 'express';
import { prisma } from '../../db/prisma.js';
import multer from 'multer';
import { aiClaimProcessingQueue } from "../../queues/aiClaimProcessingQueue";

// configure multer to store uploaded files in memory as a buffer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const router = Router();

router.get("/", async (req: any, res: any) => {
  try {
    const user = req?.user;
    const userId = user?.id;

    const claims = await prisma.claim.findMany({
      where: {
        status: "PENDING",
        claimParticipants: {
          none: {
            userId: userId,
          },
        },
        claimInvitations: {
          none: {
            contractorId: userId,
          },
        },
      },
      include: {
        claimParticipants: true,
        claimInvitations: true,
      }
    }) || [];

    return res.status(200).json({ claims });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching claims" });
  }
});

router.get("/contractorClaims", async (req: any, res: any) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    console.log(user?.id)

    const claims = await prisma.claim.findMany({
      where: {
        claimParticipants: {
          some: {
            userId: user?.id,
          }
        },
        status: "PENDING"
      },
      include: {
        claimParticipants: true,
      }
    }) || [];

    return res.status(200).json({ claims });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching contractor claims" });
  }
});

router.get('/userClaims', async (req: any, res) => {
  try {
    const user = req?.user;
    if (!user) {
      return res.status(401).json({ error: 'Not Authorized' });
    }

    const claims = await prisma.claim.findMany({
      where: {
        userId: user.id,
        status: "PENDING"
      },
      include: {
        auctionPhases: true,
        user: true,
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
      },
      include: {
        auctionPhases: true,
        user: true,
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

router.post('/', upload.single('file'), async (req: any, res) => {
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
        hasFunctionalUtilities: claimData.hasFunctionalUtilities === "true",
        hasDumpster: claimData.hasDumpster === "true",
        isOccupied: claimData.isOccupied === "true",
        phase1Start: claimData.phase1Start,
        phase1End: claimData.phase1End,
        phase2Start: claimData.phase2Start,
        phase2End: claimData.phase2End,
        projectType: claimData.projectType,
        designPlan: claimData.designPlan,
        needsAdjuster: claimData.needsAdjuster === "true",
        userId: user.id,
        title: claimData.title,
        totalJobValue: Number(claimData.totalJobValue),
        overheadAndProfit: Number(claimData.overheadAndProfit),
        costBasis: claimData.costBasis,
        materials: Number(claimData.materials),
        salesTaxes: Number(claimData.salesTaxes),
        depreciation: Number(claimData.depreciation),
        reconstructionType: claimData.reconstructionType,
        fundingSource: claimData.fundingSource,
        additionalNotes: claimData.additionalNotes,
      }
    });

    const imageData = JSON.parse(claimData?.imageUrls)?.map((url: string) => ({
      supabase_url: url,
      claimId: createdClaim.id
    })) || [];

    await prisma.image.createMany({
      data: imageData,
    });

    const pdfData = JSON.parse(claimData?.pdfUrls)?.map((url: string) => ({
      supabase_url: url,
      claimId: createdClaim.id
    })) || [];

    await prisma.claimPdf.createMany({
      data: pdfData,
    });

    const file = req.file;
    const filePath = file.path;
    const mimeType = file.mimeType;
    console.log('Claim created successfully:', createdClaim.id);

    await aiClaimProcessingQueue.add('process-claim-document', { filePath, mimeType, user, claimId: createdClaim.id });

    return res.status(201).json({ claim: createdClaim });
  } catch (error) {
    console.error('Error creating claim:', error);
    return res.status(500).json({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.put("/:claimId", async (req: any, res: any) => {
  const user = req?.user;

  if (!user) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { aiClaimSummary } = req.body;
  const { claimId } = req.params;

  if (!aiClaimSummary || typeof aiClaimSummary !== "string") {
    return res.status(400).json({ error: "Issue with ai claim summary" });
  }

  const updatedClaim = await prisma.claim.update({
    where: {
      id: claimId
    },
    data: {
      aiSummary: aiClaimSummary,
    }
  });

  return res.status(200).json({ claim: updatedClaim });
});

export default router;
