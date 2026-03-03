import { memo } from 'react'
import { Wallet, Plus, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency } from '@/lib/utils'
import type { PoolSummary } from '@/types'
import type { PayoutStats } from '../payouts.types'
import type { PayoutTransaction } from '@/types'

// ─── Utilization Ring (private) ──────────────────────────
function UtilizationRing({ percent, size = 52 }: { percent: number; size?: number }) {
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference
  const color = percent > 80 ? '#f87171' : percent > 50 ? '#fbbf24' : '#34d399'

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold num-font text-foreground">{percent}%</span>
      </div>
    </div>
  )
}

interface PoolBalanceHeroProps {
  pool: PoolSummary
  poolAvailable: number
  utilizationPercent: number
  stats: PayoutStats
  isSuperAdmin: boolean
  onAddFunds: () => void
  onReleaseAll: (txns: PayoutTransaction[]) => void
  processingTxns: PayoutTransaction[]
}

export const PoolBalanceHero = memo(function PoolBalanceHero({
  pool,
  poolAvailable,
  utilizationPercent,
  stats,
  isSuperAdmin,
  onAddFunds,
  onReleaseAll,
  processingTxns,
}: PoolBalanceHeroProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-100/50 shadow-sm">
      <div className="relative overflow-hidden bg-linear-to-br from-emerald-50 via-teal-50/30 to-white px-6 pt-6 pb-6">
        {/* Decorative orbs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-linear-to-bl from-emerald-200/25 to-transparent rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-linear-to-tr from-teal-200/20 to-transparent rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-linear-to-tl from-emerald-100/15 to-transparent rounded-full pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-5">
            <UtilizationRing percent={utilizationPercent} size={64} />
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-semibold uppercase tracking-widest mb-1">
                <Wallet className="h-3 w-3" /><span>Pool Balance</span>
              </div>
              <p className="text-4xl sm:text-5xl font-black num-font tracking-tight leading-none text-foreground">{formatCurrency(pool.balance)}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-600 text-sm font-semibold num-font">{formatCurrency(poolAvailable)}</span>
                <span className="text-muted-foreground text-xs">available</span>
              </div>
            </div>
          </div>

          {/* Mini stat boxes — h-scroll on mobile */}
          <div className="-mx-6 sm:mx-0">
            <div className="flex sm:grid sm:grid-cols-4 gap-2.5 overflow-x-auto scrollbar-hide px-6 sm:px-0">
              {[
                { label: 'Allocated', value: formatCurrency(pool.totalAllocated), color: 'text-amber-600', gradient: 'from-amber-500 to-amber-600' },
                { label: 'Available', value: formatCurrency(poolAvailable), color: 'text-emerald-600', gradient: 'from-emerald-500 to-emerald-600' },
                { label: 'Disbursed', value: formatCurrency(pool.totalDisbursed), color: 'text-sky-600', gradient: 'from-sky-500 to-sky-600' },
                { label: 'Deposited', value: formatCurrency(pool.totalDeposited), color: 'text-violet-600', gradient: 'from-violet-500 to-violet-600' },
              ].map(stat => (
                <div key={stat.label} className="shrink-0 w-[42%] sm:shrink sm:w-auto relative overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-3 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
                  <div className={cn('absolute inset-x-0 top-0 h-0.75 bg-linear-to-r', stat.gradient)} />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold relative">{stat.label}</p>
                  <p className={cn('text-[15px] font-bold num-font mt-1.5 relative', stat.color)}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm px-5 py-3 flex items-center justify-between flex-wrap gap-3 border-t border-emerald-100/50">
        <div className="flex items-center gap-5 text-sm flex-wrap">
          {[
            { dot: 'bg-red-500', pulse: true, label: `${stats.failedCount} failed`, value: formatCurrency(stats.failedAmount), color: 'text-red-600' },
            { dot: 'bg-blue-500', pulse: false, label: `${stats.processingCount} ready`, value: formatCurrency(stats.processingAmount), color: 'text-blue-600' },
            { dot: 'bg-amber-500', pulse: false, label: `${stats.lockedCount} locked`, value: formatCurrency(stats.lockedAmount), color: 'text-amber-600' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className={cn('h-2 w-2 rounded-full', s.dot, s.pulse && 'animate-pulse')} />
              <span className="text-muted-foreground text-xs">{s.label}</span>
              <span className={cn('font-bold num-font text-[13px]', s.color)}>{s.value}</span>
            </div>
          ))}
        </div>
        {!isSuperAdmin && <Button size="sm" className="rounded-xl" onClick={onAddFunds}><Plus className="h-3.5 w-3.5" />Add Funds</Button>}
        {isSuperAdmin && stats.processingCount > 0 && (
          <Button size="sm" className="rounded-xl shadow-sm" onClick={() => onReleaseAll(processingTxns)}>
            <Send className="h-3.5 w-3.5" />Release All ({stats.processingCount})
          </Button>
        )}
      </div>
    </div>
  )
})
