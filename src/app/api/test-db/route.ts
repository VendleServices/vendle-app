import { testConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const isConnected = await testConnection();
  
  if (isConnected) {
    return NextResponse.json({ status: 'success', message: 'Database connection successful' });
  } else {
    return NextResponse.json(
      { status: 'error', message: 'Failed to connect to database' },
      { status: 500 }
    );
  }
} 