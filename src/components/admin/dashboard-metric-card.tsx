'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type DashboardMetricCardProps = {
  title: string
  value: React.ReactNode
  icon?: React.ReactNode
  footer?: React.ReactNode
}

export default function DashboardMetricCard({
  title,
  value,
  icon,
  footer,
}: DashboardMetricCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium leading-tight">{title}</CardTitle>
        {icon ? <div className="text-muted-foreground shrink-0">{icon}</div> : null}
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-2xl font-bold wrap-break-word">{value}</div>
        {footer ? (
          <div className="text-xs text-muted-foreground mt-1 leading-tight">{footer}</div>
        ) : null}
      </CardContent>
    </Card>
  )
}
