'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'

export type DashboardActivity = {
  id: string
  type: 'registration' | 'event' | 'organization'
  title: string
  detail: string
  timestamp: string
}

type DashboardActivityFeedProps = {
  items: DashboardActivity[]
}

const badgeVariantForType = (type: DashboardActivity['type']) => {
  if (type === 'registration') return 'secondary'
  if (type === 'event') return 'outline'
  return 'default'
}

export default function DashboardActivityFeed({
  items,
}: DashboardActivityFeedProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-3">
          <Badge variant={badgeVariantForType(item.type)} className="mt-0.5">
            {item.type}
          </Badge>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{item.title}</div>
            <div className="text-xs text-muted-foreground truncate">
              {item.detail}
            </div>
          </div>
          <div className="text-xs text-muted-foreground shrink-0">
            {item.timestamp}
          </div>
        </div>
      ))}
    </div>
  )
}
