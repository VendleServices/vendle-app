import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
    try {
        const client = await pool.connect();
        console.log('Connected to Supabase database');

        // Check if auctions table exists
        const tableCheck = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'auctions';
        `);

        if (tableCheck.rows.length === 0) {
            console.log('Auctions table does not exist. Creating tables...');
            
            // Read and execute the schema
            const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
            const schema = fs.readFileSync(schemaPath, 'utf8');
            await client.query(schema);
            console.log('Database tables created successfully');
        } else {
            console.log('Auctions table already exists');
            
            // Check if the new columns exist
            const columnCheck = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'auctions' 
                AND column_name IN ('total_job_value', 'overhead_and_profit', 'reconstruction_type');
            `);
            
            if (columnCheck.rows.length < 3) {
                console.log('Adding new restoration workflow columns...');
                const setupPath = path.join(process.cwd(), 'src', 'lib', 'setup-db.sql');
                const setupSql = fs.readFileSync(setupPath, 'utf8');
                await client.query(setupSql);
                console.log('New columns added successfully');
            } else {
                console.log('All columns already exist');
            }
        }

        // Show current tables
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);
        
        console.log('\nCurrent tables:');
        const tableList = tables.rows.map(row => row.table_name);
        tableList.forEach(table => console.log(`- ${table}`));

        client.release();
        console.log('\nDatabase setup completed successfully!');
        
        return NextResponse.json({ 
            success: true, 
            message: 'Database setup completed successfully!',
            tables: tableList
        });
        
    } catch (error) {
        console.error('Error setting up database:', error);
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }, { status: 500 });
    }
} 