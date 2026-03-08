'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BuildingOffice,
  Users,
  Calendar,
  CurrencyDollar,
  Plus,
  Pencil,
  Trash,
  Eye
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Organization {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  eventsCount: number
  totalRevenue: number
  createdAt: string
  contactPerson: string
}

export default function OrganizationsManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      // Mock data for now
      const mockOrganizations: Organization[] = [
        {
          id: '1',
          name: 'Denver Soccer Academy',
          email: 'info@denversoccer.com',
          phone: '(303) 555-0123',
          status: 'active',
          eventsCount: 12,
          totalRevenue: 125000,
          createdAt: '2024-01-15T10:30:00Z',
          contactPerson: 'John Smith'
        },
        {
          id: '2',
          name: 'Colorado Sports League',
          email: 'admin@cosportsleague.com',
          phone: '(720) 555-0456',
          status: 'active',
          eventsCount: 8,
          totalRevenue: 95000,
          createdAt: '2024-02-20T14:45:00Z',
          contactPerson: 'Sarah Johnson'
        },
        {
          id: '3',
          name: 'Elite Athletes Academy',
          email: 'contact@eliteathletes.com',
          phone: '(303) 555-0789',
          status: 'inactive',
          eventsCount: 5,
          totalRevenue: 45000,
          createdAt: '2024-03-10T09:20:00Z',
          contactPerson: 'Mike Davis'
        }
      ]
      setOrganizations(mockOrganizations)
    } catch (error) {
      console.error('Failed to fetch organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Organizations</h2>
        </div>
        <Button className="bg-blue-950 hover:bg-blue-900">
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <BuildingOffice className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.filter(o => o.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.reduce((sum, o) => sum + o.eventsCount, 0)}</div>
            <p className="text-xs text-muted-foreground">
              All time events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${organizations.reduce((sum, o) => sum + o.totalRevenue, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Organizations List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredOrganizations.map((org) => (
              <div key={org.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <BuildingOffice className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="text-lg font-medium">{org.name}</h3>
                        <p className="text-sm text-muted-foreground">{org.email}</p>
                      </div>
                      <Badge variant={org.status === 'active' ? 'default' : 'secondary'}>
                        {org.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{org.phone}</span>
                      <span>•</span>
                      <span>Contact: {org.contactPerson}</span>
                      <span>•</span>
                      <span>Joined: {new Date(org.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{org.eventsCount} events</span>
                      <span>•</span>
                      <span>${org.totalRevenue.toLocaleString()} revenue</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredOrganizations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <BuildingOffice className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No organizations found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Get started by adding your first organization'
                }
              </p>
              {!searchTerm && (
                <Button className="bg-blue-950 hover:bg-blue-900">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Organization
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
