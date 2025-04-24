import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Get a specific claim by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM claims WHERE claim_id = $1',
      [params.id]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Claim not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      status: 'success', 
      claim: result.rows[0] 
    });
  } catch (error) {
    console.error('Error fetching claim:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch claim' },
      { status: 500 }
    );
  }
}

// PUT - Update a claim
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const claimData = await request.json();
    
    const client = await pool.connect();
    const result = await client.query(
      `UPDATE claims SET
        property_address_street = COALESCE($1, property_address_street),
        property_address_city = COALESCE($2, property_address_city),
        property_address_state = COALESCE($3, property_address_state),
        property_address_zip = COALESCE($4, property_address_zip),
        project_type = COALESCE($5, project_type),
        design_plan = COALESCE($6, design_plan),
        date_of_loss = COALESCE($7, date_of_loss),
        insurance_estimate_file_path = COALESCE($8, insurance_estimate_file_path),
        needs_adjuster = COALESCE($9, needs_adjuster),
        insurance_provider = COALESCE($10, insurance_provider),
        claim_number = COALESCE($11, claim_number),
        last_updated = CURRENT_TIMESTAMP
      WHERE claim_id = $12
      RETURNING *`,
      [
        claimData.property_address_street,
        claimData.property_address_city,
        claimData.property_address_state,
        claimData.property_address_zip,
        claimData.project_type,
        claimData.design_plan,
        claimData.date_of_loss,
        claimData.insurance_estimate_file_path,
        claimData.needs_adjuster,
        claimData.insurance_provider,
        claimData.claim_number,
        params.id
      ]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Claim not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      status: 'success', 
      claim: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating claim:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to update claim' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a claim
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'DELETE FROM claims WHERE claim_id = $1 RETURNING *',
      [params.id]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
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
  }
} 