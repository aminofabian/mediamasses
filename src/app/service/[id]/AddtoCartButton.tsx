'use client';

import { ShoppingBag } from 'lucide-react';
import React from 'react';
import { incrementServiceQuantity } from './actions';
import { PriceType } from '@prisma/client';

interface AddtoCartButtonProps {
  serviceId: string;
  priceType: PriceType;
  quantity: number;
  targetUrl: string;
}

export default function AddtoCartButton({ serviceId, priceType, quantity, targetUrl }: AddtoCartButtonProps) {
  const handleAddToCart = async () => {
    await incrementServiceQuantity(parseInt(serviceId, 10), priceType, quantity, targetUrl);
    // You might want to add some feedback to the user here, like a toast notification
  };
  
  return (
    <div className="flex items-center gap-2">
    <button className='btn btn-secondary my-4' onClick={handleAddToCart}>
    Add to Cart
    <ShoppingBag className='ml-2' />
    </button>
    </div>
  )
}