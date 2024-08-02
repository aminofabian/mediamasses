import { prisma } from '@/lib/db/prisma';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import ServicePageClient from './SinglePageClient';

interface ServicePageProps {
  params: {
    id: string,
  }
}

const getService = cache(async (id: string) => {
  const serviceId = parseInt(id, 10);
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  });
  
  if (!service) {
    notFound()
  }
  
  return service;
})

export async function generateMetadata({ params: { id } }: ServicePageProps): Promise<Metadata> {
  const service = await getService(id);
  return {
    title: service.name + " -- Media Masses",
    description: service.description,
    openGraph: {
      images: [{url: service.imageUrl}]
    }
  };
}

export default async function ServicePage({ params: { id } }: ServicePageProps) {
  const service = await getService(id);
  
  return <ServicePageClient service={service} />;
}