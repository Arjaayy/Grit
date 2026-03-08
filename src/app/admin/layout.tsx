'use client'

import { usePathname } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AdminSidebar from '@/components/admin/sidebar'
import { ErrorBoundary } from '@/components/admin/error-boundary'
import { NotificationProvider } from '@/components/admin/notifications'
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
      <NotificationProvider>
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-3 sm:p-4 pt-3 sm:pt-4 min-h-0">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </NotificationProvider>
    </SessionProvider>
  )
}
