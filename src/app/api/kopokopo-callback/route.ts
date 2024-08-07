import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const webhookData = await request.json();

    if (webhookData.topic === 'buygoods_transaction_received' && webhookData.event.resource.status === 'Received') {
      const { amount, currency, reference, origination_time } = webhookData.event.resource;
      const orderId = webhookData.event.resource.metadata.order_id;

      await prisma.$transaction(async (prisma) => {
        // Find the corresponding Order and Payment
        const order = await prisma.order.findUnique({
          where: {
            id: parseInt(orderId),
          },
          include: {
            orderItems: true,
            Payment: {
              where: {
                status: 'PENDING'
              },
              take: 1
            },
          },
        });

        if (order && order.Payment.length > 0) {
          const payment = order.Payment[0];

          // Update the Payment status and add KopoKopo-specific identifiers
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'COMPLETED',
              transactionId: reference,
              paymentProviderId: webhookData.event.resource.payment_id,
              metadata: {
                ...(payment.metadata as object), // Cast to object
                kopokopo_callback: webhookData
              } as object, // Cast the result to object
            },
          });

          // Update all OrderItems for this Order to 'paid'
          await prisma.orderItem.updateMany({
            where: { orderId: order.id },
            data: { paymentStatus: 'paid' },
          });

          // Update the Order status to PROCESSING
          await prisma.order.update({
            where: { id: order.id },
            data: { 
              status: 'PROCESSING',
              updatedAt: new Date(origination_time)
            },
          });

          return NextResponse.json({ success: true, message: 'Payment processed successfully' });
        } else {
          console.error('No matching Order or pending Payment found for the received payment');
          return NextResponse.json({ success: false, message: 'No matching Order or pending Payment found' }, { status: 404 });
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ success: false, message: 'Error processing webhook' }, { status: 500 });
  }
}