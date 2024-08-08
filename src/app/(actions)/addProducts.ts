"use server"

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from 'next/cache';
import { ServiceType } from '@prisma/client';

async function addProduct(formData: FormData) {
  try {
    const serviceType = formData.get('serviceType') as string;
    const imageFile = formData.get('image') as File;

    let imageUrl = '';

    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        body: uploadFormData,
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.filename;
      } else {
        throw new Error('Image upload failed');
      }
    }

    const service = await prisma.service.create({
      data: {
        name: formData.get('name') as string,
        socialAccount: formData.get('socialAccount') as string,
        description: formData.get('description') as string,
        lowPrice: parseFloat(formData.get('lowPrice') as string),
        mediumPrice: parseFloat(formData.get('mediumPrice') as string),
        highPrice: parseFloat(formData.get('highPrice') as string),
        imageUrl: imageUrl,
        minQuantity: parseInt(formData.get('minQuantity') as string),
        maxQuantity: parseInt(formData.get('maxQuantity') as string),
        deliveryTime: parseInt(formData.get('deliveryTime') as string),
        serviceType: serviceType as ServiceType,
        unitOfMeasurement: 'count',
      },
    });

    console.log('Service created:', service);

    revalidatePath('/services');

    return { success: true, message: 'Service added successfully' };
  } catch (error) {
    console.error('Error adding service:', error);
    return { success: false, message: 'Failed to add service' };
  }
}

export { addProduct };