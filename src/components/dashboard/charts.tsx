"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ChartContainer, 
  ChartTooltip,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
} from "recharts"

interface ChartData {
  name: string
  value: number
}

interface LineChartProps {
  data: Array<Record<string, string | number>>
  title: string
  lines: Array<{
    name: string
    color: string
  }>
  className?: string
}

export function DashboardLineChart({ 
  data, 
  title, 
  lines, 
  className = "" 
}: LineChartProps) {
  const chartConfig = lines.reduce((acc, line, index) => {
    const key = `line${index}`
    acc[key] = {
      label: line.name,
      color: line.color,
    }
    return acc
  }, {} as Record<string, { label: string; color: string }>)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div
                    className="rounded-lg border px-3 py-2 text-sm shadow-md"
                    style={{
                      backgroundColor: 'oklch(21% 0.034 264.665)',
                      borderColor: 'oklch(37.2% 0.044 257.287)',
                    }}
                  >
                    <p className="font-medium mb-1" style={{ color: 'white' }}>
                      {label}
                    </p>
                    {payload.map((entry, index) => (
                      <div key={index} className="flex flex-col">
                        <span style={{ color: entry.color }}>
                          {entry.name || 'Value'}: {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {lines.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={Object.keys(line)[0]}
                stroke={line.color}
                strokeWidth={2}
                name={line.name}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

interface BarChartProps {
  data: Array<Record<string, string | number>>
  title: string
  dataKey: string
  color?: string
  className?: string
}

export function DashboardBarChart({ 
  data, 
  title, 
  dataKey, 
  color = "#8884d8",
  className = "" 
}: BarChartProps) {
  const chartConfig = {
    [dataKey]: {
      label: dataKey,
      color: color,
    },
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div
                    className="rounded-lg border px-3 py-2 text-sm shadow-md"
                    style={{
                      backgroundColor: 'oklch(21% 0.034 264.665)',
                      borderColor: 'oklch(37.2% 0.044 257.287)',
                    }}
                  >
                    <p className="font-medium mb-1" style={{ color: 'white' }}>
                      {label}
                    </p>
                    {payload.map((entry, index) => (
                      <div key={index} className="flex flex-col">
                        <span style={{ color: entry.color }}>
                          {entry.name || 'Value'}: {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
            <Bar 
              dataKey={dataKey} 
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

interface PieChartProps {
  data: ChartData[]
  title: string
  className?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function DashboardPieChart({ data, title, className = "" }: PieChartProps) {
  const chartConfig = data.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: COLORS[index % COLORS.length],
    }
    return acc
  }, {} as Record<string, { label: string; color: string }>)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div
                      className="rounded-lg border px-3 py-2 text-sm shadow-md"
                      style={{
                        backgroundColor: 'oklch(21% 0.034 264.665)',
                        borderColor: 'oklch(37.2% 0.044 257.287)',
                      }}
                    >
                      <p className="font-medium mb-1" style={{ color: 'white' }}>
                        {label}
                      </p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex flex-col">
                          <span style={{ color: entry.color }}>
                            {entry.name || 'Value'}: {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
