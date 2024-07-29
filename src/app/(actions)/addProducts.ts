"use server"

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from 'next/cache';
import { ServiceType } from '@prisma/client';

async function addProduct(formData: FormData) {
  try {
    const serviceType = formData.get('serviceType') as string;
    
    const service = await prisma.service.create({
      data: {
        name: formData.get('name') as string,
        socialAccount: formData.get('socialAccount') as string,
        description: formData.get('description') as string,
        lowPrice: parseFloat(formData.get('lowPrice') as string),
        mediumPrice: parseFloat(formData.get('mediumPrice') as string),
        highPrice: parseFloat(formData.get('highPrice') as string),
        imageUrl: formData.get('imageUrl') as string,
        minQuantity: parseInt(formData.get('minQuantity') as string),
        maxQuantity: parseInt(formData.get('maxQuantity') as string),
        deliveryTime: parseInt(formData.get('deliveryTime') as string),
        serviceType: serviceType as ServiceType,
        unitOfMeasurement: 'count', // You might want to make this dynamic based on the service type
      },
    });

    console.log('Service created:', service);

    // Revalidate the path to update the UI
    revalidatePath('/services'); // Adjust this path as needed

    return { success: true, message: 'Service added successfully' };
  } catch (error) {
    console.error('Error adding service:', error);
    return { success: false, message: 'Failed to add service' };
  }
}

export { addProduct };