import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { orderId, itemId, action } = await request.json();

  try {
    let updatedOrder;

    if (action === 'paid') {
      // Update payment status for the specific order item
      await prisma.orderItem.update({
        where: { id: itemId },
        data: { paymentStatus: 'paid' },
      });

      // Fetch the updated order
      updatedOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: { orderItems: true },
      });
    } else if (['PROCESSING', 'COMPLETED', 'CANCELLED'].includes(action)) {
      // Update order status
      updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: action },
        include: { orderItems: true },
      });
    } else {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ message: 'Error updating order' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}