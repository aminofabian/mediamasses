import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    
    const updatedTrial = await prisma.freeTrial.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json(updatedTrial);
  } catch (error) {
    console.error('Error updating free trial status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}