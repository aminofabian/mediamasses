'use client';

import Image from 'next/image';
import React, { useState, useMemo } from 'react';
import { PriceType, Service, PaymentMethod } from '@prisma/client';
import { useCart } from '@/lib/CardContext';
import { useRouter } from 'next/navigation';

interface ServicePageClientProps {
  service: Service;
}

const USD_TO_KES_RATE = 130;

export default function ServicePageClient({ service }: ServicePageClientProps) {
  const [selectedPrice, setSelectedPrice] = useState<PriceType>('MEDIUM');
  const [quantity, setQuantity] = useState(service.minQuantity);
  const [targetUrl, setTargetUrl] = useState('');
  const [currency, setCurrency] = useState<'KES' | 'USD'>('KES');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MPESA');
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
      paymentMethod,
    });
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
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
    <div>
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
    <option value="LOW">Low: {formatPrice(service.lowPrice / 1000)}</option>
    <option value="MEDIUM">Medium: {formatPrice(service.mediumPrice / 1000)}</option>
    <option value="HIGH">High: {formatPrice(service.highPrice / 1000)}</option>
    </select>
    </div>
    
    <div className="my-4">
    <label htmlFor="quantityInput" className="block mb-2">Quantity ({service.minQuantity} - {service.maxQuantity}):</label>
    <input 
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
    id="targetUrlInput"
    type="text" 
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
    <p className="text-xl font-bold">Total Price: {formatPrice(totalPrice)}</p>
    </div>
    
    <div className="flex gap-4 my-4">
    <button 
    className='btn btn-secondary'
    onClick={handleAddToCart}
    >
    Add to Cart
    </button>
    <button 
    className='btn btn-warning'
    onClick={handleBuyNow}
    >
    Pay Now
    </button>
    </div>
    </div>
    </div>
  );
}