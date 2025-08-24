import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

const sampleBids = [
  {
    contractor_name: 'Smith Construction',
    bidder_rating: 4.8,
    bidder_reviews: 42,
    bidder_email: 'john@smithconstruction.com',
    bidder_phone: '555-0123'
  },
  {
    contractor_name: 'Johnson Builders',
    bidder_rating: 4.6,
    bidder_reviews: 35,
    bidder_email: 'sarah@johnsonbuilders.com',
    bidder_phone: '555-0124'
  },
  {
    contractor_name: 'Chen Contractors',
    bidder_rating: 4.9,
    bidder_reviews: 58,
    bidder_email: 'michael@chencontractors.com',
    bidder_phone: '555-0125'
  },
  {
    contractor_name: 'Rodriguez Renovations',
    bidder_rating: 4.7,
    bidder_reviews: 29,
    bidder_email: 'emily@rodriguezreno.com',
    bidder_phone: '555-0126'
  },
  {
    contractor_name: 'Kim Construction Co.',
    bidder_rating: 4.5,
    bidder_reviews: 31,
    bidder_email: 'david@kimconstruction.com',
    bidder_phone: '555-0127'
  }
];

export async function POST(request: Request) {
  let client;
  try {
    const { auction_id } = await request.json();
    
    if (!auction_id) {
      return NextResponse.json(
        { status: 'error', message: 'Auction ID is required' },
        { status: 400 }
      );
    }

    client = await pool.connect();

    // Start a transaction
    await client.query('BEGIN');

    try {
      // Get the auction's starting bid
      const auctionResult = await client.query(
        'SELECT starting_bid FROM auctions WHERE auction_id = $1',
        [auction_id]
      );

      if (auctionResult.rows?.length === 0) {
        throw new Error('Auction not found');
      }

      const startingBid = auctionResult.rows[0].starting_bid;

      // Insert sample bids
      for (const bid of sampleBids) {
        // Generate a random bid amount between 70% and 95% of starting bid
        const bidAmount = Math.floor(startingBid * (0.7 + Math.random() * 0.25));
        
        // Insert the bid with mock contractor data
        await client.query(
          `INSERT INTO bids (
            auction_id,
            contractor_id,
            amount,
            status,
            contractor_name,
            bidder_rating,
            bidder_reviews,
            bidder_email,
            bidder_phone
          ) VALUES ($1, $2, $3, 'active', $4, $5, $6, $7, $8)`,
          [
            auction_id,
            Math.floor(Math.random() * 1000), // Random contractor ID
            bidAmount,
            bid.contractor_name,
            bid.bidder_rating,
            bid.bidder_reviews,
            bid.bidder_email,
            bid.bidder_phone
          ]
        );
      }

      // Update auction's current bid and bid count
      await client.query(
        `UPDATE auctions 
         SET current_bid = (
           SELECT MIN(amount) FROM bids WHERE auction_id = $1
         ),
         bid_count = (
           SELECT COUNT(*) FROM bids WHERE auction_id = $1
         )
         WHERE auction_id = $1`,
        [auction_id]
      );

      await client.query('COMMIT');

      return NextResponse.json({ status: 'success' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error seeding bids:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to seed bids' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
} 