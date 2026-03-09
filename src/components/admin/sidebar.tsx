'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { 
  House, 
  Images, 
  Calendar, 
  Users, 
  ChartBar, 
  UserCircle,
  CreditCard,
  Gear, 
  SignOut,
  FileText
} from '@phosphor-icons/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/dashboard/theme-toggle'

// Navigation items
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: House,
  },
  {
    title: "Portfolio",
    url: "/admin/portfolio",
    icon: Images,
  },
  {
    title: "Events",
    url: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Organizations",
    url: "/admin/organizations",
    icon: Users,
  },
  {
    title: "Participants",
    url: "/admin/participants",
    icon: UserCircle,
  },
  {
    title: "Payments",
    url: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: ChartBar,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Gear,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/auth/signin' })
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="w-full" aria-label="Grit Digital Performance - Go to dashboard">
              <Link href="/admin" className="flex items-center gap-3">
                <Image
                  src="/logo/gritLogo2.webp"
                  alt="Grit Digital Performance"
                  width={40}
                  height={40}
                  className="object-contain shrink-0"
                />
                <div className="hidden sm:flex flex-col justify-center">
                  <div className="flex items-baseline" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, textTransform: 'uppercase', fontSize: '1.25rem', letterSpacing: '0.05em' }}>
                    <span>Grit</span>
                    <span className="ml-1" style={{ color: '#e8192c', fontStyle: 'italic' }}>Digital</span>
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, textTransform: 'uppercase', fontSize: '0.56rem', letterSpacing: '0.07em' }}>
                    Performance
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu role="navigation" aria-label="Admin navigation">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === item.url}
                aria-label={item.title}
                aria-current={pathname === item.url ? 'page' : undefined}
              >
                <Link href={item.url}>
                  <item.icon aria-hidden="true" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full p-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="sm" className="w-full justify-start">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{session?.user?.name || 'Admin User'}</span>
                      <span className="truncate text-xs">{session?.user?.email || 'admin@example.com'}</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-lg" side="bottom" align="end">
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <SignOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
