import { memo } from 'react'
import { Banknote, Send, Clock } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { PERIOD_OPTIONS, TONE_STYLES } from '../dashboard.types'
import type { DashboardPeriod } from '../dashboard.types'

interface HeroBannerProps {
  greeting: string
  todayLabel: string
  periodConfig: { value: DashboardPeriod; label: string; hint: string }
  period: DashboardPeriod
  onPeriodChange: (period: DashboardPeriod) => void
  pendingSubmissions: number
  criticalAlerts: number
  poolBalance: number
  releaseQueueCount: number
  overdueReviews: number
}

export const HeroBanner = memo(function HeroBanner({
  greeting,
  todayLabel,
  periodConfig,
  period,
  onPeriodChange,
  pendingSubmissions,
  criticalAlerts,
  poolBalance,
  releaseQueueCount,
  overdueReviews,
}: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-orange-50 via-amber-50/30 to-white border border-orange-100/50 p-4 sm:p-6 lg:p-8">
      {/* Decorative background orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-linear-to-bl from-orange-200/25 to-transparent rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-linear-to-tr from-amber-200/20 to-transparent rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-linear-to-tl from-orange-100/15 to-transparent rounded-full pointer-events-none" />

      <div className="relative">
        {/* Top: Greeting + Period Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold font-display text-foreground tracking-tight">
              {greeting}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {todayLabel}
              <span className="mx-1.5 text-slate-300">·</span>
              <span className="font-medium text-foreground/70">{periodConfig.hint}</span>
            </p>
          </div>

          {/* Period toggle */}
          <div className="inline-flex items-center self-start rounded-xl bg-white/70 backdrop-blur-sm border border-orange-100/60 p-1 shadow-sm">
            {PERIOD_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => onPeriodChange(option.value)}
                className={cn(
                  'rounded-lg px-3 sm:px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer',
                  period === option.value
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/80'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live status badges — horizontal scroll on mobile */}
        <div className="-mx-4 sm:mx-0 mt-4 sm:mt-5">
          <div className="flex sm:flex-wrap gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-0 pb-1 sm:pb-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 px-3 sm:px-3.5 py-1.5 shadow-sm shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-foreground whitespace-nowrap">{pendingSubmissions} pending reviews</span>
            </div>

            {criticalAlerts > 0 && (
              <div className={cn(
                'inline-flex items-center gap-2 rounded-full px-3 sm:px-3.5 py-1.5 shadow-sm shrink-0',
                TONE_STYLES.critical.bg, 'backdrop-blur-sm border border-red-200/60'
              )}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className={cn('text-[11px] sm:text-xs font-medium whitespace-nowrap', TONE_STYLES.critical.value)}>{criticalAlerts} critical alerts</span>
              </div>
            )}

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/90 backdrop-blur-sm border border-slate-700/60 px-3 sm:px-3.5 py-1.5 shadow-sm shrink-0">
              <Banknote className="h-3 w-3 text-emerald-400" />
              <span className="text-[11px] sm:text-xs font-medium text-white whitespace-nowrap">Pool: {formatCurrency(poolBalance)}</span>
            </div>

            {releaseQueueCount > 0 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-50/80 backdrop-blur-sm border border-purple-200/60 px-3 sm:px-3.5 py-1.5 shadow-sm shrink-0">
                <Send className="h-3 w-3 text-purple-500" />
                <span className="text-[11px] sm:text-xs font-medium text-purple-700 whitespace-nowrap">{releaseQueueCount} in release queue</span>
              </div>
            )}

            {overdueReviews > 0 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 px-3 sm:px-3.5 py-1.5 shadow-sm shrink-0">
                <Clock className="h-3 w-3 text-orange-500" />
                <span className="text-[11px] sm:text-xs font-medium text-foreground whitespace-nowrap">{overdueReviews} overdue 48h+</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
