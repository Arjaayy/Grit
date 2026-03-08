'use client'

import { SessionProvider } from 'next-auth/react'
import AdminSidebar from '@/components/admin/sidebar'
import './admin.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="admin-layout flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <AdminSidebar />
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}
