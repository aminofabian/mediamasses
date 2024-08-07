'use client'
import React, { useEffect, useState } from 'react';

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
  phoneNumber: string;
  user: {
    name: string | null;
    email: string;
  };
  orderItems: OrderItem[];
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/allOrders');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Received ${data.orders.length} orders from the API`);
        setOrders(data.orders);
      } catch (error) {
        setError('Error fetching orders. Please try again later.');
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  useEffect(() => {
    console.log(`Rendering ${orders.length} orders`);
  }, [orders]);
  
  const handleUpdateStatus = async (orderId: number, itemId: number, action: string) => {
    try {
      const response = await fetch(`/api/updateOrderStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, itemId, action }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedOrder = await response.json();
      setOrders((prevOrders) => prevOrders.map((order) => 
        order.id === updatedOrder.id ? updatedOrder : order
    ));
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

if (isLoading) return <div>Loading orders...</div>;
if (error) return <div className="text-red-500">{error}</div>;

// Calculate pagination
const indexOfLastOrder = currentPage * ordersPerPage;
const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
const totalPages = Math.ceil(orders.length / ordersPerPage);

const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


return (
  <div className="space-y-8">
  {currentOrders.map((order) => (
    <div key={order.id} className="bg-white shadow-md rounded-lg p-6">
    <h2 className="text-xl font-bold mb-4">Order #{order.id}</h2>
    <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
    <p>Customer: {order.user ? (order.user.name || 'N/A') : 'N/A'} ({order.user?.email || 'No email'})</p>
    <p>Total: {order.total} {order.currencyCode}</p>
    <p>Status: {order.status}</p>
    <p>Status: {order.phoneNumber}</p>
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
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
      <td className="px-6 py-4 whitespace-nowrap">
      <button 
      className="btn btn-primary mr-2"
      onClick={() => handleUpdateStatus(order.id, item.id, 'paid')}
      >
      Mark Paid
      </button>
      <select 
      className="btn btn-secondary"
      onChange={(e) => handleUpdateStatus(order.id, item.id, e.target.value)}
      value={order.status}
      >
      <option value="PENDING">Pending</option>
      <option value="PROCESSING">Processing</option>
      <option value="COMPLETED">Completed</option>
      <option value="CANCELLED">Cancelled</option>
      </select>
      </td>
      </tr>
    ))}
    </tbody>
    </table>
    </div>
  ))}
  
  {/* Pagination controls */}
  <div className="flex justify-center mt-4">
  {Array.from({ length: totalPages }, (_, i) => (
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
);
}