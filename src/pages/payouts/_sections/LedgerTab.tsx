import { memo, useMemo } from 'react'
import { ArrowUpRight, ArrowDownLeft, IndianRupee, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency, getRelativeTime } from '@/lib/utils'
import type { PoolTransaction } from '@/types'

interface LedgerTabProps {
  poolLedger: PoolTransaction[]
  isSuperAdmin: boolean
  onAddFunds: () => void
}

/** Stagger animation keyframes injected once via style tag */
const STAGGER_STYLES = `
@keyframes ledger-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.ledger-entry-animate {
  animation: ledger-fade-in 0.35s ease-out both;
}
`

export const LedgerTab = memo(function LedgerTab({
  poolLedger,
  isSuperAdmin,
  onAddFunds,
}: LedgerTabProps) {
  const totals = useMemo(() => {
    let deposits = 0
    let payouts = 0
    for (const e of poolLedger) {
      if (e.type === 'DEPOSIT') deposits += e.amount
      else payouts += e.amount
    }
    return { deposits, payouts, net: deposits - payouts }
  }, [poolLedger])

  return (
    <div className="space-y-4">
      <style>{STAGGER_STYLES}</style>

      {/* ── Summary bar ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-50/80 via-white to-emerald-50/40 border border-emerald-200/60 p-4">
          <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-emerald-500 to-emerald-600" />
          <p className="text-[11px] text-emerald-600/80 font-medium uppercase tracking-wide">Total Deposits</p>
          <p className="text-lg font-black num-font text-emerald-600 mt-1">{formatCurrency(totals.deposits)}</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-50/80 via-white to-blue-50/40 border border-blue-200/60 p-4">
          <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-blue-500 to-blue-600" />
          <p className="text-[11px] text-blue-600/80 font-medium uppercase tracking-wide">Total Payouts</p>
          <p className="text-lg font-black num-font text-blue-600 mt-1">{formatCurrency(totals.payouts)}</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-50/80 via-white to-slate-50/40 border border-slate-200/60 p-4">
          <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-slate-400 to-slate-500" />
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Net Balance</p>
          <p className={cn('text-lg font-black num-font mt-1', totals.net >= 0 ? 'text-emerald-600' : 'text-red-600')}>
            {totals.net >= 0 ? '+' : ''}{formatCurrency(totals.net)}
          </p>
        </div>
      </div>

      {!isSuperAdmin && (
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/60 p-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-emerald-500 to-emerald-600" />
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0"><IndianRupee className="h-6 w-6 text-emerald-600" /></div>
            <div><p className="font-bold text-emerald-900">Add Funds to Pool</p><p className="text-sm text-emerald-600/80 mt-0.5">Deposit money to enable creator payouts.</p></div>
          </div>
          <Button size="sm" variant="success" className="rounded-xl shadow-sm active:scale-[0.98]" onClick={onAddFunds}><Plus className="h-4 w-4" />Add Funds</Button>
        </div>
      )}

      {/* ── Ledger list ── */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-slate-400 to-slate-500" />
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm">Fund Activity</h3>
          <Badge variant="gray" className="text-[10px] rounded-full">{poolLedger.length} entries</Badge>
        </div>

        <div className="relative">
          {/* Timeline connector line (desktop only) */}
          {poolLedger.length > 1 && (
            <div className="hidden sm:block absolute left-[2.15rem] top-6 bottom-6 w-px bg-linear-to-b from-slate-200 via-slate-200 to-transparent pointer-events-none" />
          )}

          {poolLedger.map((entry, i) => {
            const isDeposit = entry.type === 'DEPOSIT'
            return (
              <div
                key={entry.id}
                className={cn(
                  'ledger-entry-animate relative px-5 py-4 flex items-center gap-4 transition-all duration-200 cursor-pointer active:scale-[0.98] group',
                  isDeposit
                    ? 'hover:bg-emerald-50/30'
                    : 'hover:bg-blue-50/30',
                  i < poolLedger.length - 1 && 'border-b border-slate-50',
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Left color accent bar */}
                <div className={cn(
                  'absolute left-0 top-3 bottom-3 w-0.75 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                  isDeposit ? 'bg-emerald-500' : 'bg-blue-500',
                )} />

                {/* Icon — acts as timeline node on desktop */}
                <div className={cn(
                  'relative z-10 h-11 w-11 rounded-2xl shrink-0 flex items-center justify-center ring-2 ring-white transition-transform duration-200 group-hover:scale-105',
                  isDeposit ? 'bg-emerald-100' : 'bg-blue-100',
                )}>
                  {isDeposit
                    ? <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                    : <ArrowUpRight className="h-5 w-5 text-blue-600" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm truncate">{entry.description}</p>
                    <Badge
                      variant={isDeposit ? 'success' : 'info'}
                      className="text-[10px] shrink-0 rounded-full"
                    >
                      {isDeposit ? 'Deposit' : 'Payout'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    by {entry.performedByName} · {getRelativeTime(entry.createdAt)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className={cn(
                    'font-black num-font text-base',
                    isDeposit ? 'text-emerald-600' : 'text-blue-600',
                  )}>
                    {isDeposit ? '+' : '\u2212'}{formatCurrency(entry.amount)}
                  </p>
                  <p className="text-[11px] text-muted-foreground num-font mt-0.5">
                    Bal: {formatCurrency(entry.balanceAfter)}
                  </p>
                </div>
              </div>
            )
          })}

          {poolLedger.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">
              No fund activity yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
