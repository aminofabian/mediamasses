'use client'

import React from 'react';
import { OrderItem, Service, Order } from '@prisma/client';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import FreeTrial from './FreeTrial';
import ServiceAccordion from './OrderForm';

interface ExtendedOrderItem extends OrderItem {
  service: Service;
  orderId: number;
  orderCreatedAt: Date;
  orderStatus: string;
  orderPaymentMethod: string;
}

interface OrderDisplayProps {
  orderItems: ExtendedOrderItem[];
}

function OrderDisplay({ orderItems }: OrderDisplayProps) {
  if (!orderItems || orderItems.length === 0) {
    return <div>No orders found.
    <FreeTrial />
    </div>
  }
  
  return (
    <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
    <h2 className="mb-4 text-2xl font-semibold leading-tight">Order Items</h2>
    <div className="overflow-x-auto">
    <table className="min-w-full text-xs">
    <thead className="dark:bg-gray-300">
    <tr className="text-left">
    <th className="p-3">Order #</th>
    <th className="p-3">Service</th>
    <th className="p-3">Quantity</th>
    <th className="p-3">Price</th>
    <th className="p-3">Price Type</th>
    <th className="p-3">Target URL</th>
    <th className="p-3">Order Date</th>
    <th className="p-3">Payment Method</th>
    <th className="p-3">Status</th>
    <th className="p-3">Payment Status</th>
    
    </tr>
    </thead>
    <tbody>
    {orderItems.map((item) => (
      <tr key={item.id} className="border-b border-opacity-20 bg-purple-50 rounded-xl space-y-3 gap-2">
      <td className="p-3">{item.orderId}</td>
      <td className="p-3 bg-teal-100 text-teal-700 rounded-md font-bold">{item.service.serviceType}</td>
      <td className="p-3">{item.quantity}</td>
      <td className="p-3">{item.price.toFixed(2)}</td>
      <td className="p-3">{item.priceType}</td>
      <td className="p-3 bg-rose-100 text-rose-700 rounded-md text-xs cursor-pointer">{item.targetUrl}</td>
      <td className="p-3">{new Date(item.orderCreatedAt).toLocaleDateString()}</td>
      <td className="p-3 bg-purple-100 rounded-md text-center text-purple-700 font-bold">{item.orderPaymentMethod}</td>
      <td className="p-3  font-bold text-orange-700 rounded-lg">{item.orderStatus}</td>
      <HoverCard>
      <td className="bg-orange-200 rounded-lg text-orange-700 text-center cursor-pointer mx-auto items-center">      <HoverCardTrigger>
      {item.paymentStatus.toUpperCase()}      </HoverCardTrigger>
      </td>
      <HoverCardContent className='bg-green-100 text-green-700'>
      Click Here to Pay if You Haven&#39;t Done so Already
      </HoverCardContent>
      </HoverCard>
      
      </tr>
    ))}
    
    </tbody>
    </table>
    </div>
    </div>
  )
}

export default OrderDisplay