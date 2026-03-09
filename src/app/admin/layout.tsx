'use client'

import { usePathname } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { ThemeProvider } from '@/components/dashboard/theme-provider'
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
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </SessionProvider>
    )
  }

  return (
    <SessionProvider>
      <NotificationProvider>
        <ThemeProvider>
          <SidebarProvider
            style={{
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
          >
            <AdminSidebar />
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 p-3 sm:p-4 pt-3 sm:pt-4 min-h-0 admin-layout">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </NotificationProvider>
    </SessionProvider>
  )
}
