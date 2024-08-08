 'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db/prisma'
import { PaymentMethod, PriceType, OrderStatus } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

export async function createOrder(formData: FormData) {
  const session = await getServerSession(authOptions)

  const serviceId = parseInt(formData.get('serviceId') as string)
  const priceType = formData.get('priceType') as PriceType
  const price = parseFloat(formData.get('price') as string)
  const quantity = parseInt(formData.get('quantity') as string)
  const targetUrl = formData.get('targetUrl') as string
  const paymentMethod = formData.get('paymentMethod') as PaymentMethod
  const email = session?.user?.email
  const phoneNumber = formData.get('phoneNumber') as string


  try {
    // Fetch the service to ensure it exists
    const service = await prisma.service.findUnique({ where: { id: serviceId } })
    if (!service) {
      return { success: false, error: 'Invalid service ID' }
    }

    // Check if the user exists
    if (!email) {
      return { success: false, error: 'User email not found in session' }
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: price,
        paymentMethod,
        currencyCode: 'KES',
        status: OrderStatus.PENDING,
        phoneNumber, // Add this line
        orderItems: {
          create: {
            serviceId,
            quantity,
            price,
            priceType,
            targetUrl,
          },
        },
      },
    })

    console.log('Order created:', order)
    revalidatePath('/')
    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Failed to create order:', error)
    // @ts-ignore
// eslint-disable-next-line
    if (error.code === 'P2003') {
      return { success: false, error: 'Invalid user or service ID. Please try again.' }
    }
    return { success: false, error: 'Failed to create order. Please try again later.' }
  }
}
