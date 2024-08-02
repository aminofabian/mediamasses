import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma'; // Adjust this import based on your Prisma client setup

export async function GET(request: Request) {
  try {
    // Get the searchParams from the request URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // If an ID is provided, fetch a single service
      const service = await prisma.service.findUnique({
        where: { id: parseInt(id) },
      });

      if (!service) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
      }

      return NextResponse.json(service);
    } else {
      // If no ID is provided, fetch all services
      const services = await prisma.service.findMany();
      return NextResponse.json(services);
    }
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Optionally, you can add POST, PUT, DELETE methods here if needed

// POST example:
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newService = await prisma.service.create({
      data: body,
    });
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}