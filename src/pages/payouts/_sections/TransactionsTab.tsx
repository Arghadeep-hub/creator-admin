import { memo } from 'react'
import {
  Search, RefreshCw, Send, ChevronRight, X,
} from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { cn, formatCurrency, getRelativeTime } from '@/lib/utils'
import type { PayoutTransaction } from '@/types'
import { STATUS_OPTIONS, STATUS_ACCENT } from '../payouts.types'

interface TransactionsTabProps {
  filtered: PayoutTransaction[]
  totalCount: number
  search: string
  statusFilter: string
  hasActiveFilters: boolean
  isSuperAdmin: boolean
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onClearFilters: () => void
  onSetConfirmRelease: (data: { txns: PayoutTransaction[]; type: 'release' | 'retry' }) => void
  onNavigate: (path: string) => void
}

export const TransactionsTab = memo(function TransactionsTab({
  filtered,
  totalCount,
  search,
  statusFilter,
  hasActiveFilters,
  isSuperAdmin,
  onSearchChange,
  onStatusFilterChange,
  onClearFilters,
  onSetConfirmRelease,
  onNavigate,
}: TransactionsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
          <Input placeholder="Search creator, campaign, ID..." value={search} onChange={e => onSearchChange(e.target.value)} className="pl-10 rounded-xl bg-white/80 backdrop-blur-sm border-slate-200/60 focus:bg-white h-10" />
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange} options={STATUS_OPTIONS} className="w-40" />
        {hasActiveFilters && <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground rounded-xl"><X className="h-3.5 w-3.5" />Clear</Button>}
      </div>

      <p className="text-xs text-muted-foreground">Showing <span className="font-bold text-foreground">{filtered.length}</span> of {totalCount}</p>

      {filtered.length === 0 ? (
        <EmptyState title="No transactions found" description="Try adjusting your search or filters." actionLabel="Clear Filters" onAction={onClearFilters} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block rounded-2xl border border-slate-200/70 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50/60">
                  {['Transaction', 'Creator', 'Amount', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filtered.map(txn => (
                    <tr key={txn.id} className={cn('border-t border-slate-100/80 transition-colors duration-150 hover:bg-slate-50/50 even:bg-slate-50/30', txn.status === 'failed' && 'bg-red-50/30 hover:bg-red-50/50')}>
                      <td className="py-3.5 px-4">
                        <code className="text-[10px] text-muted-foreground bg-slate-100 px-1.5 py-0.5 rounded-md">{txn.id.toUpperCase()}</code>
                        <p className="text-[11px] text-muted-foreground mt-1 truncate max-w-40">{txn.campaignName}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5"><Avatar name={txn.creatorName} size="sm" /><div><p className="font-semibold text-[13px] leading-tight">{txn.creatorName}</p><p className="text-[11px] text-muted-foreground mt-0.5">{txn.upiId}</p></div></div>
                      </td>
                      <td className="py-3.5 px-4"><p className="font-black num-font text-slate-900">{formatCurrency(txn.amount)}</p></td>
                      <td className="py-3.5 px-4"><StatusBadge status={txn.status} /></td>
                      <td className="py-3.5 px-4">
                        <p className="text-xs text-muted-foreground">{getRelativeTime(txn.createdAt)}</p>
                        {txn.status === 'locked' && txn.unlockAt && <p className="text-[11px] text-amber-600 mt-0.5 font-medium">Unlocks {getRelativeTime(txn.unlockAt)}</p>}
                        {txn.failureReason && <p className="text-[11px] text-red-500 mt-0.5">{txn.failureReason}</p>}
                      </td>
                      <td className="py-3.5 px-4">
                        {isSuperAdmin && txn.status === 'processing' && <Button size="sm" className="h-8 rounded-xl text-xs" onClick={() => onSetConfirmRelease({ txns: [txn], type: 'release' })}><Send className="h-3 w-3" />Release</Button>}
                        {isSuperAdmin && txn.status === 'failed' && <Button size="sm" variant="outline" className="h-8 rounded-xl text-xs border-red-200 text-red-600 hover:bg-red-50" onClick={() => onSetConfirmRelease({ txns: [txn], type: 'retry' })}><RefreshCw className="h-3 w-3" />Retry</Button>}
                        {(!isSuperAdmin || txn.status === 'paid' || txn.status === 'locked') && <Button size="sm" variant="ghost" className="h-8 rounded-xl text-xs text-muted-foreground" onClick={() => onNavigate(`/creators/${txn.creatorId}`)}>View<ChevronRight className="h-3 w-3" /></Button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden space-y-2.5">
            {filtered.map(txn => (
              <div key={txn.id} className={cn(
                'relative overflow-hidden bg-white rounded-2xl border border-slate-200/70 p-4 shadow-sm transition-all duration-200 active:scale-[0.98] hover:shadow-md hover:-translate-y-0.5',
                txn.status === 'failed' && 'bg-red-50/20 border-red-200/40',
              )}>
                <div className={cn('absolute inset-x-0 top-0 h-0.75 bg-linear-to-r', STATUS_ACCENT[txn.status] ?? 'from-slate-300 to-slate-400')} />
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={txn.creatorName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[13px] leading-tight truncate">{txn.creatorName}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{txn.upiId}</p>
                  </div>
                  <StatusBadge status={txn.status} />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-black num-font text-lg text-slate-900">{formatCurrency(txn.amount)}</p>
                  <p className="text-[11px] text-muted-foreground">{getRelativeTime(txn.createdAt)}</p>
                </div>
                <p className="text-[11px] text-muted-foreground truncate mb-3">{txn.campaignName}</p>
                {txn.failureReason && <p className="text-[11px] text-red-500 mb-3">{txn.failureReason}</p>}
                {txn.status === 'locked' && txn.unlockAt && <p className="text-[11px] text-amber-600 font-medium mb-3">Unlocks {getRelativeTime(txn.unlockAt)}</p>}
                <div className="flex justify-end">
                  {isSuperAdmin && txn.status === 'processing' && <Button size="sm" className="h-9 rounded-xl text-xs" onClick={() => onSetConfirmRelease({ txns: [txn], type: 'release' })}><Send className="h-3 w-3" />Release</Button>}
                  {isSuperAdmin && txn.status === 'failed' && <Button size="sm" variant="outline" className="h-9 rounded-xl text-xs border-red-200 text-red-600 hover:bg-red-50" onClick={() => onSetConfirmRelease({ txns: [txn], type: 'retry' })}><RefreshCw className="h-3 w-3" />Retry</Button>}
                  {(!isSuperAdmin || txn.status === 'paid' || txn.status === 'locked') && <Button size="sm" variant="ghost" className="h-9 rounded-xl text-xs text-muted-foreground" onClick={() => onNavigate(`/creators/${txn.creatorId}`)}>View<ChevronRight className="h-3 w-3" /></Button>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
})
