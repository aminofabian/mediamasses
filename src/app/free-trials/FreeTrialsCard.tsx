'use client';

import React, { useEffect, useState } from 'react';

interface FreeTrial {
  id: string | number;
  user?: {
    name: string;
  };
  serviceType: string;
  link: string;
  currentCount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
}

const FreeTrialsCard: React.FC = () => {
  const [freeTrials, setFreeTrials] = useState<FreeTrial[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  useEffect(() => {
    fetchFreeTrials(currentPage);
  }, [currentPage]);
  
  const fetchFreeTrials = async (page: number) => {
    const response = await fetch(`/api/freetrialsadmin?page=${page}`);
    const data: { freeTrials: FreeTrial[], totalPages: number, currentPage: number } = await response.json();
    setFreeTrials(data.freeTrials);
    setTotalPages(data.totalPages);
    setCurrentPage(data.currentPage);
  };
  
  const updateStatus = async (id: string | number, newStatus: FreeTrial['status']) => {
    try {
      const response = await fetch('/api/freeTrials/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      if (response.ok) {
        // Refresh the current page
        fetchFreeTrials(currentPage);
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  return (
    <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
    <h2 className="mb-4 text-2xl font-semibold leading-tight">Free Trials</h2>
    <div className="overflow-x-auto">
    <table className="min-w-full text-xs">
    <colgroup>
    <col />
    <col />
    <col />
    <col />
    <col />
    <col className="w-24" />
    </colgroup>
    <thead className="dark:bg-gray-300">
    <tr className="text-left">
    <th className="p-3">ID</th>
    <th className="p-3">User</th>
    <th className="p-3">Service Type</th>
    <th className="p-3">Link</th>
    <th className="p-3">Current Count</th>
    <th className="p-3">Status</th>
    </tr>
    </thead>
    <tbody>
    {freeTrials.map((trial) => (
      <tr key={trial.id} className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
      <td className="p-3">
      <p>{trial.id}</p>
      </td>
      <td className="p-3">
      <p>{trial.user?.name || 'N/A'}</p>
      </td>
      <td className="p-3">
      <p>{trial.serviceType}</p>
      </td>
      <td className="p-3">
      <p>{trial.link}</p>
      </td>
      <td className="p-3">
      <p>{trial.currentCount}</p>
      </td>
      <td className="p-3">
      <select
      value={trial.status}
      onChange={(e) => updateStatus(trial.id, e.target.value as FreeTrial['status'])}
      className={`px-3 py-1 font-semibold rounded-md ${getStatusColor(trial.status)}`}
      >
      <option value="PENDING">Pending</option>
      <option value="PROCESSING">Processing</option>
      <option value="COMPLETED">Completed</option>
      <option value="REJECTED">Rejected</option>
      </select>
      </td>
      </tr>
    ))}
    </tbody>
    </table>
    </div>
    <div className="flex justify-center mt-4">
    <button
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
    >
    Previous
    </button>
    <span className="px-4 py-2">
    Page {currentPage} of {totalPages}
    </span>
    <button
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-4 py-2 ml-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
    >
    Next
    </button>
    </div>
    </div>
  );
};

function getStatusColor(status: FreeTrial['status']): string {
  switch (status) {
    case 'PENDING':
    return 'bg-yellow-200 text-yellow-800';
    case 'PROCESSING':
    return 'bg-blue-200 text-blue-800';
    case 'COMPLETED':
    return 'bg-green-200 text-green-800';
    case 'REJECTED':
    return 'bg-red-200 text-red-800';
    default:
    return 'bg-gray-200 text-gray-800';
  }
}

export default FreeTrialsCard;