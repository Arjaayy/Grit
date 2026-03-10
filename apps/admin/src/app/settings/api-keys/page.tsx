'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { 
  Key,
  Plus,
  Copy,
  Eye,
  EyeSlash,
  Trash,
  ArrowClockwise,
  Shield,
  Globe,
} from '@phosphor-icons/react'
import { Button } from '@repo/ui'
import { Input } from '@repo/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { Badge } from '@repo/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui'
import AdminPageHeader from '@/components/admin/admin-page-header'

// Mock API keys data
const mockApiKeys = [
  {
    id: '1',
    name: 'Tuguegarao League Production',
    key: 'sk_live_tuguegarao_abc123def456',
    organization: 'Tuguegarao League',
    domain: 'tuguegaraoleague.gritdp.com',
    status: 'active',
    permissions: ['read_events', 'create_registrations'],
    lastUsed: '2026-03-10T14:30:00Z',
    createdAt: '2026-01-15T10:00:00Z',
    expiresAt: '2026-12-31T23:59:59Z',
    requests: 15420,
    rateLimit: 1000,
  },
  {
    id: '2',
    name: 'SPU Athletics Test',
    key: 'sk_test_spupath_789ghi012jkl',
    organization: 'SPU Athletics',
    domain: 'spupathletics.gritdp.com',
    status: 'active',
    permissions: ['read_events', 'create_registrations'],
    lastUsed: '2026-03-11T09:15:00Z',
    createdAt: '2026-02-20T15:30:00Z',
    expiresAt: '2026-06-30T23:59:59Z',
    requests: 892,
    rateLimit: 500,
  },
  {
    id: '3',
    name: 'Cagayan Basketball Dev',
    key: 'sk_dev_cagayan_mno345pqr678',
    organization: 'Cagayan Basketball',
    domain: 'cagayanbasketball.gritdp.com',
    status: 'inactive',
    permissions: ['read_events'],
    lastUsed: '2026-02-28T16:45:00Z',
    createdAt: '2026-01-10T08:00:00Z',
    expiresAt: '2026-03-31T23:59:59Z',
    requests: 156,
    rateLimit: 200,
  },
]

export default function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState(mockApiKeys)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const filteredApiKeys = useMemo(() => {
    return apiKeys.filter((key) => {
      const matchesSearch = 
        key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.domain?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || key.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [apiKeys, searchTerm, statusFilter])

  const copyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const regenerateKey = (keyId: string) => {
    // In a real implementation, this would call the API
    const newKey = `sk_regenerated_${Date.now()}`
    setApiKeys(prev => 
      prev.map(key => 
        key.id === keyId 
          ? { ...key, key: newKey, lastUsed: new Date().toISOString() }
          : key
      )
    )
  }

  const deleteKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId))
  }

  const maskKey = (key: string) => {
    return key.length > 20 
      ? `${key.substring(0, 8)}...${key.substring(key.length - 8)}`
      : key
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'expired': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title="API Key Management"
        description="Manage API keys for client site integrations"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Generate New Key
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, organization, or domain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys ({filteredApiKeys.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell>{apiKey.organization}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {apiKey.domain}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {showKeys[apiKey.id] ? (
                            <EyeSlash className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          {copiedKey === apiKey.key ? (
                            <Badge variant="secondary" className="text-xs">Copied!</Badge>
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(apiKey.status)}>
                        {apiKey.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{apiKey.requests.toLocaleString()}</div>
                        <div className="text-muted-foreground">/ {apiKey.rateLimit}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(apiKey.lastUsed)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => regenerateKey(apiKey.id)}
                        >
                          <ArrowClockwise className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteKey(apiKey.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total API Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiKeys.reduce((sum, key) => sum + key.requests, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apiKeys.filter(key => key.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(apiKeys.reduce((sum, key) => sum + key.requests, 0) / apiKeys.length).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Requests per key</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
