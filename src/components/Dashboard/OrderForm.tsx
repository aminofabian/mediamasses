// ServiceAccordion.tsx
'use client'

import React, { useState } from 'react';
import { Service } from '@prisma/client';
import { createOrder } from '@/app/(actions)/createOrder';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ServiceAccordionProps {
  service: Service;
}

const ServiceAccordion = ({ service }: ServiceAccordionProps) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedPriceType, setSelectedPriceType] = useState('medium');
  const [quantity, setQuantity] = useState(1000);
  
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
    <Accordion type="single" collapsible className="mb-4">
    <AccordionItem value="item-1">
    <AccordionTrigger className="text-lg uppercase text-center w-full mx-auto justify-center rounded-md">
    {service.name}
    </AccordionTrigger>  
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
    required
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
    placeholder={`eg. https://www.${service.socialAccount}.com/...`}
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
    className="btn btn-primary w-full sm:w-1/3 text-sm py-1 sm:px-1 sm:py-2"
    >
    Pay with M-Pesa
    </button>
    <button 
    type="submit" 
    name="paymentMethod" 
    value="PAYPAL" 
    className="btn btn-secondary w-full sm:w-1/3 text-sm px-2 py-1 sm:px-1 sm:py-2"
    >
    Pay with PayPal
    </button>
    </div>
    </div>
    </form>
    </AccordionContent>
    </AccordionItem>
    </Accordion>
  );
}

export default ServiceAccordion;