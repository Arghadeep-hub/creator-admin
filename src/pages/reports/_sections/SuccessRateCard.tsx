import { memo, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { SUCCESS_RATE_BY_CATEGORY } from '@/data/chart-data'
import { ChartCard } from '../reports.types'

export const SuccessRateCard = memo(function SuccessRateCard() {
  const lowestRate = useMemo(
    () => Math.min(...SUCCESS_RATE_BY_CATEGORY.map(r => r.successRate)),
    []
  )

  return (
    <ChartCard title="Success Rate by Category" subtitle="Campaign performance across content categories">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-1">
        {SUCCESS_RATE_BY_CATEGORY.map(row => {
          const isWorst = row.successRate === lowestRate
          return (
            <div
              key={row.category}
              className={cn(
                isWorst && 'border-l-3 border-red-400 pl-3'
              )}
            >
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{row.category}</span>
                  {isWorst && (
                    <Badge variant="error" className="text-[10px] rounded-full">
                      Needs attention
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{row.count} campaigns</span>
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
      </div>
    </ChartCard>
  )
})
