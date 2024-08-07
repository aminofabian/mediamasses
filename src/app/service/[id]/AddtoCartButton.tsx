'use client';

import { ShoppingBag, CreditCard } from 'lucide-react';
import React from 'react';
import { useCart, CartItem } from '@/lib/CardContext';

interface AddtoCartButtonProps {
  serviceId: string;
  name: string;
  price: number;
  quantity: number;
  targetUrl: string;
  currency: string;
  priceType: string;
  mode: 'cart' | 'pay';
  onPayNow?: () => void;
}

export default function AddtoCartButton({ 
  serviceId, 
  name,
  price,
  quantity, 
  targetUrl,
  currency,
  priceType,
  mode,
  onPayNow
}: AddtoCartButtonProps) {
  const { addToCart } = useCart();
  
  const handleAction = () => {
    if (mode === 'cart') {
      const cartItem: CartItem = {
        id: serviceId,
        name,
        price,
        quantity,
        targetUrl,
        currency,
        priceType,
      };
      addToCart(cartItem);
      // You might want to add some feedback to the user here, like a toast notification
      console.log('Item added to cart:', cartItem);
    } else if (mode === 'pay' && onPayNow) {
      onPayNow();
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <button 
        className={`btn ${mode === 'cart' ? 'btn-secondary' : 'btn-warning'} my-4`} 
        onClick={handleAction}
      >
        {mode === 'cart' ? 'Add' : 'Pay for'} {quantity} {name}
        {mode === 'cart' ? <ShoppingBag className='ml-2' /> : <CreditCard className='ml-2' />}
      </button>
    </div>
  )
}