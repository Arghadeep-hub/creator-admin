import { memo } from 'react'
import { Badge } from '@/components/ui/badge'
import { ChartCard } from '../reports.types'
import type { FraudReport } from '@/store/api/reportsApi'

const TYPE_COLORS: Record<string, string> = {
  'location_spoof': '#ef4444',
  'duplicate_content': '#f97316',
  'engagement_fraud': '#f59e0b',
  'fake_metrics': '#8b5cf6',
}

interface Props {
  fraudReport: FraudReport | null
}

export const FraudBreakdownCard = memo(function FraudBreakdownCard({ fraudReport }: Props) {
  const breakdown = fraudReport?.byType ?? []
  const fraudMax = breakdown.length > 0 ? Math.max(...breakdown.map(f => f.count)) : 1
  const totalCases = breakdown.reduce((s, f) => s + f.count, 0)

  return (
    <ChartCard title="Fraud Type Breakdown" subtitle="Cases by detection category">
      <div className="space-y-4 pt-1">
        {breakdown.map(item => {
          const pctOfTotal = totalCases > 0 ? Math.round((item.count / totalCases) * 100) : 0
          const color = TYPE_COLORS[item.type] ?? '#94a3b8'
          return (
            <div key={item.type}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm font-semibold">{item.type.replace(/_/g, ' ')}</span>
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
                  style={{ width: `${(item.count / fraudMax) * 100}%`, backgroundColor: color }}
                />
              </div>
            </div>
          )
        })}
        {breakdown.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No fraud data available</p>
        )}
      </div>
    </ChartCard>
  )
})
