'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/CardContext';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartView() {
  //@ts-ignore
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const USD_TO_KES_RATE = 130;
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };
  
  const handleCheckout = async () => {
    if (!phoneNumber) {
      alert('Please enter a phone number');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create a single order for all items in the cart
      const createOrderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          total: cartTotal,
          phoneNumber,
        }),
      });
      
      const orderResult = await createOrderResponse.json();
      
      if (!orderResult.success) {
        throw new Error(orderResult.error || 'Failed to create order');
      }
      
      // Initiate payment for the created order
      const initiatePaymentResponse = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: cartItems[0].id, // Use the first item's service ID
          priceType: cartItems[0].priceType, // Use the first item's price type
          quantity: cartItems.reduce((total, item) => total + item.quantity, 0), // Total quantity of all items
          targetUrl: cartItems[0].targetUrl || '', // Use the first item's target URL
          amount: cartTotal / 1000, // Convert to KES
          phoneNumber,
          orderId: orderResult.orderId,
        }),
      });
      
      const paymentResult = await initiatePaymentResponse.json();
      
      if (paymentResult.success) {
        router.push('/payment-confirmation');
      } else {
        throw new Error('Payment initiation failed');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
    {cartItems.length === 0 ? (
      <p>Your cart is empty.</p>
    ) : (
      <>
      <div className="overflow-x-auto">
      <table className="table w-full">
      <thead>
      <tr>
      <th>Service</th>
      <th>Price</th>
      <th>Quantity</th>
      <th>Total</th>
      <th>Action</th>
      </tr>
      </thead>
      <tbody>
      {cartItems.map((item) => (
        <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.currency === 'KES' ? `KES ${item.price.toFixed(2)}` : `$${(item.price / USD_TO_KES_RATE).toFixed(2)}`}</td>
        <td>
        <input
        type="number"
        value={item.quantity}
        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
        min="1"
        className="input input-bordered w-20"
        />
        </td>
        <td>{item.currency === 'KES' ? `KES ${(item.price * item.quantity/1000).toFixed(2)}` : `$${(((item.price * item.quantity)/1000) / USD_TO_KES_RATE).toFixed(2)}`}</td>
        <td>
        <button onClick={() => removeFromCart(item.id)} className="btn btn-ghost btn-sm">
        <Trash2 className="h-5 w-5" />
        </button>
        </td>
        </tr>
      ))}
      </tbody>
      </table>
      </div>
      <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
      <p className="text-xl font-bold">Total: KES {(cartTotal / 1000).toFixed(2)}</p>
      <p className="text-lg">Total: US$ {(cartTotal / 130000).toFixed(2)}</p>
      </div>
      <div className="mt-4 md:mt-0">
      <input
      type="tel"
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
      placeholder="Enter phone number"
      className="input input-bordered mr-2"
      />
      <button 
      onClick={handleCheckout} 
      className="btn btn-primary"
      disabled={isProcessing}
      >
      {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
      </button>
      </div>
      </div>
      </>
    )}
    <div className="mt-6">
    <Link href="/" className="btn btn-ghost">
    Continue Shopping
    </Link>
    </div>
    </div>
  );
}