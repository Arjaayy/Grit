"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  description, 
  trend, 
  trendValue, 
  icon, 
  className = "" 
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-8 w-8 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(trend || description) && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {trend && (
              <div className="flex items-center">
                {getTrendIcon()}
                {trendValue && <span className="ml-1">{trendValue}</span>}
              </div>
            )}
            {description && <p>{description}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface DataCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function DataCard({ title, children, className = "" }: DataCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  )
}

interface StatsCardProps {
  title: string
  stats: Array<{
    label: string
    value: string | number
    icon?: React.ReactNode
  }>
  className?: string
}

export function StatsCard({ title, stats, className = "" }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {stat.icon && <div className="h-4 w-4 text-muted-foreground">{stat.icon}</div>}
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              <Badge variant="secondary">{stat.value}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
