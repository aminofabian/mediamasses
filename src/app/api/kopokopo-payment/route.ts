import { NextResponse } from 'next/server';
import axios from 'axios';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const { serviceId, priceType, quantity, targetUrl, amount, phoneNumber, orderId } = await request.json();
    console.log('Received payment request:', { serviceId, priceType, quantity, targetUrl, amount, phoneNumber, orderId });

    // Obtain access token
    console.log('Obtaining access token...');
    const tokenResponse = await axios.post(
      `${process.env.KOPOKOPO_BASE_URL}/oauth/token`,
      {
        grant_type: 'client_credentials',
      },
      {
        auth: {
          username: process.env.KOPOKOPO_CLIENT_ID!,
          password: process.env.KOPOKOPO_CLIENT_SECRET!,
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;
    console.log('Access token obtained');

    // Make incoming payment request
    console.log('Initiating payment with Kopokopo...');
    const paymentResponse = await axios.post(
      `${process.env.KOPOKOPO_BASE_URL}/api/v1/incoming_payments`,
      {
        payment_channel: 'M-PESA STK Push',
        till_number: process.env.KOPOKOPO_TILL_NUMBER,
        subscriber: {
          phone_number: phoneNumber,
        },
        amount: {
          currency: 'KES',
          value: amount,
        },
        metadata: {
          service_id: serviceId,
          price_type: priceType,
          quantity: quantity,
          target_url: targetUrl,
          order_id: orderId,
        },
        _links: {
          callback_url: `${request.headers.get('origin')}/api/kopokopo-callback`,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    console.log('Payment initiated with Kopokopo:', paymentResponse.data);

    console.log('Updating order and creating payment record in database...');
    await prisma.$transaction(async (prisma) => {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentInitiated: true,
          paymentInitiatedAt: new Date(),
        },
      });

      await prisma.payment.create({
        data: {
          orderId,
          amount: parseFloat(amount),
          currency: 'KES',
          status: 'PENDING',
          paymentMethod: 'MPESA',
          metadata: paymentResponse.data,
        },
      });
    });
    console.log('Order updated and payment record created in database');

    return NextResponse.json({ success: true, paymentUrl: paymentResponse.data.location });
  } catch (error: unknown) {
    console.error('Error initiating payment:', error);
    
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return NextResponse.json(
      { success: false, message: 'Error initiating payment', error: errorMessage },
      { status: 500 }
    );
  }
}
