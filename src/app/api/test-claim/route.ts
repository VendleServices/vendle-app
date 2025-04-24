import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await pool.connect();
    
    // Test query to get all claims for user 1
    const result = await client.query(
      'SELECT * FROM claims WHERE user_id = 1'
    );
    
    client.release();
    
    return NextResponse.json({ 
      status: 'success', 
      claims: result.rows 
    });
  } catch (error) {
    console.error('Error testing claims:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to test claims' },
      { status: 500 }
    );
  }
}

// Test POST endpoint
export async function POST(request: Request) {
  try {
    const testData = {
      user_id: 1,
      property_address_street: "123 Test St",
      property_address_city: "Test City",
      property_address_state: "CA",
      property_address_zip: "12345",
      project_type: "test",
      design_plan: "test",
      needs_adjuster: false
    };

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO claims (
        user_id,
        property_address_street,
        property_address_city,
        property_address_state,
        property_address_zip,
        project_type,
        design_plan,
        needs_adjuster
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        testData.user_id,
        testData.property_address_street,
        testData.property_address_city,
        testData.property_address_state,
        testData.property_address_zip,
        testData.project_type,
        testData.design_plan,
        testData.needs_adjuster
      ]
    );
    
    client.release();
    
    return NextResponse.json({ 
      status: 'success', 
      claim: result.rows[0] 
    });
  } catch (error) {
    console.error('Error testing claim creation:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create test claim' },
      { status: 500 }
    );
  }
} 