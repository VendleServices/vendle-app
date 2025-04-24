import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - List all claims for a user
export async function GET(request: Request) {
  let client;
  try {
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
      `SELECT 
        claim_id as id,
        claim_status as status,
        date_created as date,
        CONCAT(property_address_street, ', ', property_address_city, ', ', property_address_state, ' ', property_address_zip) as address,
        insurance_provider as provider,
        claim_number as policyNumber,
        project_type,
        design_plan,
        needs_adjuster
      FROM claims 
      WHERE user_id = $1 
      ORDER BY date_created DESC`,
      [userId]
    );
    
    return NextResponse.json({ 
      status: 'success', 
      claims: result.rows 
    });
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch claims' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}

// POST - Create a new claim
export async function POST(request: Request) {
  let client;
  try {
    const claimData = await request.json();
    console.log('Received claim data:', JSON.stringify(claimData, null, 2));
    
    // Required fields validation
    const requiredFields = [
      'user_id',
      'property_address_street',
      'property_address_city',
      'property_address_state',
      'property_address_zip',
      'project_type',
      'design_plan'
    ];
    
    const missingFields = requiredFields.filter(field => !claimData[field]);
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return NextResponse.json(
        { status: 'error', message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('Database client connected');
    
    // Set default values for optional fields
    const queryParams = [
      claimData.user_id,
      claimData.property_address_street,
      claimData.property_address_city,
      claimData.property_address_state,
      claimData.property_address_zip,
      claimData.project_type,
      claimData.design_plan,
      claimData.date_of_loss || null,
      claimData.insurance_estimate_file_path || null,
      claimData.needs_adjuster || false,
      claimData.insurance_provider || null,
      claimData.claim_number || null
    ];
    
    console.log('Executing query with params:', queryParams);
    
    const result = await client.query(
      `INSERT INTO claims (
        user_id,
        property_address_street,
        property_address_city,
        property_address_state,
        property_address_zip,
        project_type,
        design_plan,
        date_of_loss,
        insurance_estimate_file_path,
        needs_adjuster,
        insurance_provider,
        claim_number,
        claim_status,
        date_created,
        last_updated
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending', NOW(), NOW())
      RETURNING *`,
      queryParams
    );
    
    console.log('Query executed successfully');
    
    return NextResponse.json({ 
      status: 'success', 
      claim: result.rows[0] 
    });
  } catch (error) {
    console.error('Detailed error in POST /api/claims:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to create claim', 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}

// DELETE - Delete a claim
export async function DELETE(request: Request) {
  let client;
  try {
    const { searchParams } = new URL(request.url);
    const claimId = searchParams.get('claimId');

    if (!claimId) {
      return NextResponse.json(
        { status: 'error', message: 'Claim ID is required' },
        { status: 400 }
      );
    }

    client = await pool.connect();
    
    const result = await client.query(
      'DELETE FROM claims WHERE claim_id = $1 RETURNING *',
      [claimId]
    );
    
    if (result.rowCount === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Claim not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Claim deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting claim:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to delete claim' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
} 