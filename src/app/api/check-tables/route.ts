import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await pool.connect();
    
    // Check if claims table exists and get its structure
    const result = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'claims'
      ORDER BY ordinal_position;
    `);
    
    client.release();
    
    return NextResponse.json({ 
      status: 'success', 
      tableExists: result.rows.length > 0,
      columns: result.rows 
    });
  } catch (error) {
    console.error('Error checking table structure:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to check table structure', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 