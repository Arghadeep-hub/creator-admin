import { memo } from 'react'
import {
  AlertTriangle, CheckCircle, Clock, Eye, RefreshCw, Send,
  ChevronRight, X,
} from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency, getRelativeTime } from '@/lib/utils'
import type { PayoutTransaction } from '@/types'
import type { PayoutStats, QueueItems } from '../payouts.types'
import { STATUS_ACCENT } from '../payouts.types'

// ─── QueueSection (private) ──────────────────────────────
function QueueSection({ icon, iconBg, title, titleColor, count, amount, badgeColor, gradient, action, children }: {
  icon: React.ReactNode; iconBg: string; title: string; titleColor: string; count: number; amount: string; badgeColor: string; gradient: string; action?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <div className={cn('absolute inset-x-0 top-0 h-0.75 bg-linear-to-r', gradient)} />
        <div className="flex items-center gap-2 p-4 pb-2 flex-wrap">
          <div className="flex items-center gap-2 flex-1">
            <div className={cn('h-7 w-7 rounded-xl flex items-center justify-center', iconBg)}>{icon}</div>
            <h3 className={cn('text-sm font-bold', titleColor)}>{title}</h3>
            <span className={cn('text-[11px] font-bold num-font px-2.5 py-0.5 rounded-full border', badgeColor)}>{count} · {amount}</span>
          </div>
          {action}
        </div>
      </div>
      <div className="px-4 pb-4 grid gap-2">{children}</div>
    </div>
  )
}

// ─── QueueCard (private) ─────────────────────────────────
interface QueueCardProps {
  txn: PayoutTransaction
  isSuperAdmin: boolean
  isSelected: boolean
  isExpanded: boolean
  onToggleSelect: () => void
  onToggleExpand: () => void
  onAction?: () => void
  onViewCreator: () => void
}

function QueueCard({ txn, isSuperAdmin, isSelected, isExpanded, onToggleSelect, onToggleExpand, onAction, onViewCreator }: QueueCardProps) {
  const isActionable = txn.status === 'processing' || txn.status === 'failed'
  return (
    <div className={cn(
      'bg-white rounded-2xl border border-slate-200/60 overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5',
      isSelected && 'ring-2 ring-primary/30 shadow-lg border-transparent',
      txn.status === 'failed' && 'bg-red-50/20',
    )}>
      <div className={cn('h-0.75 bg-linear-to-r', STATUS_ACCENT[txn.status] ?? 'from-slate-300 to-slate-400')} />
      <div className="p-4 flex items-center gap-3">
        {isSuperAdmin && isActionable && <input type="checkbox" checked={isSelected} onChange={onToggleSelect} className="rounded cursor-pointer accent-primary shrink-0 h-4 w-4" />}
        <button onClick={onToggleExpand} className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer text-left active:scale-[0.98] transition-transform">
          <Avatar name={txn.creatorName ?? 'Unknown'} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap"><p className="font-bold text-[13px]">{txn.creatorName ?? 'Unknown'}</p><StatusBadge status={txn.status} /></div>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">{txn.restaurantName ?? ''}{txn.failureReason && <span className="text-red-500 ml-1">· {txn.failureReason}</span>}</p>
          </div>
        </button>
        <div className="text-right shrink-0 mr-1"><p className="font-black num-font text-slate-900">{formatCurrency(txn.amount)}</p><p className="text-[10px] text-muted-foreground mt-0.5">{txn.upiId ?? ''}</p></div>
        <div className="shrink-0 flex items-center gap-1.5">
          {isSuperAdmin && txn.status === 'processing' && onAction && <Button size="sm" className="h-8 rounded-xl text-xs" onClick={onAction}><Send className="h-3 w-3" />Release</Button>}
          {isSuperAdmin && txn.status === 'failed' && onAction && <Button size="sm" variant="destructive" className="h-8 rounded-xl text-xs" onClick={onAction}><RefreshCw className="h-3 w-3" />Retry</Button>}
          {(txn.status === 'locked' || (!isSuperAdmin && isActionable)) && <Button size="sm" variant="ghost" className="h-8 rounded-xl text-xs text-muted-foreground" onClick={onViewCreator}>View<ChevronRight className="h-3 w-3" /></Button>}
        </div>
      </div>

      {/* Expand/collapse with grid transition */}
      <div
        className="grid transition-[grid-template-rows] duration-300"
        style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 border-t border-slate-100/80 bg-slate-50/40">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
              <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Transaction ID</p><p className="font-mono mt-1 text-[11px] bg-white border border-slate-100 px-2 py-1 rounded-lg">{txn.id.toUpperCase()}</p></div>
              {txn.submissionId && <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Submission</p><p className="font-mono mt-1 text-[11px] bg-white border border-slate-100 px-2 py-1 rounded-lg">{txn.submissionId.toUpperCase()}</p></div>}
              <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Created</p><p className="mt-1 font-medium">{getRelativeTime(txn.createdAt)}</p></div>
              {txn.status === 'locked' && txn.unlockAt && <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Unlocks</p><p className="mt-1 text-amber-600 font-semibold">{getRelativeTime(txn.unlockAt)}</p></div>}
              {txn.failureReason && <div className="col-span-2"><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Failure</p><p className="mt-1 text-red-600 font-semibold">{txn.failureReason}</p></div>}
              {txn.processedBy && <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Processed By</p><p className="mt-1 font-medium">{txn.processedBy}</p></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── QueueTab (public, memoized) ─────────────────────────
interface QueueTabProps {
  isSuperAdmin: boolean
  queueItems: QueueItems
  selectedIds: string[]
  expandedTxn: string | null
  stats: PayoutStats
  selectableQueue: PayoutTransaction[]
  allSelected: boolean
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onSetConfirmRelease: (data: { txns: PayoutTransaction[]; type: 'release' | 'retry' }) => void
  onSetExpandedTxn: (id: string | null) => void
  onNavigate: (path: string) => void
  allTransactions: PayoutTransaction[]
}

export const QueueTab = memo(function QueueTab({
  isSuperAdmin,
  queueItems,
  selectedIds,
  expandedTxn,
  stats,
  selectableQueue,
  allSelected,
  onToggleSelect,
  onToggleSelectAll,
  onSetConfirmRelease,
  onSetExpandedTxn,
  onNavigate,
  allTransactions,
}: QueueTabProps) {
  return (
    <div className="space-y-4">
      {!isSuperAdmin && (
        <div className="relative overflow-hidden bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-4 flex items-start gap-3">
          <div className="absolute inset-x-0 top-0 h-0.75 bg-linear-to-r from-blue-500 to-indigo-600" />
          <div className="h-10 w-10 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0"><Eye className="h-5 w-5 text-blue-600" /></div>
          <div>
            <p className="font-bold text-blue-900 text-sm">View-Only Access</p>
            <p className="text-blue-600/80 text-xs mt-0.5">Payment releases are handled by Super Admins.</p>
          </div>
        </div>
      )}

      {isSuperAdmin && selectedIds.length > 0 && (
        <div className="sticky top-2 z-20 rounded-2xl bg-white/90 backdrop-blur-xl p-3.5 flex items-center justify-between flex-wrap gap-2 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/60 border border-slate-200/60">
          <p className="text-sm font-bold text-foreground">{selectedIds.length} selected
            <span className="text-muted-foreground ml-1.5 font-normal num-font">({formatCurrency(allTransactions.filter(t => selectedIds.includes(t.id)).reduce((s, t) => s + t.amount, 0))})</span>
          </p>
          <div className="flex gap-2">
            <Button size="sm" className="font-bold rounded-xl"
              onClick={() => {
                const txns = allTransactions.filter(t => selectedIds.includes(t.id))
                onSetConfirmRelease({ txns, type: txns.every(t => t.status === 'failed') ? 'retry' : 'release' })
              }}>
              <Send className="h-3.5 w-3.5" />{allTransactions.filter(t => selectedIds.includes(t.id)).every(t => t.status === 'failed') ? 'Retry' : 'Release'}
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground rounded-xl" onClick={() => onToggleSelect('')}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {isSuperAdmin && selectableQueue.length > 0 && (
        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <input type="checkbox" checked={allSelected} onChange={onToggleSelectAll} className="rounded cursor-pointer accent-primary h-4 w-4" />
          Select all {selectableQueue.length} actionable payouts
        </label>
      )}

      {queueItems.failed.length > 0 && (
        <QueueSection icon={<AlertTriangle className="h-4 w-4 text-red-600" />} iconBg="bg-red-100" title="Failed — Needs Attention" titleColor="text-red-700"
          count={queueItems.failed.length} amount={formatCurrency(stats.failedAmount)} badgeColor="bg-red-50 text-red-600 border-red-100"
          gradient="from-red-500 to-rose-600"
          action={isSuperAdmin && queueItems.failed.length > 1 ? <Button size="sm" variant="destructive" className="h-7 text-xs rounded-xl" onClick={() => onSetConfirmRelease({ txns: queueItems.failed, type: 'retry' })}><RefreshCw className="h-3 w-3" />Retry All</Button> : undefined}>
          {queueItems.failed.map(txn => (
            <QueueCard key={txn.id} txn={txn} isSuperAdmin={isSuperAdmin} isSelected={selectedIds.includes(txn.id)} isExpanded={expandedTxn === txn.id}
              onToggleSelect={() => onToggleSelect(txn.id)} onToggleExpand={() => onSetExpandedTxn(expandedTxn === txn.id ? null : txn.id)}
              onAction={() => onSetConfirmRelease({ txns: [txn], type: 'retry' })} onViewCreator={() => onNavigate(`/creators/${txn.creatorId}`)} />
          ))}
        </QueueSection>
      )}

      {queueItems.processing.length > 0 && (
        <QueueSection icon={<CheckCircle className="h-4 w-4 text-blue-600" />} iconBg="bg-blue-100" title="Ready to Release" titleColor="text-blue-700"
          count={queueItems.processing.length} amount={formatCurrency(stats.processingAmount)} badgeColor="bg-blue-50 text-blue-600 border-blue-100"
          gradient="from-blue-500 to-blue-600"
          action={isSuperAdmin && queueItems.processing.length > 1 ? <Button size="sm" className="h-7 text-xs rounded-xl" onClick={() => onSetConfirmRelease({ txns: queueItems.processing, type: 'release' })}><Send className="h-3 w-3" />Release All</Button> : undefined}>
          {queueItems.processing.map(txn => (
            <QueueCard key={txn.id} txn={txn} isSuperAdmin={isSuperAdmin} isSelected={selectedIds.includes(txn.id)} isExpanded={expandedTxn === txn.id}
              onToggleSelect={() => onToggleSelect(txn.id)} onToggleExpand={() => onSetExpandedTxn(expandedTxn === txn.id ? null : txn.id)}
              onAction={() => onSetConfirmRelease({ txns: [txn], type: 'release' })} onViewCreator={() => onNavigate(`/creators/${txn.creatorId}`)} />
          ))}
        </QueueSection>
      )}

      {queueItems.locked.length > 0 && (
        <QueueSection icon={<Clock className="h-4 w-4 text-amber-600" />} iconBg="bg-amber-100" title="Locked — Unlocking Soon" titleColor="text-amber-700"
          count={queueItems.locked.length} amount={formatCurrency(stats.lockedAmount)} badgeColor="bg-amber-50 text-amber-600 border-amber-100"
          gradient="from-amber-500 to-amber-600">
          {queueItems.locked.map(txn => (
            <QueueCard key={txn.id} txn={txn} isSuperAdmin={isSuperAdmin} isSelected={false} isExpanded={expandedTxn === txn.id}
              onToggleSelect={() => {}} onToggleExpand={() => onSetExpandedTxn(expandedTxn === txn.id ? null : txn.id)}
              onViewCreator={() => onNavigate(`/creators/${txn.creatorId}`)} />
          ))}
        </QueueSection>
      )}

      {selectableQueue.length === 0 && queueItems.locked.length === 0 && <EmptyState title="All caught up!" description="No payouts need your attention right now." />}
    </div>
  )
})
