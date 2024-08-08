import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                service: true
              }
            }
          }
        }
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Flatten the structure to get all order items
    const orderItems = user.orders.flatMap(order => 
      order.orderItems.map(item => ({
        ...item,
        orderId: order.id,
        orderCreatedAt: order.createdAt,
        orderStatus: order.status,
        orderPaymentMethod: order.paymentMethod,
      }))
    )

    return NextResponse.json({ orderItems })
  } catch (error) {
    console.error('Error fetching order items:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}