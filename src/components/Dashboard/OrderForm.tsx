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
  const [quantity, setQuantity] = useState(0);
  const [targetUrl, setTargetUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setIsButtonDisabled(true);
    
    try {
      // Create FormData for the order
      const formData = new FormData();
      formData.append('serviceId', service.id.toString());
      formData.append('priceType', selectedPriceType.toUpperCase());
      formData.append('price', totalPrice.toString());
      formData.append('quantity', quantity.toString());
      formData.append('targetUrl', targetUrl);
      formData.append('paymentMethod', 'MPESA');
      formData.append('phoneNumber', phoneNumber);
      
      // Create the order
      const orderResult = await createOrder(formData);
      
      if (orderResult.success) {
        console.log('Order created successfully:', orderResult.orderId);
        
        // Initiate payment with Kopokopo
        const paymentResponse = await fetch('/api/initiate-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceId: service.id,
            priceType: selectedPriceType.toUpperCase(),
            quantity,
            targetUrl,
            amount: totalPrice,
            phoneNumber,
            orderId: orderResult.orderId,
          }),
        });
        
        const paymentResult = await paymentResponse.json();
        
        if (paymentResult.success) {
          console.log('Payment initiated successfully');
          // Handle successful payment initiation (e.g., show a success message or redirect)
          // You might want to use the paymentResult.paymentUrl if needed
        } else {
          console.error('Failed to initiate payment:', paymentResult.error);
          // Handle payment initiation failure
        }
      } else {
        console.error('Failed to create order:', orderResult.error);
        // Handle order creation failure
      }
    } catch (error) {
      console.error('Error in order process:', error);
      // Handle any errors that occurred during the process
    } finally {
      setIsPending(false);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 30000);
    }
  };
  
  return (
    <Accordion type="single" collapsible className="mb-4">
    <AccordionItem value="item-1">
    <AccordionTrigger className="text-sm uppercase text-center w-full mx-auto justify-center rounded-md">
    {service.name.replace(/_/g, ' ')}
    </AccordionTrigger>  
    <AccordionContent>
    <form onSubmit={handleSubmit}>
    <div className="flex justify-between gap-2 mb-4">
    <button 
    type="button"
    className={`btn btn-sm ${selectedPriceType === 'low' ? 'btn-active' : 'btn-outline'}`}
    onClick={() => updatePrice('low')}
    >
    <span className="font-light">BOT</span>
    </button>
    <button 
    type="button"
    className={`btn btn-sm ${selectedPriceType === 'medium' ? 'btn-active' : 'btn-outline'}`}
    onClick={() => updatePrice('medium')}
    >
    <span className="font-light">MIXED</span>
    </button>
    <button 
    type="button"
    className={`btn btn-sm ${selectedPriceType === 'high' ? 'btn-active' : 'btn-outline'}`}
    onClick={() => updatePrice('high')}
    >
    <span className="font-light">ORGANIC</span>
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
    value={quantity || ''}
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
    value={targetUrl}
    onChange={(e) => setTargetUrl(e.target.value)}
    />
    </div>
    
    <div className="form-control mt-4">
    <label className="label">
    <span className="label-text">Phone Number:</span>
    </label>
    <input 
    required
    type="tel" 
    name="phoneNumber"
    placeholder="Enter your phone number" 
    className="input input-bordered w-full" 
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    />
    </div>
    
    <div className="mt-6 bg-base-300 p-4 rounded-lg">
    <p className="text-lg font-semibold">Total Price: <span className='text-xs'>KES </span>{totalPrice.toFixed(2)}</p>
    <p className="text-sm text-purple-700 bg-purple-100 inline px-3 py-1 rounded-lg">US$ {(totalPrice/130).toFixed(2)}</p>
    </div>
    
    <div className="mt-6">
    <h4 className="font-semibold mb-2">Payment Method:</h4>
    <div className="flex flex-col sm:flex-row gap-2 w-full justify-center">
    <button 
    type="submit" 
    className="btn btn-primary w-full sm:w-[45%] text-xs py-1 sm:px-2 sm:py-2 uppercase hover:btn-underline"
    disabled={isPending || isButtonDisabled}
    >
    {isPending || isButtonDisabled ? (
      <>
      <span className="loading loading-spinner loading-sm mr-2 items-center my-auto text-center pb-2"></span>
      Processing...
      </>
    ) : (
      'Pay with M-Pesa'
    )}
    </button>
    </div>
    {isButtonDisabled && !isPending && (
      <p className="text-sm text-gray-500 mt-2">Please wait before trying again.</p>
    )}
    </div>
    </form>
    </AccordionContent>
    </AccordionItem>
    </Accordion>
  );
}

export default ServiceAccordion;