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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { Badge } from '@repo/ui'
import { Button } from '@repo/ui'
import { Download, ChartLine, Globe, Users } from '@phosphor-icons/react'
import AdminPageHeader from '@/components/admin/admin-page-header'

// Mock data for cross-site registration analytics
const mockRegistrationData = [
  { month: 'Jan', internal: 120, external: 45, total: 165 },
  { month: 'Feb', internal: 180, external: 72, total: 252 },
  { month: 'Mar', internal: 260, external: 115, total: 375 },
  { month: 'Apr', internal: 220, external: 98, total: 318 },
  { month: 'May', internal: 310, external: 142, total: 452 },
  { month: 'Jun', internal: 280, external: 125, total: 405 },
]

const mockDomainData = [
  { domain: 'tuguegaraoleague.gritdp.com', registrations: 145, percentage: 35 },
  { domain: 'spupathletics.gritdp.com', registrations: 98, percentage: 24 },
  { domain: 'cagayanbasketball.gritdp.com', registrations: 76, percentage: 18 },
  { domain: 'direct.admin', registrations: 95, percentage: 23 },
]

const mockSourceTrends = [
  { date: '2026-01-01', external: 12, internal: 45 },
  { date: '2026-01-15', external: 18, internal: 52 },
  { date: '2026-02-01', external: 25, internal: 68 },
  { date: '2026-02-15', external: 32, internal: 75 },
  { date: '2026-03-01', external: 45, internal: 92 },
  { date: '2026-03-15', external: 58, internal: 88 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function CrossSiteAnalytics() {
  const [timeRange, setTimeRange] = useState('6m')
  const [metricType, setMetricType] = useState('registrations')

  // Calculate totals
  const totalExternal = mockRegistrationData.reduce((sum, item) => sum + item.external, 0)
  const totalInternal = mockRegistrationData.reduce((sum, item) => sum + item.internal, 0)
  const totalRegistrations = totalExternal + totalInternal
  const externalPercentage = ((totalExternal / totalRegistrations) * 100).toFixed(1)

  // Source distribution pie data
  const sourceDistribution = [
    { name: 'External Sites', value: totalExternal, color: '#0088FE' },
    { name: 'Internal Admin', value: totalInternal, color: '#00C49F' },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title="Cross-Site Registration Analytics"
        description="Track registrations from external client sites vs internal admin"
        actions={
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last month</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">External Registrations</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExternal}</div>
            <p className="text-xs text-muted-foreground">
              {externalPercentage}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <ChartLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+28%</div>
            <p className="text-xs text-muted-foreground">
              External site growth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Domains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDomainData.length}</div>
            <p className="text-xs text-muted-foreground">
              Client sites live
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Registration Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Registration Trends by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockRegistrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="internal" fill="#00C49F" name="Internal Admin" />
                <Bar dataKey="external" fill="#0088FE" name="External Sites" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Source Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Registration Source Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Domain Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Domains</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDomainData.map((domain, index) => (
              <div key={domain.domain} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div>
                    <div className="font-medium">{domain.domain}</div>
                    <div className="text-sm text-muted-foreground">{domain.registrations} registrations</div>
                  </div>
                </div>
                <Badge variant="secondary">{domain.percentage}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Trend */}
      <Card>
        <CardHeader>
          <CardTitle>External Registration Growth Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockSourceTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="external" stroke="#0088FE" name="External" strokeWidth={2} />
              <Line type="monotone" dataKey="internal" stroke="#00C49F" name="Internal" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
