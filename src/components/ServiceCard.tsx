// components/ServiceCard.jsx
"use client"

import React, { useState, useTransition } from 'react';
import { Service } from '@prisma/client';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PaymentForm from './payments/PaymentForm';

interface ServiceCardProps {
  service: Service;
}

interface PaymentData {
  serviceId: number;
  priceType: string;
  quantity: number;
  targetUrl: string;
  amount: number;
  phoneNumber: string;
  orderId: number | undefined;
}



const ServiceCard = ({ service }: ServiceCardProps) => {
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  
  const handlePaymentSubmit = async (paymentData: PaymentData) => {
    try {
      const response = await fetch('/api/kopokopo-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Handle successful payment initiation
        console.log('Payment initiated:', result.paymentUrl);
        // You might want to redirect the user or show a success message
      } else {
        // Handle payment initiation failure
        console.error('Failed to initiate payment:', result.message);
        // Show error message to the user
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      // Show error message to the user
    }
  };
  
  return (
    <div className="flex flex-col h-full relative rounded-lg border border-purple-200 shadow-lg bg-white transition-all duration-300 hover:shadow-xl">
    <div className="relative h-60">
    <span className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-purple-700 px-4 py-2 text-xs font-light text-purple-100 z-10">
    <span className="font-bold">{service.mediumPrice}/= </span>for 1000 {service.serviceType.replace(/_/g, ' ')}
    </span>
    
    <Image
    src={service.imageUrl || "/youtube.png"}
    fill
    style={{ objectFit: 'cover' }}
    alt={service.name || "Service image"}
    className="rounded-t-lg"
    />
    
    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end p-4">
    <h2 className="text-md font-bold text-white">{service.serviceType.replace(/_/g, ' ')}</h2>
    </div>
    </div>
    
    <div className="flex-grow p-6 flex flex-col">
    <p className="text-gray-600 mb-4 flex-grow text-[11.5pt] -tracking-wide leading-8">
    {service.description.length > 200
      ? service.description.slice(0, 200) + '...'
      : service.description}
      </p>
      
      <div className="flex justify-between items-center mb-4">
      {session ? (
        <Link
        href={(`/service/${service.id}`).toLowerCase()}
        className="bg-purple-100 text-purple-700 text-xs font-light px-5 py-0.5 rounded-full cursor-pointer hover:underline uppercase"
        >
        Add to Cart
        </Link>
      ) : (
        <button
        onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000/dashboard' })}
        className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-2 rounded-full cursor-pointer"
        >
        Request a Free Trial
        </button>
      )}
      <span className="text-gray-500 text-sm">{service.deliveryTime} hours delivery</span>
      </div>
      
      <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
      <AccordionTrigger className="text-xs bg-purple-100 text-purple-700 text-center w-full mx-auto justify-center rounded-md mb-5 font-light">
      BUY {service.serviceType.replace(/_/g, ' ')}
      </AccordionTrigger>  
      <AccordionContent>
      <PaymentForm service={service} onSubmit={handlePaymentSubmit} isPending={false} />
      </AccordionContent>
      </AccordionItem>
      </Accordion>
      </div>
      </div>
    );
  };
  
  export default ServiceCard;