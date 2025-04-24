import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  let client;
  try {
    client = await pool.connect();
    
    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Add user_type column if it doesn't exist
    await client.query(`
      DO $$ 
      BEGIN
        BEGIN
          ALTER TABLE users ADD COLUMN user_type VARCHAR(20) DEFAULT 'reguser' CHECK (user_type IN ('reguser', 'contractor'));
        EXCEPTION
          WHEN duplicate_column THEN 
            NULL;
        END;
      END $$;
    `);
    
    // Add a test user if none exists
    const result = await client.query(`
      INSERT INTO users (email, first_name, last_name, user_type)
      VALUES ('test@example.com', 'Test', 'User', 'reguser')
      ON CONFLICT (email) DO NOTHING
      RETURNING user_id;
    `);
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Database setup complete',
      testUserId: result.rows[0]?.user_id || 'Test user already exists'
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to set up database',
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