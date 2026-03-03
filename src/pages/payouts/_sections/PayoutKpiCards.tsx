import { memo } from 'react'
import { CheckCircle, RefreshCw, Clock, AlertTriangle } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { PayoutStats } from '../payouts.types'
import { PAYOUT_TONES } from '../payouts.types'

interface PayoutKpiCardsProps {
  stats: PayoutStats
  statusFilter: string
  onStatusFilter: (value: string) => void
}

export const PayoutKpiCards = memo(function PayoutKpiCards({
  stats,
  statusFilter,
  onStatusFilter,
}: PayoutKpiCardsProps) {
  const cards = [
    { label: 'Total Paid', value: formatCurrency(stats.paidAmount), sub: `${stats.paidCount} payouts`, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-500/20', filterValue: 'paid' as const },
    { label: 'Processing', value: formatCurrency(stats.processingAmount), sub: `${stats.processingCount} payouts`, icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-500/20', filterValue: 'processing' as const },
    { label: 'Locked (72h)', value: formatCurrency(stats.lockedAmount), sub: `${stats.lockedCount} payouts`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-500/20', filterValue: 'locked' as const },
    { label: 'Failed', value: `${stats.failedCount} payouts`, sub: formatCurrency(stats.failedAmount), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-500/20', filterValue: 'failed' as const },
  ]

  return (
    <div className="-mx-4 sm:mx-0">
      <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-0">
        {cards.map(s => {
          const Icon = s.icon
          const isActive = statusFilter === s.filterValue
          const tone = PAYOUT_TONES[s.filterValue]
          return (
            <button key={s.label} onClick={() => onStatusFilter(statusFilter === s.filterValue ? '' : s.filterValue)}
              className={cn(
                'shrink-0 w-[72%] sm:shrink sm:w-auto relative overflow-hidden bg-white rounded-2xl border p-4 text-left cursor-pointer transition-all duration-200 group active:scale-[0.98]',
                isActive ? `ring-2 ${s.ring} shadow-lg border-transparent` : 'border-slate-200/70 hover:shadow-md hover:-translate-y-0.5 shadow-sm'
              )}>
              <div className={cn('absolute inset-x-0 top-0 h-0.75 bg-linear-to-r', tone.gradient)} />
              <div className={cn('h-10 w-10 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110', s.bg)}>
                <Icon className={cn('h-5 w-5', s.color)} />
              </div>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{s.label}</p>
              <p className={cn('text-xl font-black num-font mt-0.5', s.color)}>{s.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{s.sub}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
})
