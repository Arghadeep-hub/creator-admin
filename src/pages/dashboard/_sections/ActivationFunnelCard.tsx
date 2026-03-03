import { memo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn, formatNumber } from '@/lib/utils'

interface FunnelStep {
  step: string
  count: number
  percent: number
}

interface ActivationFunnelCardProps {
  data: FunnelStep[]
  activationRate: number
}

export const ActivationFunnelCard = memo(function ActivationFunnelCard({ data, activationRate }: ActivationFunnelCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm sm:text-base">Activation Funnel</CardTitle>
          <Badge variant={activationRate >= 45 ? 'success' : 'warning'} className="text-xs font-semibold">
            {activationRate.toFixed(1)}% activated
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 sm:space-y-3 px-4 sm:px-6">
        {data.map((step, i) => {
          const isFirst = i === 0
          const isLast = i === data.length - 1
          return (
            <div key={step.step}>
              <div className="flex items-center justify-between text-[11px] sm:text-xs mb-1 sm:mb-1.5">
                <span className={cn('truncate pr-2', isFirst || isLast ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                  {step.step}
                </span>
                <span className="font-bold num-font text-foreground shrink-0">
                  {formatNumber(step.count)}
                  <span className="text-muted-foreground font-normal ml-1 text-[10px] sm:text-[11px]">({step.percent}%)</span>
                </span>
              </div>
              <div className="h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${step.percent}%`,
                    background: isFirst
                      ? 'linear-gradient(90deg, #f97316, #fb923c)'
                      : isLast
                        ? 'linear-gradient(90deg, #10b981, #34d399)'
                        : `linear-gradient(90deg, hsl(${25 + i * 12}, 75%, ${50 + i * 3}%), hsl(${25 + i * 12}, 70%, ${55 + i * 3}%))`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
})
