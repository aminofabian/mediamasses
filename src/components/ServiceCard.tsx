"use client"

import React, { useState } from 'react';
import { Service } from '@prisma/client';
import Image from 'next/image';
import { createOrder } from '@/app/(actions)/createOrder';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { signIn, useSession } from 'next-auth/react';

import { Noto_Sans_Canadian_Aboriginal } from 'next/font/google';
import { ListVideoIcon } from 'lucide-react';
import Link from 'next/link';




interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedPriceType, setSelectedPriceType] = useState('medium');
  const [quantity, setQuantity] = useState(1000);
  
  const { data: session } = useSession();
  
  
  const calculatePrice = (amount: number, priceType: string) => {
    let price;
    switch(priceType) {
      case 'low':
      price = service.lowPrice ? (amount * service.lowPrice) / 1000 : 0;
      break;
      case 'medium':
      price = service.mediumPrice ? (amount * service.mediumPrice) / 1000 : 0;
      break;
      case 'high':
      price = service.highPrice ? (amount * service.highPrice) / 1000 : 0;
      break;
      default:
      price = service.mediumPrice ? (amount * service.mediumPrice) / 1000 : 0;
    }
    return isNaN(price) ? 0 : price;
  };
  
  const updatePrice = (priceType: string) => {
    setSelectedPriceType(priceType);
    setTotalPrice(calculatePrice(quantity, priceType));
  };
  
  return (
    <div className="flex flex-col h-full relative rounded-lg border border-purple-200 shadow-lg bg-white transition-all duration-300 hover:shadow-xl">
    <div className="relative h-60">
    <span className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-purple-500 px-4 py-2 text-sm font-bold text-slate-100 z-10">
    <span className="text-xs font-light text-slate-100">KES</span>{service[`${selectedPriceType}Price`]} for 1000 {service.serviceType}
    </span>
    
    <Image
    src={service.imageUrl || "/youtube.png"}
    fill
    style={{ objectFit: 'cover' }}
    alt={service.name || "Service image"}
    className="rounded-t-lg"
    />
    
    
    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end p-4">
    <h2 className="text-md font-bold text-white"> {service.serviceType}</h2>
    </div>
    </div>
    
    <div className="flex-grow p-6 flex flex-col">
    <p className="text-gray-600 mb-4 flex-grow">
    {service.description.length > 200
      ? service.description.slice(0, 200) + '...'
      : service.description}
      </p>
      
      
      
      <div className="flex justify-between items-center mb-4">
      {session ? (
        <Link
        href={(`/service/${service.id}`).toLowerCase()}
        className="bg-purple-100 text-purple-700 text-xs font-medium px-5 py-0.5 rounded-full cursor-pointer"
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
      <AccordionTrigger className="text-sm bg-purple-100 text-purple-700 text-center w-full mx-auto justify-center rounded-md mb-5">BUY {service.serviceType}</AccordionTrigger>  
      <AccordionContent>
      <form action={createOrder}>
      <input type="hidden" name="serviceId" value={service.id.toString()} />
      <input type="hidden" name="priceType" value={selectedPriceType.toUpperCase()} />
      <input type="hidden" name="price" value={totalPrice.toFixed(2)} />
      
      
      <div className="flex justify-between gap-2 mb-4">
      <button 
      type="button"
      className={`btn btn-sm ${selectedPriceType === 'low' ? 'btn-active' : 'btn-outline'}`}
      onClick={() => updatePrice('low')}
      >
      Bot
      </button>
      <button 
      type="button"
      className={`btn btn-sm ${selectedPriceType === 'medium' ? 'btn-active' : 'btn-outline'}`}
      onClick={() => updatePrice('medium')}
      >
      Mixed
      </button>
      <button 
      type="button"
      className={`btn btn-sm ${selectedPriceType === 'high' ? 'btn-active' : 'btn-outline'}`}
      onClick={() => updatePrice('high')}
      >
      Organic
      </button>
      </div>
      
      <div className="form-control">
      <label className="label">
      <span className="label-text">Number of {service.name}:</span>
      </label>
      <input 
      type="number" 
      name="quantity"
      placeholder="Enter amount" 
      className="input input-bordered w-full" 
      value={quantity}
      onChange={(e) => {
        const amount = parseInt(e.target.value);
        setQuantity(amount);
        setTotalPrice(calculatePrice(amount, selectedPriceType));
      }}
      />
      </div>
      
      <div className="form-control mt-4">
      <label className="label">
      <span className="label-text">Social Media Link:</span>
      </label>
      <input 
      required
      type="text" 
      name="targetUrl"
      placeholder="eg. https://www.youtube.com/watch?v=lGhJzBLPgBw" 
      className="input input-bordered w-full" 
      />
      </div>
      
      <div className="mt-6 bg-base-300 p-4 rounded-lg">
      <p className="text-lg font-semibold">Total Price: <span className='text-xs'>KES </span>{totalPrice.toFixed(2)}</p>
      <p className="text-sm text-purple-700 bg-purple-100 inline px-3 py-1 rounded-lg">US$ {(totalPrice/130).toFixed(2)}</p>
      </div>
      
      <div className="mt-6">
      <h4 className="font-semibold mb-2">Payment Method:</h4>
      <div className="flex flex-col sm:flex-row gap-2  w-full justify-center">
      <button 
      type="submit" 
      name="paymentMethod" 
      value="MPESA" 
      className="btn btn-primary w-full sm:w-[45%] text-sm py-1 sm:px-1 sm:py-2"
      >
      Pay with M-Pesa
      </button>
      <button 
      type="submit" 
      name="paymentMethod" 
      value="PAYPAL" 
      className="btn btn-secondary w-full sm:w-[45%] text-sm px-2 py-1 sm:px-1 sm:py-2"
      >
      Pay with PayPal
      </button>
      </div>
      </div>
      </form>
      </AccordionContent>
      
      </AccordionItem>
      
      </Accordion>
      </div>
      </div>
    )
  }
  
  export default ServiceCard;