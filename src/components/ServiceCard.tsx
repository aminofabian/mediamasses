"use client"

import React, { useState } from 'react';
import { Service } from '@prisma/client';
import Image from 'next/image';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
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
    <div className="flex flex-col h-full relative rounded-lg border border-purple-200 shadow-lg bg-white transition-all duration-300 hover:shadow-xl">
    <div className="relative h-60">
    <span className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-purple-500 px-4 py-2 text-sm font-bold text-white z-10">
    KES {service[`${selectedPriceType}Price`]} / 1000
    </span>
    
    <Image
    src={service.imageUrl || "/youtube.png"}
    layout="fill"
    objectFit="cover"
    alt={service.name || "Service image"}
    className="rounded-t-lg"
    />
    
    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end p-4">
    <h2 className="text-2xl font-bold text-white">{service.name}</h2>
    </div>
    </div>
    
    <div className="flex-grow p-6 flex flex-col">
    <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
    
    <div className="flex justify-between items-center mb-4">
    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
    {service.socialAccount}
    </span>
    <span className="text-gray-500 text-sm">{service.deliveryTime} hours delivery</span>
    </div>
    
    <div className="mt-4">
    <div className="dropdown w-full">
    <label tabIndex={0} className="btn btn-primary w-full">Buy Now</label>
    <div tabIndex={0} className="dropdown-content card bg-base-200 w-full p-4 shadow-xl z-[11]">
    <div className="card-body">
    <h3 className="card-title text-lg font-bold mb-4">Purchase {service.name}</h3>
    
    <div className="flex justify-between gap-2 mb-4">
    <button 
    className={`btn btn-sm ${selectedPriceType === 'low' ? 'btn-active' : 'btn-outline'}`}
    onClick={() => updatePrice('low')}
    >
    Unstable
    </button>
    <button 
    className={`btn btn-sm ${selectedPriceType === 'medium' ? 'btn-active' : 'btn-outline'}`}
    onClick={() => updatePrice('medium')}
    >
    Medium
    </button>
    <button 
    className={`btn btn-sm ${selectedPriceType === 'high' ? 'btn-active' : 'btn-outline'}`}
    onClick={() => updatePrice('high')}
    >
    Stable
    </button>
    </div>
    
    <div className="form-control">
    <label className="label">
    <span className="label-text">Number of {service.name}:</span>
    </label>
    <input 
    type="number" 
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
    type="text" 
    placeholder="Enter your social media link" 
    className="input input-bordered w-full" 
    />
    </div>
    
    <div className="mt-6 bg-base-300 p-4 rounded-lg">
    <p className="text-lg font-semibold">Total Price: KES {totalPrice.toFixed(2)}</p>
    <p className="text-sm text-gray-600">US$ {(totalPrice/130).toFixed(2)}</p>
    </div>
    
    <div className="mt-6">
    <h4 className="font-semibold mb-2">Payment Method:</h4>
    <div className="flex flex-col sm:flex-row gap-2">
    <button className="btn btn-primary w-full sm:w-1/2">Pay with M-Pesa</button>
    <button className="btn btn-secondary w-full sm:w-1/2">Pay with PayPal</button>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
  )
}

export default ServiceCard;