import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        
        try {
            // Query to get open claims that are available for bidding
            const result = await client.query(`
                SELECT 
                    c.id,
                    c.status,
                    c.date_created as date,
                    c.property_address as address,
                    c.project_type,
                    c.design_plan,
                    COALESCE(MIN(b.amount), 0) as current_bid,
                    COUNT(b.id) as bid_count,
                    c.auction_end_date as end_date
                FROM claims c
                LEFT JOIN bids b ON c.id = b.claim_id
                WHERE c.status = 'open'
                GROUP BY c.id
                ORDER BY c.date_created DESC
            `);

            return NextResponse.json(result.rows);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error fetching available projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch available projects' },
            { status: 500 }
        );
    }
} 