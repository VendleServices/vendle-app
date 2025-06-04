import { pool } from './db';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await client.query(schema);
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the initialization
initializeDatabase().catch(console.error); 