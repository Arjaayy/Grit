'use client'

import { useRequireAuth } from '@/lib/client-auth'
import Link from 'next/link'
import { 
  Images, 
  Calendar, 
  Users, 
  ChartBar
} from '@phosphor-icons/react'

export default function AdminDashboard() {
  const { session, loading, authenticated } = useRequireAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!authenticated) {
    return null // Will redirect to login
  }

  // Mock stats for now
  const stats = {
    totalProjects: 12,
    totalEvents: 8,
    totalOrganizations: 15,
    totalRegistrations: 245,
    totalRevenue: 48750
  }

  const statCards = [
    { name: 'Portfolio Projects', value: stats.totalProjects, change: '+2 from last month', icon: Images },
    { name: 'Active Events', value: stats.totalEvents, change: '+1 from last month', icon: Calendar },
    { name: 'Organizations', value: stats.totalOrganizations, change: '+3 from last month', icon: Users },
    { name: 'Total Registrations', value: stats.totalRegistrations, change: '+45 from last month', icon: ChartBar },
  ]

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {session?.user?.name}. Here&apos;s what&apos;s happening with your platform today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-blue-950" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm text-gray-500">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/portfolio/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-950 hover:bg-blue-900"
            >
              <Images className="h-4 w-4 mr-2" />
              Add Portfolio Project
            </Link>
            <Link
              href="/admin/events/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Create Event
            </Link>
            <Link
              href="/admin/organizations/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-950 hover:bg-blue-900"
            >
              <Users className="h-4 w-4 mr-2" />
              Add Organization
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Images className="h-5 w-5 text-blue-950" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  New portfolio project <span className="font-medium">&quot;Football Club Website&quot;</span> was published
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Calendar className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Event <span className="font-medium">&quot;Summer Soccer Camp&quot;</span> received 15 new registrations
                </p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Users className="h-5 w-5 text-blue-950" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  New organization <span className="font-medium">&quot;Denver Basketball League&quot;</span> joined
                </p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
