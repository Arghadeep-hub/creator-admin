import { memo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { getRelativeTime } from '@/lib/utils'
import type { ActivityFeedEntry } from '@/types'

const STATUS_LABEL: Record<ActivityFeedEntry['status'], string> = {
  PENDING:  'submitted to',
  APPROVED: 'got approved for',
  REJECTED: 'was rejected from',
  PAID:     'was paid out for',
}

interface ActivityFeedCardProps {
  activities: ActivityFeedEntry[]
  totalCount: number
  onNavigate: (targetUrl?: string) => void
}

export const ActivityFeedCard = memo(function ActivityFeedCard({ activities, totalCount, onNavigate }: ActivityFeedCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base">Activity Feed</CardTitle>
          <Badge variant="gray" className="text-[10px] font-semibold">{totalCount} events</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-80 sm:max-h-95 overflow-y-auto">
          {activities.map((activity, i) => (
            <button
              key={activity.submissionId}
              type="button"
              onClick={() => onNavigate(`/submissions/${activity.submissionId}`)}
              className="w-full text-left flex items-start gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 hover:bg-slate-50/60 active:bg-slate-50 transition-colors cursor-pointer relative"
            >
              {i < activities.length - 1 && (
                <div className="absolute left-6.5 sm:left-7.5 top-10 sm:top-10.5 w-px h-[calc(100%-24px)] bg-slate-100" />
              )}
              <div className="relative z-10">
                <Avatar name={activity.creator.name} size="sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] sm:text-xs leading-snug">
                  <span className="font-semibold text-foreground">{activity.creator.name}</span>{' '}
                  <span className="text-muted-foreground">{STATUS_LABEL[activity.status]}</span>{' '}
                  <span className="font-semibold text-primary">{activity.campaign.restaurantName}</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                  {getRelativeTime(activity.timestamp)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
