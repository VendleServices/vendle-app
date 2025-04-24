import { Pool } from 'pg';

// Create a new pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Test the connection
async function testConnection() {
  try {
    console.log('Attempting to connect with:', {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database');
    client.release();
    return true;
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
    return false;
  }
}

export { pool, testConnection }; 