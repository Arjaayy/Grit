'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  House, 
  Images, 
  Calendar, 
  Users, 
  ChartBar, 
  Gear, 
  SignOut
} from '@phosphor-icons/react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: House },
  { name: 'Portfolio', href: '/admin/portfolio', icon: Images },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Organizations', href: '/admin/organizations', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBar },
  { name: 'Settings', href: '/admin/settings', icon: Gear },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-white border-r border-blue-50">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-blue-50">
        <Link href="/admin" className="text-xl font-bold text-blue-950">
          Grit Digital Performance
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-950 border-l-4 border-blue-950'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-blue-950' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-blue-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-950 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@gritdigital.com</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <SignOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
