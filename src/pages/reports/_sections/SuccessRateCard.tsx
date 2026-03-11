import { memo, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ChartCard } from '../reports.types'
import type { SubmissionsReport } from '@/store/api/reportsApi'

interface Props {
  submissionsReport: SubmissionsReport | null
}

export const SuccessRateCard = memo(function SuccessRateCard({ submissionsReport }: Props) {
  const data = useMemo(() => {
    if (!submissionsReport?.byCampaign) return []
    return submissionsReport.byCampaign.map(c => ({
      category: c.campaignName,
      count: c.submissions,
      successRate: c.submissions > 0 ? Math.round((c.approved / c.submissions) * 100) : 0,
    }))
  }, [submissionsReport])

  const lowestRate = useMemo(
    () => data.length > 0 ? Math.min(...data.map(r => r.successRate)) : 0,
    [data]
  )

  return (
    <ChartCard title="Success Rate by Campaign" subtitle="Campaign performance breakdown">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-1">
        {data.map(row => {
          const isWorst = data.length > 1 && row.successRate === lowestRate
          return (
            <div
              key={row.category}
              className={cn(
                isWorst && 'border-l-3 border-red-400 pl-3'
              )}
            >
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold truncate max-w-32">{row.category}</span>
                  {isWorst && (
                    <Badge variant="error" className="text-[10px] rounded-full shrink-0">
                      Needs attention
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{row.count} subs</span>
                  <span className={cn(
                    'text-xs font-bold num-font px-2 py-0.5 rounded-full',
                    row.successRate >= 75 ? 'bg-emerald-50 text-emerald-700' : row.successRate >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                  )}>{row.successRate}%</span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-700',
                    row.successRate >= 75 ? 'bg-emerald-500' : row.successRate >= 60 ? 'bg-amber-500' : 'bg-red-500'
                  )}
                  style={{ width: `${row.successRate}%` }}
                />
              </div>
            </div>
          )
        })}
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-2 text-center py-4">No campaign data available</p>
        )}
      </div>
    </ChartCard>
  )
})
