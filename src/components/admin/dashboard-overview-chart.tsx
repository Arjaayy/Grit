'use client'

import * as React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type OverviewPoint = {
  month: string
  registrations: number
  revenue: number
}

type DashboardOverviewChartProps = {
  data: OverviewPoint[]
}

export default function DashboardOverviewChart({
  data,
}: DashboardOverviewChartProps) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted) / 0.4)' }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid hsl(var(--border))',
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              fontSize: 12,
            }}
          />
          <Bar dataKey="registrations" fill="oklch(51.4% 0.222 16.935)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
