import { DashboardLayout } from "@/components/dashboard/layout"
import { DashboardLineChart, DashboardBarChart } from "@/components/dashboard/charts"
import { DataTable as DashboardDataTable } from "@/components/dashboard/tables"
import { MetricCard, StatsCard, DataCard } from "@/components/dashboard/cards"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"

import data from "./data.json"

export default function Page() {
  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <ThemeToggle />
        </div>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Revenue"
            value="$45,231"
            trend="up"
            trendValue="+12.5%"
          />
          <MetricCard
            title="Active Users"
            value="1,234"
            trend="up"
            trendValue="+8.2%"
          />
          <StatsCard
            title="Conversion Rate"
            stats={[
              { label: "Rate", value: "3.2%" }
            ]}
          />
          <DataCard title="Recent Activity">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Page Views</span>
                <span className="font-semibold">2,341</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sessions</span>
                <span className="font-semibold">1,123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bounce Rate</span>
                <span className="font-semibold">42%</span>
              </div>
            </div>
          </DataCard>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DashboardLineChart
            title="Revenue Trend"
            data={[
              { name: "Jan", value: 4000 },
              { name: "Feb", value: 3000 },
              { name: "Mar", value: 5000 },
              { name: "Apr", value: 4500 },
              { name: "May", value: 6000 }
            ]}
            lines={[
              { name: "Revenue", color: "#8884d8" }
            ]}
          />
          <DashboardBarChart
            title="Monthly Performance"
            data={[
              { name: "Product A", value: 4000 },
              { name: "Product B", value: 3000 },
              { name: "Product C", value: 2000 },
              { name: "Product D", value: 2780 }
            ]}
            dataKey="value"
          />
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <DashboardDataTable
            data={data}
            columns={[
              { key: "id", title: "ID", sortable: true },
              { key: "name", title: "Name", sortable: true },
              { key: "amount", title: "Amount", sortable: true },
              { key: "date", title: "Date", sortable: true }
            ]}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
