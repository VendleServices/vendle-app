import { Router } from 'express';
import { pool } from '../../lib/db.js';

const router = Router();

// GET /api/setup-db - Get database setup status
router.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    client.release();
    res.json({ status: 'success', message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// POST /api/setup-db - Setup database tables
router.post('/', async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        user_type VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS claims (
        claim_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id),
        title VARCHAR(255),
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS auctions (
        auction_id SERIAL PRIMARY KEY,
        claim_id INTEGER REFERENCES claims(claim_id),
        title VARCHAR(255),
        description TEXT,
        starting_bid DECIMAL(10,2),
        current_bid DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'open',
        auction_end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS bids (
        bid_id SERIAL PRIMARY KEY,
        auction_id INTEGER REFERENCES auctions(auction_id),
        contractor_id INTEGER REFERENCES users(user_id),
        amount DECIMAL(10,2),
        description TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    client.release();
    res.json({ status: 'success', message: 'Database tables created successfully' });
  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to setup database' });
  }
});

export default router; 