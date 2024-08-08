import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from './auth/[...nextauth]/options';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, total, phoneNumber } = await request.json();

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        phoneNumber,
        status: 'PENDING',
        paymentMethod: 'MPESA',
        currencyCode: 'KES',
        orderItems: {
          create: items.map((item: any) => ({
            serviceId: parseInt(item.id),
            quantity: item.quantity,
            price: item.price,
            priceType: item.priceType,
            targetUrl: item.targetUrl,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}