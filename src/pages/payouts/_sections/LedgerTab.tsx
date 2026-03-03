import { memo } from 'react'
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

export const LedgerTab = memo(function LedgerTab({
  poolLedger,
  isSuperAdmin,
  onAddFunds,
}: LedgerTabProps) {
  return (
    <div className="space-y-4">
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
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-slate-400 to-slate-500" />
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm">Fund Activity</h3>
          <Badge variant="gray" className="text-[10px] rounded-full">{poolLedger.length} entries</Badge>
        </div>
        {poolLedger.map((entry, i) => (
          <div key={entry.id} className={cn(
            'px-5 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-all duration-200 cursor-pointer active:scale-[0.98]',
            i < poolLedger.length - 1 && 'border-b border-slate-50',
          )}>
            <div className={cn('h-11 w-11 rounded-2xl shrink-0 flex items-center justify-center', entry.type === 'deposit' ? 'bg-emerald-100' : 'bg-blue-100')}>
              {entry.type === 'deposit' ? <ArrowDownLeft className="h-5 w-5 text-emerald-600" /> : <ArrowUpRight className="h-5 w-5 text-blue-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm truncate">{entry.description}</p>
                <Badge variant={entry.type === 'deposit' ? 'success' : 'info'} className="text-[10px] shrink-0 rounded-full">{entry.type === 'deposit' ? 'Deposit' : 'Payout'}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">by {entry.performedByName} · {getRelativeTime(entry.timestamp)}</p>
            </div>
            <div className="text-right shrink-0">
              <p className={cn('font-black num-font text-base', entry.type === 'deposit' ? 'text-emerald-600' : 'text-blue-600')}>{entry.type === 'deposit' ? '+' : '\u2212'}{formatCurrency(entry.amount)}</p>
              <p className="text-[11px] text-muted-foreground num-font mt-0.5">Bal: {formatCurrency(entry.balanceAfter)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
