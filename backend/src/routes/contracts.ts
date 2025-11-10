import { Router } from 'express';
import { prisma } from '../../db/prisma.js';
import { AuthenticatedRequest, requireUser, requireContractor, requireHomeowner } from '../middleware/auth.js';
import { completeContract } from '../services/stateMachine.js';
import { MilestoneStatus } from '@prisma/client';

const router = Router();

/**
 * GET /api/contracts
 * List contracts (filtered by status)
 */
router.get('/', requireUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { status } = req.query;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    // Filter by role
    if (userRole === 'contractor') {
      where.contractorId = userId;
    } else {
      where.claim = { userId };
    }

    const contracts = await prisma.contract.findMany({
      where,
      include: {
        claim: true,
        contractor: true,
        winningBid: true,
        milestones: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ contracts });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

/**
 * GET /api/contracts/metrics
 * Dashboard metrics for contractor
 */
router.get('/metrics', requireContractor, async (req: AuthenticatedRequest, res) => {
  try {
    const contractorId = req.user!.id;

    // Count auctions available to bid
    const availableAuctions = await prisma.auction.count({
      where: {
        status: 'open',
        auctionEndDate: { gt: new Date() }
      }
    });

    const availableAuctionsValue = await prisma.auction.aggregate({
      where: {
        status: 'open',
        auctionEndDate: { gt: new Date() }
      },
      _sum: { startingBid: true }
    });

    // IOI phase negotiations (where contractor is the winning bidder)
    const ioiNegotiations = await prisma.negotiation.count({
      where: {
        phase: 'IOI',
        status: 'pending',
        winningBid: { userId: contractorId }
      }
    });

    const ioiValue = await prisma.negotiation.findMany({
      where: {
        phase: 'IOI',
        status: 'pending',
        winningBid: { userId: contractorId }
      },
      include: { winningBid: true }
    });

    // LOI phase
    const loiNegotiations = await prisma.negotiation.count({
      where: {
        phase: 'LOI',
        status: { in: ['pending', 'accepted'] },
        winningBid: { userId: contractorId }
      }
    });

    const loiValue = await prisma.negotiation.findMany({
      where: {
        phase: 'LOI',
        status: { in: ['pending', 'accepted'] },
        winningBid: { userId: contractorId }
      },
      include: { winningBid: true }
    });

    // Active contracts
    const activeContracts = await prisma.contract.count({
      where: {
        contractorId,
        status: 'active'
      }
    });

    const activeValue = await prisma.contract.aggregate({
      where: {
        contractorId,
        status: 'active'
      },
      _sum: { valueCents: true }
    });

    res.json({
      availableToBidCount: availableAuctions,
      availableToBidValueCents: Math.round((availableAuctionsValue._sum.startingBid || 0) * 100),
      ioiCount: ioiNegotiations,
      ioiValueCents: Math.round(ioiValue.reduce((sum, n) => sum + n.winningBid.amount, 0) * 100),
      loiCount: loiNegotiations,
      loiValueCents: Math.round(loiValue.reduce((sum, n) => sum + n.winningBid.amount, 0) * 100),
      activeCount: activeContracts,
      activeValueCents: activeValue._sum.valueCents || 0
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

/**
 * GET /api/contracts/:id
 * Get contract details
 */
router.get('/:id', requireUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        claim: true,
        contractor: true,
        winningBid: true,
        milestones: {
          orderBy: { createdAt: 'asc' }
        },
        reviews: true
      }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Verify permission
    const isContractor = contract.contractorId === userId;
    const isHomeowner = contract.claim.userId === userId;

    if (!isContractor && !isHomeowner) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ contract });
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({ error: 'Failed to fetch contract' });
  }
});

/**
 * POST /api/contracts/:id/milestones/:milestoneId/submit
 * Contractor submits milestone for approval
 */
router.post('/:id/milestones/:milestoneId/submit', requireContractor, async (req: AuthenticatedRequest, res) => {
  try {
    const { id, milestoneId } = req.params;
    const contractorId = req.user!.id;

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: { milestones: true }
    });

    if (!contract || contract.contractorId !== contractorId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: MilestoneStatus.submitted }
    });

    res.json({ milestone });
  } catch (error) {
    console.error('Error submitting milestone:', error);
    res.status(500).json({ error: 'Failed to submit milestone' });
  }
});

/**
 * POST /api/contracts/:id/milestones/:milestoneId/approve
 * Client approves milestone
 */
router.post('/:id/milestones/:milestoneId/approve', requireHomeowner, async (req: AuthenticatedRequest, res) => {
  try {
    const { id, milestoneId } = req.params;
    const userId = req.user!.id;

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: { claim: true }
    });

    if (!contract || contract.claim.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: MilestoneStatus.approved }
    });

    res.json({ milestone });
  } catch (error) {
    console.error('Error approving milestone:', error);
    res.status(500).json({ error: 'Failed to approve milestone' });
  }
});

/**
 * POST /api/contracts/:id/milestones/:milestoneId/pay
 * Mark milestone as paid (placeholder for Stripe integration)
 */
router.post('/:id/milestones/:milestoneId/pay', requireHomeowner, async (req: AuthenticatedRequest, res) => {
  try {
    const { id, milestoneId } = req.params;
    const userId = req.user!.id;

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: { claim: true, milestones: true }
    });

    if (!contract || contract.claim.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: MilestoneStatus.paid }
    });

    // Check if all milestones are paid
    const allPaid = contract.milestones.every(m => 
      m.id === milestoneId || m.status === MilestoneStatus.paid
    );

    if (allPaid) {
      await completeContract(id);
    }

    res.json({ milestone });
  } catch (error) {
    console.error('Error marking milestone as paid:', error);
    res.status(500).json({ error: 'Failed to mark milestone as paid' });
  }
});

export default router;
