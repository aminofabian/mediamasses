'use client'

import React, { useState, useEffect } from 'react';
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
  const [timeDifferences, setTimeDifferences] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Sort orderItems in ascending order based on orderCreatedAt
  const sortedOrderItems = [...orderItems].sort((b, a) => 
    new Date(a.orderCreatedAt).getTime() - new Date(b.orderCreatedAt).getTime()
);

useEffect(() => {
  const calculateTimeDifference = (createdAt: string | Date) => {
    const now = new Date();
    const orderDate = new Date(createdAt);
    const diffInMilliseconds = now.getTime() - orderDate.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    
    const days = Math.floor(diffInSeconds / (3600 * 24));
    const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };
  
  const updateTimeDifferences = () => {
    const newTimeDifferences = sortedOrderItems.map(item => 
      calculateTimeDifference(item.orderCreatedAt)
    );
    setTimeDifferences(newTimeDifferences);
  };
  
  updateTimeDifferences();
  const intervalId = setInterval(updateTimeDifferences, 1000);
  
  return () => clearInterval(intervalId);
}, [sortedOrderItems]);

if (!sortedOrderItems || sortedOrderItems.length === 0) {
  return <div>No orders found.
  <FreeTrial />
  </div>
}

const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = sortedOrderItems.slice(indexOfFirstItem, indexOfLastItem);

const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

return (
  <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
  <h2 className="mb-4 text-2xl font-semibold leading-tight">Order Items</h2>
  <div className="flex  flex-col mb-4 text-lg font-semibold">
  Total Orders: {sortedOrderItems.length}
  <p className='uppercase text-sm font-light bg-purple-100 inline text-center py-2 text-purple-700 '>
  INCASE YOU MISSED PAYMENT OR HAD A DELAYED STK PUSH, YOU CAN Pay Manually VIA OUR Till (buy gOODS) <span className="font-bold text-sm">(5190273)</span>
  </p>      
  </div>
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
  <th className="p-3">Time Since Order</th>
  <th className="p-3">Payment Method</th>
  <th className="p-3">Status</th>
  <th className="p-3">Payment Status</th>
  </tr>
  </thead>
  <tbody>
  {currentItems.map((item, index) => (
    <tr key={item.id} className="border-b border-opacity-20 bg-purple-50 rounded-xl space-y-3 gap-2">
    <td className="p-3">{item.orderId}</td>
    <td className="p-2 bg-secondary text-teal-700 rounded-md font-light text-xs">{item.service.serviceType.replace(/_/g, ' ')}</td>
    <td className="p-3">{item.quantity}</td>
    <td className="p-3">{item.price.toFixed(2)}</td>
    <td className="p-3">{item.priceType}</td>
    <td className="p-3 bg-secondary text-rose-700 rounded-md text-xs cursor-pointer lowercase">
    <a 
    href={item.targetUrl} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="hover:underline"
    >
    {item.targetUrl}
    </a>
    </td>
    <td className="p-3">{new Date(item.orderCreatedAt).toLocaleDateString()}</td>
    <td className="p-3">{timeDifferences[indexOfFirstItem + index]}</td>
    <td className="p-3 bg-secondary rounded-md text-center text-purple-700 font-light">{item.orderPaymentMethod}</td>
    <td className="p-3 font-light rounded-lg text-xs" style={{
      color: item.orderStatus.toLowerCase() === 'completed' ? 'green' :
      item.orderStatus.toLowerCase() === 'processing' ? 'amber' : 'orange'
    }}>
    {item.orderStatus}
    </td>
    <td className="bg-secondary rounded-lg text-center cursor-pointer mx-auto items-center" style={{
      color: item.paymentStatus.toLowerCase() === 'paid' ? 'green' :
      item.paymentStatus.toLowerCase() === 'processing' ? 'amber' : 'orange'
    }}>
    {item.paymentStatus.toUpperCase()}
    </td>
    </tr>
  ))}
  </tbody>
  </table>
  </div>
  <div className="flex justify-center mt-4">
  {Array.from({ length: Math.ceil(sortedOrderItems.length / itemsPerPage) }, (_, i) => (
    <button
    key={i}
    onClick={() => paginate(i + 1)}
    className={`mx-1 px-3 py-1 rounded ${
      currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
    }`}
    >
    {i + 1}
    </button>
  ))}
  </div>
  </div>
)
}

export default OrderDisplay