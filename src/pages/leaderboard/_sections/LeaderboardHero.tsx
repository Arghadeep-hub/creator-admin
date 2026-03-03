import { memo } from 'react'
import { Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Select } from '@/components/ui/select'

interface LeaderboardHeroProps {
  totalEntries: number
  topEarner: { name: string; earnings: number } | null
  weekLabel: string
  weekIdx: string
  onWeekChange: (idx: string) => void
  weekOptions: Array<{ value: string; label: string }>
}

export const LeaderboardHero = memo(function LeaderboardHero({
  totalEntries,
  topEarner,
  weekLabel,
  weekIdx,
  onWeekChange,
  weekOptions,
}: LeaderboardHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-amber-50 via-orange-50/30 to-white border border-amber-100/50 p-4 sm:p-6 lg:p-8">
      {/* Decorative background orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-linear-to-bl from-amber-200/25 to-transparent rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-linear-to-tr from-orange-200/20 to-transparent rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-linear-to-tl from-amber-100/15 to-transparent rounded-full pointer-events-none" />

      <div className="relative">
        {/* Top: Title + Week Selector */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold font-display text-foreground tracking-tight">
              Leaderboard
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Weekly creator rankings &amp; rewards
              <span className="mx-1.5 text-slate-300">·</span>
              <span className="font-medium text-foreground/70">{weekLabel}</span>
            </p>
          </div>

          <Select
            value={weekIdx}
            onValueChange={onWeekChange}
            options={weekOptions}
            className="w-56 rounded-xl self-start"
          />
        </div>

        {/* Live status pills -- horizontal scroll on mobile */}
        <div className="-mx-4 sm:mx-0 mt-4 sm:mt-5">
          <div className="flex sm:flex-wrap gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-0 pb-1 sm:pb-0">
            {/* Ranked count */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 px-3 sm:px-3.5 py-1.5 shadow-sm shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-foreground whitespace-nowrap">
                {totalEntries} ranked
              </span>
            </div>

            {/* Top earner */}
            {topEarner && (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 backdrop-blur-sm border border-amber-200/60 px-3 sm:px-3.5 py-1.5 shadow-sm shrink-0">
                <span className="text-[11px] sm:text-xs font-semibold text-amber-700 whitespace-nowrap">
                  Top: {formatCurrency(topEarner.earnings)}
                </span>
              </div>
            )}

            {/* Reset info */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 px-3 sm:px-3.5 py-1.5 shadow-sm shrink-0">
              <Clock className="h-3 w-3 text-slate-500" />
              <span className="text-[11px] sm:text-xs font-medium text-foreground whitespace-nowrap">
                Resets Monday 00:00
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
