import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  let client;
  try {
    client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        a.auction_id,
        a.claim_id,
        a.title,
        a.description,
        a.status,
        CAST(a.starting_bid AS FLOAT) as starting_bid,
        CAST(COALESCE(MIN(b.amount), a.starting_bid) AS FLOAT) as current_bid,
        COUNT(b.bid_id) as bid_count,
        TO_CHAR(a.auction_end_date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as end_date,
        c.project_type,
        c.design_plan
      FROM auctions a
      LEFT JOIN claims c ON a.claim_id = c.claim_id
      LEFT JOIN bids b ON a.auction_id = b.auction_id
      GROUP BY a.auction_id, a.claim_id, a.title, a.description, a.status, a.starting_bid, a.auction_end_date, c.project_type, c.design_plan
      ORDER BY a.created_at DESC
    `);
    
    console.log('Database query result:', result.rows);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch auctions' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function POST(request: Request) {
  let client;
  try {
    const auctionData = await request.json();
    console.log('Received auction data:', JSON.stringify(auctionData, null, 2));
    
    // Required fields validation
    const requiredFields = [
      'claim_id',
      'title',
      'description',
      'starting_bid',
      'auction_end_date',
      'scope_of_work'
    ];
    
    const missingFields = requiredFields.filter(field => !auctionData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { status: 'error', message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    client = await pool.connect();
    
    const result = await client.query(
      `INSERT INTO auctions (
        claim_id,
        title,
        description,
        starting_bid,
        current_bid,
        auction_end_date,
        scope_of_work,
        photos,
        status
      ) VALUES ($1, $2, $3, $4, $4, $5, $6, $7, 'open')
      RETURNING *`,
      [
        auctionData.claim_id,
        auctionData.title,
        auctionData.description,
        auctionData.starting_bid,
        auctionData.auction_end_date,
        auctionData.scope_of_work,
        auctionData.photos || []
      ]
    );
    
    return NextResponse.json({ 
      status: 'success', 
      auction: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creating auction:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create auction' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function PATCH(request: Request) {
  let client;
  try {
    const { searchParams } = new URL(request.url);
    const auctionId = searchParams.get('id');
    
    if (!auctionId) {
      return NextResponse.json(
        { status: 'error', message: 'Auction ID is required' },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    console.log('Received update data:', updateData);

    client = await pool.connect();
    
    const result = await client.query(
      `UPDATE auctions 
       SET status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE auction_id = $2
       RETURNING *`,
      [updateData.status, auctionId]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Auction not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      status: 'success', 
      auction: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating auction:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to update auction' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function DELETE(request: Request) {
  let client;
  try {
    const { searchParams } = new URL(request.url);
    const auctionId = searchParams.get('id');
    
    if (!auctionId) {
      return NextResponse.json(
        { status: 'error', message: 'Auction ID is required' },
        { status: 400 }
      );
    }

    client = await pool.connect();
    
    // First delete any associated bids
    await client.query(
      'DELETE FROM bids WHERE auction_id = $1',
      [auctionId]
    );
    
    // Then delete the auction
    const result = await client.query(
      'DELETE FROM auctions WHERE auction_id = $1 RETURNING *',
      [auctionId]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Auction not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Auction deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting auction:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to delete auction' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
} 