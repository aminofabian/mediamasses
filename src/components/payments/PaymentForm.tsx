"use client";

import React, { useState } from 'react';
import { createOrder } from '@/app/(actions)/createOrder';
import { useRouter } from 'next/navigation';

interface Service {
  id: number;
  name: string;
  lowPrice: number | null;
  mediumPrice: number | null;
  highPrice: number | null;
}

interface PaymentFormProps {
  service: Service;
  onSubmit: (data: SubmitData) => void;
  isPending: boolean;
}

interface SubmitData {
  serviceId: number;
  priceType: string;
  quantity: number;
  targetUrl: string;
  amount: number;
  phoneNumber: string;
  orderId: number | undefined;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ service, onSubmit, isPending }) => {
  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedPriceType, setSelectedPriceType] = useState<string>('medium');
  const [quantity, setQuantity] = useState<number | null>(null);
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  
  const calculatePrice = (amount: number, priceType: string): number => {
    let price: number;
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
  
  const updatePrice = (priceType: string): void => {
    setSelectedPriceType(priceType);
    setTotalPrice(calculatePrice(quantity || 0, priceType));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    
    const formData = new FormData();
    formData.append('serviceId', service.id.toString());
    formData.append('priceType', selectedPriceType.toUpperCase());
    formData.append('price', totalPrice.toString());
    formData.append('quantity', quantity?.toString() || '0');
    formData.append('targetUrl', targetUrl);
    formData.append('paymentMethod', 'MPESA');
    formData.append('phoneNumber', phoneNumber);
    
    try {
      const orderResult = await createOrder(formData);
      
      if (orderResult.success) {
        const submitData = {
          serviceId: service.id,
          priceType: selectedPriceType.toUpperCase(),
          quantity: quantity || 0,
          targetUrl,
          amount: totalPrice,
          phoneNumber,
          orderId: orderResult.orderId,
        };
        
        onSubmit(submitData);
        
        // Initiate payment
        const paymentResponse = await fetch('/api/initiate-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
        
        const paymentResult = await paymentResponse.json();
        
        if (paymentResult.success) {
          // Redirect to payment confirmation page
          router.push(`/payment-confirmation?orderId=${orderResult.orderId}`);
        } else {
          if (paymentResult.error_code === 429) {
            alert('There is already a pending payment request for this phone number. Please wait a moment before trying again.');
          } else {
            console.error('Payment initiation failed:', paymentResult.error);
            alert('Payment initiation failed. Please try again.');
          }
        }
      } else {
        console.error('Failed to create order:', orderResult.error);
        alert('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setIsButtonDisabled(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
    <div className="flex justify-between gap-2 mb-4 uppercase">
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
    placeholder="eg. https://www.youtube.com/watch?v=lGhJzBLPgBw" 
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
    <div className="flex flex-col sm:flex-row gap-2 w-full justify-center uppercase">
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
      <p className="text-sm text-gray-500 mt-2"></p>
    )}
    </div>
    </form>
  );
};

export default PaymentForm;