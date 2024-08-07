"use client";

import React from 'react'
import FreeTrialsCard from './FreeTrialsCard'
import AdminProtectedRoute from '@/components/AdminProtectedRoute'

const page = () => {
  return (
    <AdminProtectedRoute >
    <div>
    <FreeTrialsCard />
    </div>
    </AdminProtectedRoute >
    
  )
}

export default page