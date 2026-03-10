'use client'

import { useMemo, useState } from 'react'
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts'
import { 
  ChartBar,
  Warning,
  CheckCircle,
  HardDrive,
  TrendUp,
  Users,
  Clock,
  Globe,
  Cpu,
} from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { Badge } from '@repo/ui'
import { Button } from '@repo/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui'
import AdminPageHeader from '@/components/admin/admin-page-header'

// Mock API monitoring data
const mockApiMetrics = [
  { time: '00:00', requests: 145, errors: 2, latency: 120 },
  { time: '04:00', requests: 89, errors: 1, latency: 98 },
  { time: '08:00', requests: 342, errors: 5, latency: 156 },
  { time: '12:00', requests: 456, errors: 8, latency: 189 },
  { time: '16:00', requests: 398, errors: 6, latency: 167 },
  { time: '20:00', requests: 267, errors: 3, latency: 134 },
  { time: '23:59', requests: 178, errors: 2, latency: 112 },
]

const mockEndpointUsage = [
  { endpoint: '/api/events/register', requests: 1250, errors: 12, avgLatency: 145 },
  { endpoint: '/api/events', requests: 890, errors: 5, avgLatency: 98 },
  { endpoint: '/api/events/public', requests: 2340, errors: 8, avgLatency: 76 },
  { endpoint: '/api/participants', requests: 567, errors: 3, avgLatency: 112 },
  { endpoint: '/api/organizations', requests: 234, errors: 1, avgLatency: 89 },
]

const mockDomainMetrics = [
  { domain: 'tuguegaraoleague.gritdp.com', requests: 1456, errors: 8, status: 'healthy' },
  { domain: 'spupathletics.gritdp.com', requests: 892, errors: 3, status: 'healthy' },
  { domain: 'cagayanbasketball.gritdp.com', requests: 567, errors: 15, status: 'warning' },
  { domain: 'direct.admin', requests: 3456, errors: 12, status: 'healthy' },
]

const mockSystemHealth = [
  { metric: 'CPU Usage', value: 45, status: 'healthy', icon: Cpu },
  { metric: 'Memory', value: 62, status: 'healthy', icon: HardDrive },
  { metric: 'Database', value: 78, status: 'warning', icon: ChartBar },
  { metric: 'Network', value: 34, status: 'healthy', icon: Globe },
]

export default function ApiMonitoringDashboard() {
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedMetric, setSelectedMetric] = useState('requests')

  // Calculate totals
  const totalRequests = mockApiMetrics.reduce((sum, item) => sum + item.requests, 0)
  const totalErrors = mockApiMetrics.reduce((sum, item) => sum + item.errors, 0)
  const errorRate = ((totalErrors / totalRequests) * 100).toFixed(2)
  const avgLatency = Math.round(
    mockApiMetrics.reduce((sum, item) => sum + item.latency, 0) / mockApiMetrics.length
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'default'
      case 'warning': return 'secondary'
      case 'critical': return 'destructive'
      default: return 'outline'
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <Warning className="h-4 w-4 text-yellow-500" />
      case 'critical': return <Warning className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title="API Usage Monitoring"
        description="Real-time monitoring of API performance and usage"
        actions={
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="6h">Last 6 hours</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <ChartBar className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <Warning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorRate}%</div>
            <p className="text-xs text-muted-foreground">
              {totalErrors} errors total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgLatency}ms</div>
            <p className="text-xs text-muted-foreground">
              -8ms from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Domains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDomainMetrics.length}</div>
            <p className="text-xs text-muted-foreground">
              All responding
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Request Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Request Volume Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockApiMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Error Rate & Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockApiMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="errors" stroke="#ff7300" strokeWidth={2} />
                <Line type="monotone" dataKey="latency" stroke="#387908" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Endpoint Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Endpoint Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEndpointUsage.map((endpoint, index) => (
              <div key={endpoint.endpoint} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{endpoint.endpoint}</div>
                  <div className="text-sm text-muted-foreground">
                    {endpoint.requests.toLocaleString()} requests • {endpoint.avgLatency}ms avg latency
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{endpoint.errors} errors</div>
                    <div className="text-xs text-muted-foreground">
                      {((endpoint.errors / endpoint.requests) * 100).toFixed(2)}%
                    </div>
                  </div>
                  <Badge variant={endpoint.errors > 10 ? 'destructive' : 'default'}>
                    {endpoint.errors > 10 ? 'High' : 'Normal'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Domain Health */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Domain Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDomainMetrics.map((domain) => (
                <div key={domain.domain} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getHealthIcon(domain.status)}
                    <div>
                      <div className="font-medium">{domain.domain}</div>
                      <div className="text-sm text-muted-foreground">
                        {domain.requests.toLocaleString()} requests
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{domain.errors} errors</div>
                    <Badge variant={getStatusColor(domain.status)} className="text-xs">
                      {domain.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSystemHealth.map((item) => (
                <div key={item.metric} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.metric}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.value}%</span>
                      {getHealthIcon(item.status)}
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.status === 'healthy' ? 'bg-green-500' :
                        item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
