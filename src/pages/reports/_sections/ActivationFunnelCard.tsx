import { memo } from 'react'
import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChartCard } from '../reports.types'
import type { CreatorsReport } from '@/store/api/reportsApi'

interface Props {
  creatorsReport: CreatorsReport | null
}

export const ActivationFunnelCard = memo(function ActivationFunnelCard({ creatorsReport }: Props) {
  const total = creatorsReport?.totalCreators ?? 0

  // Build a funnel from available creator data
  const funnelData = total > 0
    ? [
        { step: 'Registered', count: total, percent: 100 },
        { step: 'KYC Verified', count: creatorsReport?.kycVerified ?? 0, percent: total > 0 ? Math.round(((creatorsReport?.kycVerified ?? 0) / total) * 100) : 0 },
        { step: 'Active', count: creatorsReport?.activeCreators ?? 0, percent: total > 0 ? Math.round(((creatorsReport?.activeCreators ?? 0) / total) * 100) : 0 },
      ]
    : []

  const dropoffs = funnelData.slice(0, -1).map((s, j) => s.count - funnelData[j + 1].count)
  const maxDropoff = dropoffs.length > 0 ? Math.max(...dropoffs) : 0

  return (
    <ChartCard title="Creator Activation Funnel" subtitle="Drop-off analysis at each onboarding step">
      <div className="space-y-4 pt-1">
        {funnelData.map((step, i) => {
          const dropoff = i < funnelData.length - 1
            ? step.count - funnelData[i + 1].count
            : 0
          const dropoffPct = i < funnelData.length - 1 && step.count > 0
            ? ((dropoff / step.count) * 100).toFixed(1)
            : '0'
          const isWorstDropoff = i < funnelData.length - 1 && dropoff === maxDropoff && maxDropoff > 0

          const funnelColor = `hsl(${25 + i * 12}, 80%, ${45 + i * 3}%)`

          return (
            <div key={step.step} className="flex items-center gap-4">
              <div
                className="h-9 w-9 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 text-white"
                style={{ backgroundColor: funnelColor }}
              >
                {i + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="font-semibold text-sm truncate">{step.step}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold num-font text-sm">{step.count.toLocaleString()}</span>
                    <span className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-full num-font',
                      step.percent >= 70 ? 'bg-emerald-50 text-emerald-700' : step.percent >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    )}>{step.percent}%</span>
                  </div>
                </div>

                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${step.percent}%`, backgroundColor: funnelColor }}
                  />
                </div>

                {i < funnelData.length - 1 && (
                  <div className={cn(
                    'flex items-center gap-1 mt-1 text-xs',
                    isWorstDropoff ? 'text-red-600' : 'text-rose-400'
                  )}>
                    {isWorstDropoff && <Flame className="h-3 w-3" />}
                    <span className="font-medium">
                      −{dropoff.toLocaleString()} drop-off ({dropoffPct}%)
                      {isWorstDropoff && ' — Biggest bottleneck'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {funnelData.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No funnel data available</p>
        )}
      </div>
    </ChartCard>
  )
})
