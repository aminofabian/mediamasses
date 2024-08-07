'use client';

import Image from 'next/image';
import React, { useState, useMemo } from 'react';
import { PriceType, Service, PaymentMethod } from '@prisma/client';
import { useCart } from '@/lib/CardContext';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/app/(actions)/createOrder';

interface ServicePageClientProps {
  service: Service;
}

const USD_TO_KES_RATE = 130;

export default function SinglePageClient({ service }: ServicePageClientProps) {
  const [selectedPrice, setSelectedPrice] = useState<PriceType>('MEDIUM');
  const [quantity, setQuantity] = useState(service.minQuantity);
  const [targetUrl, setTargetUrl] = useState('');
  const [currency, setCurrency] = useState<'KES' | 'USD'>('KES');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MPESA');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { addToCart } = useCart();
  const router = useRouter();
  
  const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrice(event.target.value as PriceType);
  };
  
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setQuantity(Math.max(service.minQuantity, Math.min(service.maxQuantity, value)));
  };
  
  const handleTargetUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetUrl(event.target.value);
  };
  
  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value as 'KES' | 'USD');
  };
  
  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(event.target.value as PaymentMethod);
  };
  
  const handleAddToCart = () => {
    addToCart({
      id: service.id.toString(),
      name: service.name,
      price: totalPrice,
      quantity,
      priceType: selectedPrice,
      targetUrl,
      currency,
    });
  };
  
  const handleBuyNow = async () => {
    // Create FormData object
    const formData = new FormData();
    formData.append('serviceId', service.id.toString());
    formData.append('priceType', selectedPrice);
    formData.append('price', totalPrice.toString());
    formData.append('quantity', quantity.toString());
    formData.append('targetUrl', targetUrl);
    formData.append('paymentMethod', paymentMethod);
    formData.append('phoneNumber', phoneNumber);
    
    // Create order
    const orderResult = await createOrder(formData);
    
    if (orderResult.success) {
      // Order created successfully, now initiate STK push
      const response = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.id,
          priceType: selectedPrice,
          quantity,
          targetUrl,
          amount: totalPrice,
          phoneNumber,
          orderId: orderResult.orderId,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Payment initiated successfully
        console.log('Payment initiated:', result);
        // You can redirect the user to a confirmation page or show a success message
        router.push('/payment-confirmation');
      } else {
        // Handle payment initiation error
        console.error('Payment initiation failed:', result.error);
        // Show an error message to the user
        alert('Payment initiation failed. Please try again.');
      }
    } else {
      // Handle order creation error
      console.error('Order creation failed:', orderResult.error);
      // Show an error message to the user
      alert('Order creation failed. Please try again.');
    }
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Use type assertion to access the submitter property
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    
    if (submitter?.classList.contains('btn-secondary')) {
      handleAddToCart();
    } else if (submitter?.classList.contains('btn-warning')) {
      handleBuyNow();
    }
  };  
  const totalPrice = useMemo(() => {
    const pricePerUnit = service[`${selectedPrice.toLowerCase()}Price` as keyof Service] as number;
    const priceInKes = (quantity * pricePerUnit) / 1000;
    return currency === 'KES' ? priceInKes : priceInKes / USD_TO_KES_RATE;
  }, [service, selectedPrice, quantity, currency]);
  
  const formatPrice = (price: number) => {
    return currency === 'KES' 
    ? `KES ${price.toFixed(2)}` 
    : `$${price.toFixed(2)}`;
  };
  
  return (
    <div className='container flex flex-col lg:flex-row my-10 border rounded-lg p-5 gap-5 lg:items-center'>
    <Image
    src={service.imageUrl}
    width={500}
    height={500}
    alt={service.name}
    className='rounded-lg'
    priority
    />
    <form onSubmit={handleSubmit}>
    <h1 className="text-5xl font-bold">Service: {service.name}</h1>
    <p>{service.description}</p>
    
    <div className="my-4">
    <label htmlFor="priceSelect" className="block mb-2">Select Price:</label>
    <select 
    id="priceSelect" 
    value={selectedPrice} 
    onChange={handlePriceChange}
    className="p-2 border rounded"
    >
    <option value="LOW">Low: {formatPrice(service.lowPrice / 10)}</option>
    <option value="MEDIUM">Medium: {formatPrice(service.mediumPrice / 10)}</option>
    <option value="HIGH">High: {formatPrice(service.highPrice / 10)}</option>
    </select>
    </div>
    
    <div className="my-4">
    <label htmlFor="quantityInput" className="block mb-2">Quantity ({service.minQuantity} - {service.maxQuantity}):</label>
    <input 
    required
    id="quantityInput"
    type="number" 
    value={quantity} 
    onChange={handleQuantityChange}
    min={service.minQuantity}
    max={service.maxQuantity}
    className="p-2 border rounded"
    />
    </div>
    
    <div className="my-4">
    <label htmlFor="targetUrlInput" className="block mb-2">Target URL:</label>
    <input 
    required
    id="targetUrlInput"
    type="url" 
    value={targetUrl} 
    onChange={handleTargetUrlChange}
    className="p-2 border rounded w-full"
    placeholder="Enter target URL"
    />
    </div>
    
    <div className="my-4">
    <label htmlFor="currencySelect" className="block mb-2">Select Currency:</label>
    <select 
    id="currencySelect" 
    value={currency} 
    onChange={handleCurrencyChange}
    className="p-2 border rounded"
    >
    <option value="KES">KES</option>
    <option value="USD">USD</option>
    </select>
    </div>
    
    <div className="my-4">
    <label htmlFor="paymentMethodSelect" className="block mb-2">Select Payment Method:</label>
    <select 
    id="paymentMethodSelect" 
    value={paymentMethod} 
    onChange={handlePaymentMethodChange}
    className="p-2 border rounded"
    >
    <option value="MPESA">M-Pesa</option>
    <option value="PAYPAL">PayPal</option>
    </select>
    </div>
    
    <div className="my-4">
    <label htmlFor="phoneNumberInput" className="block mb-2">Phone Number:</label>
    <input 
    id="phoneNumberInput"
    type="tel" 
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    className="p-2 border rounded w-full"
    placeholder="Enter phone number"
    required
    />
    </div>
    
    <div className="my-4">
    <p className="text-xl font-bold">Total Price: {formatPrice(totalPrice)}</p>
    </div>
    
    <div className="flex gap-4 my-4">
    <button 
    type="submit"
    className='btn btn-secondary'
    >
    Add to Cart
    </button>
    <button 
    type="submit"
    className='btn btn-warning'
    >
    Pay Now
    </button>
    </div>
    </form>
    </div>
  );
}