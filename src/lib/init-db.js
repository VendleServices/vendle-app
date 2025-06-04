import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'vendle_db',
  password: process.env.DB_PASSWORD || '36ZQRHGN33cQ5uZ^Rspz',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await client.query(schema);
    console.log('Database schema initialized successfully');

    // Insert a test auction
    await client.query(`
      INSERT INTO auctions (title, description, starting_bid, end_date)
      VALUES (
        'Test Auction',
        'This is a test auction',
        50000,
        NOW() + INTERVAL '7 days'
      )
      ON CONFLICT DO NOTHING
    `);
    console.log('Test auction created');

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the initialization
initializeDatabase().catch(console.error); 