import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  let client;
  try {
    // In a real application, you would get the user ID from a session or JWT token
    // For now, we'll use the user ID from the query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { status: 'error', message: 'User ID is required' },
        { status: 400 }
      );
    }

    client = await pool.connect();
    
    const result = await client.query(
      'SELECT user_id, email, first_name, last_name, user_type FROM users WHERE user_id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'User not found' },
        { status: 404 }
      );
    }
    
    const user = result.rows[0];
    
    return NextResponse.json({ 
      status: 'success', 
      user: {
        user_id: user.user_id,
        user_type: user.user_type,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`.trim()
      }
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to get current user' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
} 