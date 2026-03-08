'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { 
  BuildingOffice,
  Plus,
  MagnifyingGlass,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import AdminPageHeader from '@/components/admin/admin-page-header'
import {
  getAdminOrganizations,
  deleteAdminOrganization,
  type AdminOrganizationRecord,
} from '@/lib/admin-organizations-store'
import { formatDateShort } from '@/lib/admin-utils'

export default function OrganizationsManagement() {
  const [organizations, setOrganizations] = useState<AdminOrganizationRecord[]>(() =>
    getAdminOrganizations()
  )
  const [searchTerm, setSearchTerm] = useState('')

  const [filterType, setFilterType] = useState<'all' | AdminOrganizationRecord['type']>('all')

  const types = useMemo(() => {
    return Array.from(new Set(organizations.map((o) => o.type)))
  }, [organizations])

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'all' || org.type === filterType

    return matchesSearch && matchesType
  })

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title="Organizations"
        description="Manage sports organizations / clients"
        actions={
          <Button asChild size="sm">
            <Link href="/admin/organizations/new">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Organization</span>
              <span className="sm:hidden">New</span>
            </Link>
          </Button>
        }
      />

      {/* Search + Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setFilterType('all')
              }}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Organizations Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Organization Name</TableHead>
                  <TableHead className="min-w-[80px] hidden sm:table-cell">Type</TableHead>
                  <TableHead className="min-w-[120px] hidden md:table-cell">Contact Person</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">Email</TableHead>
                  <TableHead className="min-w-[100px] hidden xl:table-cell">Phone</TableHead>
                  <TableHead className="min-w-[80px] text-right hidden sm:table-cell">Events</TableHead>
                  <TableHead className="min-w-[80px] text-right hidden lg:table-cell">Created</TableHead>
                  <TableHead className="min-w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">{org.name}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          <Badge variant="outline" className="text-xs mr-2">{org.type}</Badge>
                          {org.contactPerson}
                        </div>
                        <div className="text-xs text-muted-foreground md:hidden lg:hidden">
                          {org.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">{org.type}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{org.contactPerson}</TableCell>
                    <TableCell className="hidden lg:table-cell">{org.email}</TableCell>
                    <TableCell className="hidden xl:table-cell">{org.phone}</TableCell>
                    <TableCell className="text-right hidden sm:table-cell">{org.totalEventsHosted}</TableCell>
                    <TableCell className="text-right hidden lg:table-cell">{formatDateShort(org.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col sm:flex-row sm:inline-flex items-center gap-1 sm:gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/organizations/${org.id}`}>
                            <span className="hidden sm:inline">View</span>
                            <span className="sm:hidden">V</span>
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/organizations/${org.id}/edit`}>
                            <span className="hidden sm:inline">Edit</span>
                            <span className="sm:hidden">E</span>
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            deleteAdminOrganization(org.id)
                            setOrganizations(getAdminOrganizations())
                          }}
                        >
                          <span className="hidden sm:inline">Delete</span>
                          <span className="sm:hidden">D</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          </div>

          {filteredOrganizations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <BuildingOffice className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No organizations found</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Get started by adding your first organization'
                }
              </p>
              {!searchTerm && (
                <Button asChild size="sm">
                  <Link href="/admin/organizations/new">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Add Your First Organization</span>
                    <span className="sm:hidden">Add Organization</span>
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
