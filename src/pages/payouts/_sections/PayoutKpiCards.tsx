import { memo, useEffect, useRef, useState } from 'react'
import { CheckCircle, RefreshCw, Clock, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { PayoutStats } from '../payouts.types'
import { PAYOUT_TONES } from '../payouts.types'

interface PayoutKpiCardsProps {
  stats: PayoutStats
  statusFilter: string
  onStatusFilter: (value: string) => void
}

/** Animated number that counts up from 0 to target on mount */
function AnimatedValue({ value, className }: { value: string; className?: string }) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (prevRef.current !== value) {
      // Brief scale flash on value change
      const el = spanRef.current
      if (el) {
        el.style.transition = 'none'
        el.style.transform = 'scale(1.08)'
        el.style.opacity = '0.6'
        requestAnimationFrame(() => {
          el.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease'
          el.style.transform = 'scale(1)'
          el.style.opacity = '1'
        })
      }
      prevRef.current = value
      setDisplay(value)
    }
  }, [value])

  return (
    <span ref={spanRef} className={className} style={{ display: 'inline-block' }}>
      {display}
    </span>
  )
}

export const PayoutKpiCards = memo(function PayoutKpiCards({
  stats,
  statusFilter,
  onStatusFilter,
}: PayoutKpiCardsProps) {
  const cards = [
    {
      label: 'Total Paid',
      value: formatCurrency(stats.paidAmount),
      sub: `${stats.paidCount} payouts`,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      ring: 'ring-emerald-500/20',
      filterValue: 'paid' as const,
      gradientBg: 'from-emerald-50/80 via-white to-emerald-50/40',
      trend: { value: 12.4, up: true },
    },
    {
      label: 'Processing',
      value: formatCurrency(stats.processingAmount),
      sub: `${stats.processingCount} payouts`,
      icon: RefreshCw,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      ring: 'ring-blue-500/20',
      filterValue: 'processing' as const,
      gradientBg: 'from-blue-50/80 via-white to-blue-50/40',
      trend: { value: 3.2, up: true },
    },
    {
      label: 'Locked (72h)',
      value: formatCurrency(stats.lockedAmount),
      sub: `${stats.lockedCount} payouts`,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      ring: 'ring-amber-500/20',
      filterValue: 'locked' as const,
      gradientBg: 'from-amber-50/80 via-white to-amber-50/40',
      trend: { value: 5.1, up: false },
    },
    {
      label: 'Failed',
      value: `${stats.failedCount} payouts`,
      sub: formatCurrency(stats.failedAmount),
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      ring: 'ring-red-500/20',
      filterValue: 'failed' as const,
      gradientBg: 'from-red-50/80 via-white to-red-50/40',
      trend: { value: 2.0, up: false },
    },
  ]

  return (
    <div className="-mx-4 sm:mx-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 sm:px-0">
        {cards.map((s, i) => {
          const Icon = s.icon
          const isActive = statusFilter === s.filterValue
          const tone = PAYOUT_TONES[s.filterValue]
          const TrendIcon = s.trend.up ? TrendingUp : TrendingDown
          return (
            <button
              key={s.label}
              onClick={() => onStatusFilter(statusFilter === s.filterValue ? '' : s.filterValue)}
              className={cn(
                'relative overflow-hidden rounded-2xl border p-4 text-left cursor-pointer transition-all duration-300 group active:scale-[0.97]',
                `bg-linear-to-br ${s.gradientBg}`,
                isActive
                  ? `ring-2 ${s.ring} shadow-lg border-transparent`
                  : 'border-slate-200/70 hover:shadow-lg hover:-translate-y-1 shadow-sm',
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={cn('absolute inset-x-0 top-0 h-0.75 bg-linear-to-r', tone.gradient)} />

              {/* Subtle decorative circle in background */}
              <div className={cn(
                'absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-125',
                s.bg,
              )} style={{ background: 'currentColor' }} />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn(
                    'h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md',
                    s.bg,
                  )}>
                    <Icon className={cn('h-5 w-5', s.color)} />
                  </div>
                  {/* Trend indicator */}
                  <div className={cn(
                    'flex items-center gap-0.5 text-[10px] font-semibold rounded-full px-1.5 py-0.5',
                    s.trend.up
                      ? 'text-emerald-700 bg-emerald-100/80'
                      : 'text-amber-700 bg-amber-100/80',
                  )}>
                    <TrendIcon className="h-2.5 w-2.5" />
                    {s.trend.value}%
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{s.label}</p>
                <AnimatedValue
                  value={s.value}
                  className={cn('text-xl font-black num-font mt-0.5 block', s.color)}
                />
                <p className="text-[11px] text-muted-foreground mt-1">{s.sub}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
})
