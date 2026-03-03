import { memo } from 'react'
import { cn } from '@/lib/utils'
import { TONE_STYLES } from '../dashboard.types'
import type { OperationalStat } from '../dashboard.types'

interface OperationalHealthCardProps {
  stats: OperationalStat[]
}

export const OperationalHealthCard = memo(function OperationalHealthCard({ stats }: OperationalHealthCardProps) {
  return (
    <div>
      <h2 className="text-sm font-bold text-foreground mb-3">Operational Health</h2>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
        {stats.map(stat => {
          const Icon = stat.icon
          const tone = TONE_STYLES[stat.tone]
          return (
            <div key={stat.label} className="admin-card p-3 sm:p-4 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className={cn('absolute inset-x-0 top-0 h-0.5 bg-linear-to-r', tone.gradient)} />

              <div className="flex items-start gap-2 sm:gap-3">
                <div className={cn('rounded-lg sm:rounded-xl p-2 sm:p-2.5 shrink-0', tone.bg)}>
                  <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', tone.icon)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">{stat.label}</p>
                  <p className={cn('text-base sm:text-xl font-bold num-font mt-0.5', tone.value)}>{stat.value}</p>
                </div>
              </div>

              <div className="mt-2.5 sm:mt-3">
                <div className="h-1 sm:h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-700 bg-linear-to-r', tone.gradient)}
                    style={{ width: `${Math.min(stat.numericValue, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 sm:mt-1.5 truncate">{stat.helper}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})
