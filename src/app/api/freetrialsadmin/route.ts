import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10; // 10 trials per page
  const skip = (page - 1) * limit;

  try {
    const [freeTrials, totalCount] = await Promise.all([
      prisma.freeTrial.findMany({
        include: { user: true },
        orderBy: { requestedAt: 'desc' },
        take: limit,
        skip: skip,
      }),
      prisma.freeTrial.count(),
    ]);

    return NextResponse.json({
      freeTrials,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching free trials:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}