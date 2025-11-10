import { Router } from 'express';
import { prisma } from '../../db/prisma.js';
import { AuthenticatedRequest, requireUser } from '../middleware/auth.js';
import { ScheduleEventKind } from '@prisma/client';

const router = Router();

/**
 * GET /api/schedule
 * Get schedule events for user (includes milestones and schedule events)
 */
router.get('/', requireUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { range } = req.query; // Expected format: "2025-01-01..2025-01-31"
    const userId = req.user!.id;
    const userRole = req.user!.role;

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (range && typeof range === 'string') {
      const [start, end] = range.split('..');
      startDate = new Date(start);
      endDate = new Date(end);
    }

    // Get schedule events
    const scheduleEvents = await prisma.scheduleEvent.findMany({
      where: {
        userId,
        ...(startDate && endDate ? {
          startsAt: {
            gte: startDate,
            lte: endDate
          }
        } : {})
      },
      include: {
        claim: true
      },
      orderBy: { startsAt: 'asc' }
    });

    // Get milestone deadlines for contractor
    let milestoneEvents: any[] = [];
    if (userRole === 'contractor') {
      const contracts = await prisma.contract.findMany({
        where: {
          contractorId: userId,
          status: 'active'
        },
        include: {
          milestones: {
            where: {
              dueDate: startDate && endDate ? {
                gte: startDate,
                lte: endDate
              } : undefined,
              status: { in: ['pending', 'submitted'] }
            }
          },
          claim: true
        }
      });

      milestoneEvents = contracts.flatMap(contract =>
        contract.milestones.map(milestone => ({
          id: `milestone-${milestone.id}`,
          kind: 'milestone_deadline',
          title: milestone.title,
          description: milestone.description,
          startsAt: milestone.dueDate,
          endsAt: milestone.dueDate,
          claim: contract.claim,
          contractId: contract.id,
          milestoneId: milestone.id
        }))
      );
    }

    // Combine and sort
    const allEvents = [
      ...scheduleEvents.map(e => ({
        id: e.id,
        kind: e.kind,
        title: e.title,
        description: e.description,
        startsAt: e.startsAt,
        endsAt: e.endsAt,
        claim: e.claim,
        claimId: e.claimId
      })),
      ...milestoneEvents
    ].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

    res.json({ events: allEvents });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

/**
 * POST /api/projects/:claimId/site-visits
 * Create site visit event
 */
router.post('/:claimId/site-visits', requireUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { claimId } = req.params;
    const { startsAt, endsAt, title, description } = req.body;
    const userId = req.user!.id;

    // Verify user has access to claim
    const claim = await prisma.claim.findUnique({
      where: { id: claimId },
      include: { 
        contracts: {
          where: { contractorId: userId }
        }
      }
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    const isClaimOwner = claim.userId === userId;
    const isContractor = claim.contracts.length > 0;

    if (!isClaimOwner && !isContractor) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const event = await prisma.scheduleEvent.create({
      data: {
        claimId,
        userId,
        kind: ScheduleEventKind.site_visit,
        title: title || 'Site Visit',
        description,
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null
      }
    });

    res.json({ event });
  } catch (error) {
    console.error('Error creating site visit:', error);
    res.status(500).json({ error: 'Failed to create site visit' });
  }
});

/**
 * DELETE /api/schedule/:eventId
 * Delete schedule event
 */
router.delete('/:eventId', requireUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user!.id;

    const event = await prisma.scheduleEvent.findUnique({
      where: { id: eventId }
    });

    if (!event || event.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.scheduleEvent.delete({
      where: { id: eventId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
