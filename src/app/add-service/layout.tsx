'use client'

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
    <AdminProtectedRoute>
    <div className="h-fit sm:h-screen rounded-lg bg-gray-200">
    <AdminSidebar />
    </div>
    <div className="h-fit rounded-lg bg-gray-200 lg:col-span-2">{children}</div>
    </AdminProtectedRoute>
    </div>
  )
}

export default layout