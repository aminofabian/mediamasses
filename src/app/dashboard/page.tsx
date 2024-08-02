'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { OrderItem, Service } from '@prisma/client'

import OrderDisplay from '@/components/Dashboard/OrderDisplay'
import ServiceAccordion from '@/components/Dashboard/OrderForm'
import Loader from '@/components/Dashboard/Loader'
import FreeTrialCard from '@/components/Dashboard/FreeTrialCard'

interface ExtendedOrderItem extends OrderItem {
  service: Service;
  orderId: number;
  orderCreatedAt: Date;
  orderStatus: string;
  orderPaymentMethod: string;
}

const getBackgroundColor = (socialAccount: string) => {
  switch(socialAccount.toLowerCase()) {
    case 'youtube':
    return 'bg-red-100';
    case 'twitter':
    return 'bg-sky-100';
    case 'facebook':
    return 'bg-blue-100';
    case 'instagram':
    return 'bg-pink-100';
    case 'linkedin':
    return 'bg-blue-200';
    case 'pinterest':
    return 'bg-red-200';
    case 'snapchat':
    return 'bg-yellow-100';
    case 'tiktok':
    return 'bg-gray-100';
    case 'reddit':
    return 'bg-orange-100';
    case 'whatsapp':
    return 'bg-green-100';
    case 'telegram':
    return 'bg-sky-200';
    case 'spotify':
    return 'bg-green-200';
    case 'twitch':
    return 'bg-purple-100';
    case 'discord':
    return 'bg-indigo-100';
    case 'medium':
    return 'bg-gray-200';
    default:
    return 'bg-white';
  }
};
export default function UserDashboard() {
  const [orderItems, setOrderItems] = useState<ExtendedOrderItem[]>([])
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  
  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          console.error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }
    
    fetchServices();
  }, []);
  
  useEffect(() => {
    async function fetchOrderItems() {
      if (status === 'authenticated' && session?.user?.email) {
        try {
          const response = await fetch(`/api/orders?email=${encodeURIComponent(session.user.email)}`);
          if (response.ok) {
            const data = await response.json();
            setOrderItems(data.orderItems);
          } else {
            console.error('Failed to fetch order items');
          }
        } catch (error) {
          console.error('Error fetching order items:', error);
        }
      }
      setLoading(false);
    }
    
    if (status !== 'loading') {
      fetchOrderItems();
    }
  }, [session, status]);
  
  if (status === 'loading') {
    return <div><Loader /></div>;
  }
  
  if (status === 'unauthenticated') {
    redirect('/api/auth/signin')
  }
  
  // Group services by social account
  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.socialAccount]) {
      acc[service.socialAccount] = [];
    }
    acc[service.socialAccount].push(service);
    return acc;
  }, {} as Record<string, Service[]>);
  
  return (
    <>
    <div className='container border rounded-lg my-10 p-5'>
    {loading ? (
      <div><Loader /></div>
    ) : (
      <OrderDisplay orderItems={orderItems} />
    )}
    </div>
    <h3>Free Trial</h3>
    <div className='border px-5 py-2'><FreeTrialCard /></div>
    <div className="my-5">
    {Object.entries(groupedServices).map(([socialAccount, services]) => (
      <div key={socialAccount} className={`p-4 rounded-lg mb-6 ${getBackgroundColor(socialAccount)}`}>
      <h2 className="text-2xl font-bold mb-4 capitalize">{socialAccount}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {services.map((service) => (
        <div key={service.id} className="border p-2 bg-white rounded-lg">
        <ServiceAccordion service={service} />
        </div>
      ))}
      </div>
      </div>
    ))}
    </div>
    </>
  );
}