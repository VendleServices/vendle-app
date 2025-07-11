import { Pool } from 'pg';

// Create a new pool using Supabase DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
async function testConnection() {
  try {
    console.log('Attempting to connect to Supabase database...');
    
    const client = await pool.connect();
    console.log('Successfully connected to Supabase PostgreSQL database');
    client.release();
    return true;
  } catch (error) {
    console.error('Error connecting to Supabase database:', error);
    return false;
  }
}

export { pool, testConnection }; 