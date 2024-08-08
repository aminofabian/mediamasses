"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface FreeTrial {
  id: number;
  serviceType: string;
  link: string;
  currentCount: number;
  requestedAt: string;
  status: string;
  completedAt: string | null;
  notes: string | null;
}

const FreeTrialCard: React.FC = () => {
  const [freeTrials, setFreeTrials] = useState<FreeTrial[]>([])
  const { data: session } = useSession()
  
  useEffect(() => {
    const fetchFreeTrials = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/freeTrials?email=${encodeURIComponent(session.user.email)}`)
          if (response.ok) {
            const data = await response.json()
            setFreeTrials(data.freeTrials)
          } else {
            console.error('Failed to fetch free trials')
          }
        } catch (error) {
          console.error('Error fetching free trials:', error)
        }
      }
    }
    
    fetchFreeTrials()
  }, [session])
  
  const getElapsedTime = (requestedAt: string) => {
    const now = new Date();
    const requested = new Date(requestedAt);
    const diffInMinutes = Math.floor((now.getTime() - requested.getTime()) / 60000);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  }
  
  return (
    <div className="overflow-x-auto">
    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
    <thead className="ltr:text-left rtl:text-right uppercase">
    <tr>
    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Service Type</th>
    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Link</th>
    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Start Count</th>
    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Current Count</th>
    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Elapsed Time</th>
    <th className="px-4 py-2">Status</th>
    </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 uppercase text-xs">
    {freeTrials.map((trial) => (
      <tr key={trial.id}>
      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{trial.serviceType.replace(/_/g, ' ')}</td>
      <td className="whitespace-nowrap px-4 py-2 text-indigo-600 hover:underline text-xs">
      <a href={trial.link} target="_blank" rel="noopener noreferrer">{trial.link}</a>
      </td>
      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{trial.currentCount}</td>
      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{trial.currentCount}</td>
      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{getElapsedTime(trial.requestedAt)} ago</td>
      <td className="whitespace-nowrap px-4 py-2">
      <a href="#" className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">
      {trial.status}
      </a>
      </td>
      </tr>
    ))}
    </tbody>
    </table>
    </div>
  )
}

export default FreeTrialCard