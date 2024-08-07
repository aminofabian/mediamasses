'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db/prisma'
import { ServiceType, FreeTrialStatus } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../api/auth/[...nextauth]/options'

export async function createFreeTrial(formData: FormData) {
  const session = await getServerSession(authOptions)

  const serviceTypeString = formData.get('serviceType') as string
  const link = formData.get('link') as string
  const currentCount = parseInt(formData.get('currentCount') as string)
  const email = session?.user?.email

  // Validate serviceType
  if (!Object.values(ServiceType).includes(serviceTypeString as ServiceType)) {
    return { success: false, error: 'Invalid service type.' }
  }

  const serviceType = serviceTypeString as ServiceType

  try {
    // Check if the user already has a free trial
    if (email) {
      const user = await prisma.user.findUnique({ 
        where: { email },
        include: { freeTrials: true }
      })

      if (user && user.freeTrials.length > 0) {
        return { success: false, error: 'You have already used your free trial.' }
      }
    }

    // Prepare the data object
    const data: any = {
      serviceType,
      link,
      currentCount,
      status: FreeTrialStatus.PENDING,
    }

    // If user is logged in, add the user relation
    if (email) {
      const user = await prisma.user.findUnique({ where: { email } })
      if (user) {
        data.user = { connect: { id: user.id } }
      }
    }

    // Create the free trial request
    const freeTrial = await prisma.freeTrial.create({ data })

    console.log('Free Trial created:', freeTrial)
    revalidatePath('/')
    return { success: true, freeTrialId: freeTrial.id, redirect: true }
  } catch (error) {
    console.error('Failed to create free trial:', error)
// @ts-ignore
    if (error.code === 'P2002') {
      return { success: false, error: 'A free trial for this service and link already exists.' }
    }
    return { success: false, error: 'Failed to create free trial. Please try again later.' }
  }
}