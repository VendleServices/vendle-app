import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testPrisma() {
  try {
    console.log('Testing Prisma connection...');
    console.log('DATABASE_URL found:', !!process.env.DATABASE_URL);
    
    // Test basic connection
    const users = await prisma.user.findMany();
    console.log('Users found:', users?.length);
    
    // Test claims query
    const claims = await prisma.claim.findMany({
      where: {
        userId: '1410752e-3305-476f-bfb4-3bef4a25bce0'
      }
    });
    console.log('Claims found:', claims?.length);
    console.log('Claims:', claims);
    
  } catch (error) {
    console.error('Prisma error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma(); 