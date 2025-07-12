import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    ca: undefined
  }
});

async function setupDatabase() {
  let client;
  try {
    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('Connected successfully!');

    // Create users table
    console.log('Creating users table...');
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

    // Create claims table
    console.log('Creating claims table...');
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

    // Create auctions table
    console.log('Creating auctions table...');
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
        total_job_value DECIMAL(10,2),
        overhead_and_profit DECIMAL(10,2),
        cost_basis VARCHAR(10),
        materials DECIMAL(10,2),
        sales_taxes DECIMAL(10,2),
        depreciation DECIMAL(10,2),
        reconstruction_type VARCHAR(255),
        needs_3rd_party_adjuster BOOLEAN DEFAULT FALSE,
        has_deductible_funds BOOLEAN DEFAULT FALSE,
        funding_source VARCHAR(50),
        scope_of_work JSONB,
        photos JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create bids table
    console.log('Creating bids table...');
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

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup error:', error);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

setupDatabase(); 