"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main"
import { NavDocuments } from "@/components/nav-documents"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"

// Navigation data
const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: null,
  },
  {
    title: "Events",
    url: "/admin/events",
    icon: null,
  },
  {
    title: "Organizations",
    url: "/admin/organizations",
    icon: null,
  },
]

const documentNavItems = [
  {
    name: "Getting Started",
    url: "/docs",
    icon: null,
  },
  {
    name: "API Reference",
    url: "/docs/api",
    icon: null,
  },
]

const secondaryNavItems = [
  {
    title: "Settings",
    url: "/admin/settings",
    icon: null,
  },
  {
    title: "Help",
    url: "/help",
    icon: null,
  },
]

const userData = {
  name: "Admin User",
  email: "admin@example.com",
  avatar: "/avatars/01.png",
}

interface DashboardSidebarProps {
  variant?: "sidebar" | "floating" | "inset"
}

export function DashboardSidebar({ variant = "sidebar" }: DashboardSidebarProps) {
  return (
    <SidebarProvider>
      <Sidebar variant={variant} collapsible="icon">
        <SidebarHeader>
          <SidebarMenuButton size="sm" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavMain items={mainNavItems} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Documentation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavDocuments items={documentNavItems} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavSecondary items={secondaryNavItems} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={userData} />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
