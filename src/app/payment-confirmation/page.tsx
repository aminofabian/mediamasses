'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentConfirmation() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<{
    orderId: string;
    amount: number;
    serviceName: string;
  } | null>(null);
  
  useEffect(() => {
    // In a real application, you would fetch the order details from your backend
    // or get them from the URL parameters. For this example, we'll use mock data.
    const mockOrderDetails = {
      orderId: 'ORD-' + Math.random().toString(36).substr(2, 9),
      amount: 1000,
      serviceName: 'Sample Service',
    };
    setOrderDetails(mockOrderDetails);
    
    // Optionally, you can redirect to the home page after a delay
    const timer = setTimeout(() => {
      router.push('/');
    }, 20000); // Redirect after 10 seconds
    
    return () => clearTimeout(timer);
  }, [router]);
  
  if (!orderDetails) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
    <svg
    className="mx-auto h-16 w-16 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    >
    <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M5 13l4 4L19 7"
    />
    </svg>
    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
    We&apos;re Processing Your Payments. We&apos;ll Run Your Order After That!
    </h2>
    <p className="mt-2 text-sm text-gray-600">
    Kindly check your phone to complete payments if you haven&apos;t done so already... 
    </p>
    <div className="mt-4">
    <p className="text-sm font-medium text-gray-900">Order Details:</p>
    <p className="text-sm text-gray-600">Order ID: {orderDetails.orderId}</p>
    <p className="text-sm text-gray-600">Amount: KES {orderDetails.amount.toFixed(2)}</p>
    <p className="text-sm text-gray-600">Service: {orderDetails.serviceName}</p>
    </div>
    <div className="mt-6">
    <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
    Return to Home Page
    </Link>
    </div>
    </div>
    </div>
  );
}