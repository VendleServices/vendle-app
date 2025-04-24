import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'error', 
    message: 'Please use POST method to add a contractor' 
  });
}

export async function POST() {
  let client;
  try {
    client = await pool.connect();
    
    // Add a contractor user
    const result = await client.query(`
      INSERT INTO users (user_id, email, first_name, last_name, user_type)
      VALUES (2, 'contractor@example.com', 'Contractor', 'User', 'contractor')
      ON CONFLICT (user_id) DO UPDATE 
      SET email = EXCLUDED.email,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          user_type = EXCLUDED.user_type
      RETURNING user_id;
    `);
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Contractor user added successfully',
      userId: result.rows[0]?.user_id
    });
  } catch (error) {
    console.error('Error adding contractor:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to add contractor',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
} 