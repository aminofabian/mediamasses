// src/app/api/allOrders/route.ts

import { NextResponse } from "next/server";
import { prisma } from '@/lib/db/prisma'


export async function GET() {
  console.log('GET request received at /api/allOrders')
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            service: {
              select: {
                name: true,
                socialAccount: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`Fetched ${orders.length} orders from the database`)
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ message: 'Error fetching orders', error: (error as Error).message }, { status: 500 })
  }
}