import { memo } from 'react'
import { Badge } from '@/components/ui/badge'
import { ChartCard } from '../reports.types'
import { FRAUD_TYPE_BREAKDOWN } from '@/data/chart-data'

export const FraudBreakdownCard = memo(function FraudBreakdownCard() {
  const fraudMax = Math.max(...FRAUD_TYPE_BREAKDOWN.map(f => f.count))
  const totalCases = FRAUD_TYPE_BREAKDOWN.reduce((s, f) => s + f.count, 0)

  return (
    <ChartCard title="Fraud Type Breakdown" subtitle="Cases by detection category">
      <div className="space-y-4 pt-1">
        {FRAUD_TYPE_BREAKDOWN.map(item => {
          const pctOfTotal = Math.round((item.count / totalCases) * 100)
          return (
            <div key={item.type}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-semibold">{item.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{item.count} cases</span>
                  <Badge variant="gray" className="text-[10px] rounded-full num-font">
                    {pctOfTotal}%
                  </Badge>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(item.count / fraudMax) * 100}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </ChartCard>
  )
})
