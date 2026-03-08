'use client'

import { usePathname } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AdminSidebar from '@/components/admin/sidebar'
import './admin.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Don't render sidebar on auth pages
  const isAuthPage = pathname?.includes('/auth')
  
  if (isAuthPage) {
    return (
      <SessionProvider>
        {children}
      </SessionProvider>
    )
  }

  return (
    <SessionProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  )
}
