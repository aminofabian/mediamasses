"use client"
import React, { useEffect, useState } from 'react'

interface Service {
  name: string;
  socialAccount: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  priceType: string;
  targetUrl: string;
  paymentStatus: string;
  service: Service;
}

interface Order {
  id: number;
  createdAt: string;
  updatedAt: string;
  total: number;
  status: string;
  paymentMethod: string;
  currencyCode: string;
  user: {
    name: string | null;
    email: string;
  };
  orderItems: OrderItem[];
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/allOrders')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log(`Received ${data.orders.length} orders from the API`)
        setOrders(data.orders)
      } catch (error) {
        setError('Error fetching orders. Please try again later.')
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOrders()
  }, [])  
  useEffect(() => {
    console.log(`Rendering ${orders.length} orders`)
  }, [orders])
  
  if (isLoading) return <div>Loading orders...</div>
  if (error) return <div className="text-red-500">{error}</div>
  
  return (
    <div className="space-y-8">
    {orders.map((order) => (
      <div key={order.id} className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Order #{order.id}</h2>
      <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
      <p>Customer: {order.user ? (order.user.name || 'N/A') : 'N/A'} ({order.user?.email || 'No email'})</p>
      <p>Total: {order.total} {order.currencyCode}</p>
      <p>Status: {order.status}</p>
      
      <p>Payment Method: {order.paymentMethod}</p>
      
      <h3 className="font-semibold mt-4 mb-2">Order Items:</h3>
      <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
      <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
      
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
      </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
      {order.orderItems.map((item) => (
        <tr key={item.id}>
        <td className="px-6 py-4 whitespace-nowrap">{item.service?.name || 'N/A'} ({item.service?.socialAccount || 'N/A'})</td>
        <td className="px-6 py-4 whitespace-nowrap">{item.targetUrl}</td>
          <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
          
        <td className="px-6 py-4 whitespace-nowrap">{item.price} ({item.priceType})</td>
        <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          item.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
        {item.paymentStatus}
        </span>
        </td>
        </tr>
      ))}
      </tbody>
      </table>
      </div>
    ))}
    </div>
  )
}
