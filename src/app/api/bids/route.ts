import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let client;
  try {
    const bidData = await request.json();
    console.log('Received bid data:', JSON.stringify(bidData, null, 2));

    // Required fields validation
    const requiredFields = ['auction_id', 'contractor_id', 'amount'];
    const missingFields = requiredFields.filter(field => !bidData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { status: 'error', message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    client = await pool.connect();

    // First, check if the auction exists and is still open
    const auctionResult = await client.query(
      `SELECT status, current_bid, auction_end_date 
       FROM auctions 
       WHERE auction_id = $1`,
      [bidData.auction_id]
    );

    if (auctionResult.rows.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Auction not found' },
        { status: 404 }
      );
    }

    const auction = auctionResult.rows[0];

    // Check if auction is still open
    if (auction.status !== 'open') {
      return NextResponse.json(
        { status: 'error', message: 'Auction is no longer open for bidding' },
        { status: 400 }
      );
    }

    // Check if auction end date has passed
    if (new Date(auction.auction_end_date) < new Date()) {
      return NextResponse.json(
        { status: 'error', message: 'Auction has ended' },
        { status: 400 }
      );
    }

    // Check if bid is lower than current bid
    if (parseFloat(bidData.amount) >= parseFloat(auction.current_bid)) {
      return NextResponse.json(
        { status: 'error', message: 'Bid must be lower than current bid' },
        { status: 400 }
      );
    }

    // Start a transaction
    await client.query('BEGIN');

    try {
      // Insert the new bid
      const bidResult = await client.query(
        `INSERT INTO bids (
          auction_id,
          contractor_id,
          amount,
          status
        ) VALUES ($1, $2, $3, 'active')
        RETURNING *`,
        [
          bidData.auction_id,
          bidData.contractor_id,
          bidData.amount
        ]
      );

      // Update the auction's current bid and bid count
      await client.query(
        `UPDATE auctions 
         SET current_bid = $1,
             bid_count = bid_count + 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE auction_id = $2`,
        [bidData.amount, bidData.auction_id]
      );

      // Commit the transaction
      await client.query('COMMIT');

      return NextResponse.json({
        status: 'success',
        bid: bidResult.rows[0]
      });
    } catch (error) {
      // Rollback the transaction if anything fails
      await client.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error submitting bid:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to submit bid' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Get all bids for an auction
export async function GET(request: Request) {
  let client;
  try {
    const { searchParams } = new URL(request.url);
    const auctionId = searchParams.get('auction_id');

    if (!auctionId) {
      return NextResponse.json(
        { status: 'error', message: 'Auction ID is required' },
        { status: 400 }
      );
    }

    client = await pool.connect();

    const result = await client.query(
      `SELECT 
        b.bid_id,
        b.amount,
        b.status,
        b.created_at,
        u.first_name,
        u.last_name,
        u.email as bidder_email,
        u.phone as bidder_phone,
        c.company_name as bidder_company,
        c.rating as bidder_rating,
        c.review_count as bidder_reviews,
        CONCAT(u.first_name, ' ', u.last_name) as contractor_name
       FROM bids b
       JOIN users u ON b.contractor_id = u.user_id
       LEFT JOIN contractors c ON u.user_id = c.user_id
       WHERE b.auction_id = $1
       ORDER BY b.amount ASC`,
      [auctionId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching bids:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch bids' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
} 