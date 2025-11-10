import { prisma } from '../../db/prisma.js';
import { advanceFromAuctionClosedToIOI } from '../services/stateMachine.js';

/**
 * Cron job to auto-close expired auctions
 * Runs every 5 minutes to check for auctions that have ended
 */
export async function closeExpiredAuctions() {
  try {
    console.log('[CRON] Checking for expired auctions...');

    // Find all open auctions that have ended
    const expiredAuctions = await prisma.auction.findMany({
      where: {
        status: 'open',
        auctionEndDate: {
          lt: new Date()
        }
      },
      include: {
        bids: true
      }
    });

    console.log(`[CRON] Found ${expiredAuctions.length} expired auctions`);

    // Close each expired auction
    for (const auction of expiredAuctions) {
      try {
        console.log(`[CRON] Closing auction ${auction.id} (${auction.title})`);
        
        const result = await advanceFromAuctionClosedToIOI(auction.id);
        
        if (result.negotiation) {
          console.log(`[CRON] Created IOI negotiation for auction ${auction.id}`);
        } else {
          console.log(`[CRON] Closed auction ${auction.id} with no bids`);
        }
      } catch (error) {
        console.error(`[CRON] Error closing auction ${auction.id}:`, error);
        // Continue with other auctions
      }
    }

    console.log('[CRON] Expired auctions check complete');
  } catch (error) {
    console.error('[CRON] Error in closeExpiredAuctions:', error);
  }
}

// Export interval (5 minutes in milliseconds)
export const CLOSE_AUCTIONS_INTERVAL = 5 * 60 * 1000;
