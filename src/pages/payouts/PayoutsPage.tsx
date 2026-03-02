import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, RefreshCw, Download, AlertTriangle, Wallet, Clock, CheckCircle,
  Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, Eye, ChevronRight,
  Banknote, TrendingUp, Lock, Send, IndianRupee, X,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { cn, formatCurrency, getRelativeTime } from '@/lib/utils'
import { MOCK_TRANSACTIONS, MOCK_POOL, MOCK_POOL_TRANSACTIONS } from '@/data/transactions'
import type { PayoutTransaction } from '@/types'

// ─── Constants ──────────────────────────────────────────
type PayoutTab = 'queue' | 'transactions' | 'ledger'

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'locked', label: 'Locked' },
  { value: 'processing', label: 'Processing' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
]

// ─── Component ──────────────────────────────────────────
export function PayoutsPage() {
  const { session } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()
  const isSuperAdmin = session?.role === 'super_admin'

  // ── State ───────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<PayoutTab>(isSuperAdmin ? 'queue' : 'transactions')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Dialogs
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [fundAmount, setFundAmount] = useState('')
  const [fundDescription, setFundDescription] = useState('')
  const [confirmRelease, setConfirmRelease] = useState<{ txns: PayoutTransaction[]; type: 'release' | 'retry' } | null>(null)
  const [expandedTxn, setExpandedTxn] = useState<string | null>(null)

  // ── Computed ────────────────────────────────────────
  const pool = MOCK_POOL
  const poolAvailable = pool.balance - pool.totalAllocated

  const stats = useMemo(() => {
    const locked = MOCK_TRANSACTIONS.filter(t => t.status === 'locked')
    const processing = MOCK_TRANSACTIONS.filter(t => t.status === 'processing')
    const paid = MOCK_TRANSACTIONS.filter(t => t.status === 'paid')
    const failed = MOCK_TRANSACTIONS.filter(t => t.status === 'failed')
    return {
      lockedCount: locked.length,
      lockedAmount: locked.reduce((s, t) => s + t.amount, 0),
      processingCount: processing.length,
      processingAmount: processing.reduce((s, t) => s + t.amount, 0),
      paidCount: paid.length,
      paidAmount: paid.reduce((s, t) => s + t.amount, 0),
      failedCount: failed.length,
      failedAmount: failed.reduce((s, t) => s + t.amount, 0),
    }
  }, [])

  // Queue items: failed first, then processing, then locked (sorted by urgency)
  const queueItems = useMemo(() => {
    const failed = MOCK_TRANSACTIONS.filter(t => t.status === 'failed')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const processing = MOCK_TRANSACTIONS.filter(t => t.status === 'processing')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const locked = MOCK_TRANSACTIONS.filter(t => t.status === 'locked')
      .sort((a, b) => new Date(a.unlockAt ?? a.createdAt).getTime() - new Date(b.unlockAt ?? b.createdAt).getTime())
    return { failed, processing, locked }
  }, [])

  const filtered = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(t => {
      const q = search.toLowerCase()
      if (q && !t.creatorName.toLowerCase().includes(q) && !t.campaignName.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q)) return false
      if (statusFilter && t.status !== statusFilter) return false
      return true
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [search, statusFilter])

  const poolLedger = useMemo(() =>
    [...MOCK_POOL_TRANSACTIONS].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    []
  )

  // ── Handlers ────────────────────────────────────────
  const hasActiveFilters = !!(search || statusFilter)
  const clearFilters = () => { setSearch(''); setStatusFilter('') }

  const selectableQueue = [...queueItems.failed, ...queueItems.processing]
  const allSelected = selectableQueue.length > 0 && selectableQueue.every(t => selectedIds.includes(t.id))

  function toggleSelect(id: string) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function toggleSelectAll() {
    if (allSelected) setSelectedIds([])
    else setSelectedIds(selectableQueue.map(t => t.id))
  }

  function handleConfirmRelease() {
    if (!confirmRelease) return
    const count = confirmRelease.txns.length
    const total = confirmRelease.txns.reduce((s, t) => s + t.amount, 0)
    if (confirmRelease.type === 'release') {
      success(`Released ${count} payout${count > 1 ? 's' : ''} — ${formatCurrency(total)}`)
    } else {
      success(`Retrying ${count} failed payout${count > 1 ? 's' : ''}`)
    }
    setSelectedIds(prev => prev.filter(id => !confirmRelease.txns.find(t => t.id === id)))
    setConfirmRelease(null)
  }

  function handleAddFunds() {
    const amount = parseFloat(fundAmount)
    if (!amount || amount <= 0) return
    success(`Added ${formatCurrency(amount)} to pool`, fundDescription || 'Fund deposit')
    setFundAmount('')
    setFundDescription('')
    setShowAddFunds(false)
  }

  // ── Pool Utilization ────────────────────────────────
  const utilizationPercent = pool.balance > 0 ? Math.round((pool.totalAllocated / pool.balance) * 100) : 0

  // ── Render ──────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* ─── Header ──────────────────────────────────── */}
      <PageHeader
        title="Payout Command Center"
        subtitle={isSuperAdmin
          ? `${stats.processingCount + stats.failedCount} payouts need your attention`
          : `${MOCK_TRANSACTIONS.length} total transactions`
        }
      >
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />Export
        </Button>
        {!isSuperAdmin && (
          <Button size="sm" onClick={() => setShowAddFunds(true)}>
            <Plus className="h-4 w-4" />Add Funds
          </Button>
        )}
      </PageHeader>

      {/* ─── Pool Hero Card ──────────────────────────── */}
      <div className="admin-card overflow-hidden">
        <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-t-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Balance */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Wallet className="h-4 w-4" />
                <span>Pool Balance</span>
              </div>
              <p className="text-4xl font-bold num-font tracking-tight">{formatCurrency(pool.balance)}</p>
              <p className="text-slate-400 text-sm">
                {formatCurrency(poolAvailable)} available for release
              </p>
            </div>

            {/* Right: Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Lock className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-xs text-slate-400">Allocated</span>
                </div>
                <p className="text-lg font-bold num-font text-amber-400">{formatCurrency(pool.totalAllocated)}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Banknote className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs text-slate-400">Available</span>
                </div>
                <p className="text-lg font-bold num-font text-emerald-400">{formatCurrency(poolAvailable)}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Send className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs text-slate-400">Disbursed</span>
                </div>
                <p className="text-lg font-bold num-font text-blue-400">{formatCurrency(pool.totalDisbursed)}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-slate-400">Deposited</span>
                </div>
                <p className="text-lg font-bold num-font text-purple-400">{formatCurrency(pool.totalDeposited)}</p>
              </div>
            </div>
          </div>

          {/* Utilization Bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Pool utilization</span>
              <span className="num-font">{utilizationPercent}% allocated</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  utilizationPercent > 80 ? 'bg-red-400' : utilizationPercent > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                )}
                style={{ width: `${utilizationPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick action strip */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-muted-foreground">{stats.failedCount} failed</span>
              <span className="font-semibold num-font text-red-600">{formatCurrency(stats.failedAmount)}</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">{stats.processingCount} ready</span>
              <span className="font-semibold num-font text-blue-600">{formatCurrency(stats.processingAmount)}</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">{stats.lockedCount} locked</span>
              <span className="font-semibold num-font text-amber-600">{formatCurrency(stats.lockedAmount)}</span>
            </span>
          </div>
          {!isSuperAdmin && (
            <Button size="sm" onClick={() => setShowAddFunds(true)}>
              <Plus className="h-3.5 w-3.5" />Add Funds to Pool
            </Button>
          )}
          {isSuperAdmin && stats.processingCount > 0 && (
            <Button
              size="sm"
              onClick={() => setConfirmRelease({ txns: queueItems.processing, type: 'release' })}
            >
              <Send className="h-3.5 w-3.5" />Release All Ready ({stats.processingCount})
            </Button>
          )}
        </div>
      </div>

      {/* ─── Tab Navigation ──────────────────────────── */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
        {([
          { key: 'queue' as PayoutTab, label: 'Release Queue', icon: ShieldCheck, count: stats.processingCount + stats.failedCount },
          { key: 'transactions' as PayoutTab, label: 'All Transactions', icon: Wallet, count: MOCK_TRANSACTIONS.length },
          { key: 'ledger' as PayoutTab, label: 'Pool Ledger', icon: Banknote, count: MOCK_POOL_TRANSACTIONS.length },
        ]).map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer',
                isActive
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <Badge variant={isActive ? 'default' : 'gray'} className="text-[10px] px-1.5 py-0">
                {tab.count}
              </Badge>
            </button>
          )
        })}
      </div>

      {/* ─── TAB: Release Queue ──────────────────────── */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {/* Role notice for admins */}
          {!isSuperAdmin && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <Eye className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-blue-900 text-sm">View-Only Access</p>
                <p className="text-blue-700 text-xs mt-0.5">
                  Payment releases are handled by Super Admins. You can view the queue and add funds to the pool.
                </p>
              </div>
            </div>
          )}

          {/* Batch Actions (Super Admin) */}
          {isSuperAdmin && selectedIds.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between flex-wrap gap-2 sticky top-0 z-10">
              <p className="text-sm font-medium text-primary">
                {selectedIds.length} payout{selectedIds.length > 1 ? 's' : ''} selected
                <span className="text-muted-foreground ml-1">
                  ({formatCurrency(MOCK_TRANSACTIONS.filter(t => selectedIds.includes(t.id)).reduce((s, t) => s + t.amount, 0))})
                </span>
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const txns = MOCK_TRANSACTIONS.filter(t => selectedIds.includes(t.id))
                    const hasFailedOnly = txns.every(t => t.status === 'failed')
                    setConfirmRelease({ txns, type: hasFailedOnly ? 'retry' : 'release' })
                  }}
                >
                  <Send className="h-3.5 w-3.5" />
                  {MOCK_TRANSACTIONS.filter(t => selectedIds.includes(t.id)).every(t => t.status === 'failed')
                    ? 'Retry Selected'
                    : 'Release Selected'
                  }
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
                  <X className="h-3.5 w-3.5" />Clear
                </Button>
              </div>
            </div>
          )}

          {/* Select All */}
          {isSuperAdmin && selectableQueue.length > 0 && (
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="rounded cursor-pointer accent-primary"
                />
                Select all {selectableQueue.length} actionable payouts
              </label>
            </div>
          )}

          {/* Failed Section */}
          {queueItems.failed.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 py-2 flex-wrap">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <h3 className="text-sm font-semibold text-red-700">
                  Failed — Needs Attention ({queueItems.failed.length})
                </h3>
                <span className="text-xs font-medium num-font text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                  {formatCurrency(stats.failedAmount)}
                </span>
                {isSuperAdmin && queueItems.failed.length > 1 && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="ml-auto h-7 text-xs"
                    onClick={() => setConfirmRelease({ txns: queueItems.failed, type: 'retry' })}
                  >
                    <RefreshCw className="h-3 w-3" />Retry All Failed
                  </Button>
                )}
              </div>
              <div className="grid gap-2">
                {queueItems.failed.map(txn => (
                  <QueueCard
                    key={txn.id}
                    txn={txn}
                    isSuperAdmin={isSuperAdmin}
                    isSelected={selectedIds.includes(txn.id)}
                    isExpanded={expandedTxn === txn.id}
                    onToggleSelect={() => toggleSelect(txn.id)}
                    onToggleExpand={() => setExpandedTxn(prev => prev === txn.id ? null : txn.id)}
                    onAction={() => setConfirmRelease({ txns: [txn], type: 'retry' })}
                    onViewCreator={() => navigate(`/creators/${txn.creatorId}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Processing Section */}
          {queueItems.processing.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 py-2 flex-wrap">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-blue-700">
                  Ready to Release ({queueItems.processing.length})
                </h3>
                <span className="text-xs font-medium num-font text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                  {formatCurrency(stats.processingAmount)}
                </span>
                {isSuperAdmin && queueItems.processing.length > 1 && (
                  <Button
                    size="sm"
                    className="ml-auto h-7 text-xs"
                    onClick={() => setConfirmRelease({ txns: queueItems.processing, type: 'release' })}
                  >
                    <Send className="h-3 w-3" />Release All
                  </Button>
                )}
              </div>
              <div className="grid gap-2">
                {queueItems.processing.map(txn => (
                  <QueueCard
                    key={txn.id}
                    txn={txn}
                    isSuperAdmin={isSuperAdmin}
                    isSelected={selectedIds.includes(txn.id)}
                    isExpanded={expandedTxn === txn.id}
                    onToggleSelect={() => toggleSelect(txn.id)}
                    onToggleExpand={() => setExpandedTxn(prev => prev === txn.id ? null : txn.id)}
                    onAction={() => setConfirmRelease({ txns: [txn], type: 'release' })}
                    onViewCreator={() => navigate(`/creators/${txn.creatorId}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Locked Section */}
          {queueItems.locked.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 py-2 flex-wrap">
                <Clock className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-amber-700">
                  Locked — Unlocking Soon ({queueItems.locked.length})
                </h3>
                <span className="text-xs font-medium num-font text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                  {formatCurrency(stats.lockedAmount)}
                </span>
              </div>
              <div className="grid gap-2">
                {queueItems.locked.map(txn => (
                  <QueueCard
                    key={txn.id}
                    txn={txn}
                    isSuperAdmin={isSuperAdmin}
                    isSelected={false}
                    isExpanded={expandedTxn === txn.id}
                    onToggleSelect={() => {}}
                    onToggleExpand={() => setExpandedTxn(prev => prev === txn.id ? null : txn.id)}
                    onViewCreator={() => navigate(`/creators/${txn.creatorId}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {selectableQueue.length === 0 && queueItems.locked.length === 0 && (
            <EmptyState title="All caught up!" description="No payouts need your attention right now." />
          )}
        </div>
      )}

      {/* ─── TAB: All Transactions ───────────────────── */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Paid', value: formatCurrency(stats.paidAmount), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', filterValue: 'paid' },
              { label: 'Processing', value: formatCurrency(stats.processingAmount), icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50', filterValue: 'processing' },
              { label: 'Locked (72h)', value: formatCurrency(stats.lockedAmount), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', filterValue: 'locked' },
              { label: 'Failed', value: `${stats.failedCount} payouts`, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', filterValue: 'failed' },
            ].map(s => {
              const Icon = s.icon
              const isActive = statusFilter === s.filterValue
              return (
                <button
                  key={s.label}
                  onClick={() => setStatusFilter(prev => prev === s.filterValue ? '' : s.filterValue)}
                  className={cn(
                    'admin-card p-4 text-left cursor-pointer hover:shadow-md transition-all',
                    isActive && 'ring-2 ring-primary/30 shadow-md'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn('p-1.5 rounded-lg', s.bg)}>
                      <Icon className={cn('h-4 w-4', s.color)} />
                    </div>
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                  <p className={cn('text-xl font-bold num-font', s.color)}>{s.value}</p>
                </button>
              )
            })}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search by creator, campaign, or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter} options={STATUS_OPTIONS} className="w-40" />
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="h-3.5 w-3.5" />Clear all
              </Button>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {MOCK_TRANSACTIONS.length} transaction{MOCK_TRANSACTIONS.length !== 1 ? 's' : ''}
          </p>

          {/* Transaction Table */}
          {filtered.length === 0 ? (
            <EmptyState title="No transactions found" description="Try adjusting your search or filters." actionLabel="Clear Filters" onAction={clearFilters} />
          ) : (
            <div className="admin-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {['Transaction', 'Creator', 'Amount', 'Status', 'Date', 'Action'].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map(txn => (
                      <tr
                        key={txn.id}
                        className={cn(
                          'hover:bg-slate-50/50 transition-colors',
                          txn.status === 'failed' && 'bg-red-50/40 hover:bg-red-50/60'
                        )}
                      >
                        <td className="py-3 px-4">
                          <p className="font-mono text-xs text-muted-foreground">{txn.id.toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-40">{txn.campaignName}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Avatar name={txn.creatorName} size="sm" />
                            <div>
                              <p className="font-medium text-sm">{txn.creatorName}</p>
                              <p className="text-xs text-muted-foreground">{txn.upiId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold num-font text-primary">{formatCurrency(txn.amount)}</p>
                        </td>
                        <td className="py-3 px-4"><StatusBadge status={txn.status} /></td>
                        <td className="py-3 px-4">
                          <p className="text-xs">{getRelativeTime(txn.createdAt)}</p>
                          {txn.status === 'locked' && txn.unlockAt && (
                            <p className="text-xs text-amber-600 mt-0.5">Unlocks {getRelativeTime(txn.unlockAt)}</p>
                          )}
                          {txn.failureReason && (
                            <p className="text-xs text-red-600 mt-0.5">{txn.failureReason}</p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {isSuperAdmin && txn.status === 'processing' && (
                            <Button size="sm" onClick={() => setConfirmRelease({ txns: [txn], type: 'release' })}>
                              <Wallet className="h-3.5 w-3.5" />Release
                            </Button>
                          )}
                          {isSuperAdmin && txn.status === 'failed' && (
                            <Button size="sm" variant="outline" onClick={() => setConfirmRelease({ txns: [txn], type: 'retry' })}>
                              <RefreshCw className="h-3.5 w-3.5" />Retry
                            </Button>
                          )}
                          {(!isSuperAdmin || txn.status === 'paid' || txn.status === 'locked') && (
                            <Button size="sm" variant="ghost" onClick={() => navigate(`/creators/${txn.creatorId}`)}>
                              View Creator
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: Pool Ledger ────────────────────────── */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          {/* CTA for admins to add funds */}
          {!isSuperAdmin && (
            <div className="admin-card p-5 flex items-center justify-between bg-linear-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 rounded-xl">
                  <IndianRupee className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">Add Funds to Campaign Pool</p>
                  <p className="text-sm text-emerald-700">Deposit money to enable creator payouts for active campaigns.</p>
                </div>
              </div>
              <Button size="sm" variant="success" onClick={() => setShowAddFunds(true)}>
                <Plus className="h-4 w-4" />Add Funds
              </Button>
            </div>
          )}

          {/* Ledger Timeline */}
          <div className="admin-card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Fund Activity</h3>
              <span className="text-xs text-muted-foreground">{poolLedger.length} entries</span>
            </div>
            <div className="divide-y divide-slate-100">
              {poolLedger.map(entry => (
                <div key={entry.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className={cn(
                    'p-2 rounded-xl shrink-0',
                    entry.type === 'deposit' ? 'bg-emerald-50' : 'bg-blue-50'
                  )}>
                    {entry.type === 'deposit'
                      ? <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                      : <ArrowUpRight className="h-4 w-4 text-blue-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm truncate">{entry.description}</p>
                      <Badge variant={entry.type === 'deposit' ? 'success' : 'info'} className="text-[10px] shrink-0">
                        {entry.type === 'deposit' ? 'Deposit' : 'Payout'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      by {entry.performedByName} &middot; {getRelativeTime(entry.timestamp)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn(
                      'font-bold num-font text-sm',
                      entry.type === 'deposit' ? 'text-emerald-600' : 'text-blue-600'
                    )}>
                      {entry.type === 'deposit' ? '+' : '-'}{formatCurrency(entry.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground num-font">
                      Bal: {formatCurrency(entry.balanceAfter)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Add Funds Dialog ────────────────────────── */}
      <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
        <DialogContent onClose={() => setShowAddFunds(false)} className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Funds to Pool</DialogTitle>
            <DialogDescription>
              Deposit money into the campaign pool. Super Admins will release funds to creators.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-2">
            <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current pool balance</span>
              <span className="font-bold num-font text-lg">{formatCurrency(pool.balance)}</span>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Amount (INR)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  value={fundAmount}
                  onChange={e => setFundAmount(e.target.value)}
                  className="pl-9"
                  min={1}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
              <Input
                placeholder="e.g. March campaign budget"
                value={fundDescription}
                onChange={e => setFundDescription(e.target.value)}
              />
            </div>
            {fundAmount && parseFloat(fundAmount) > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm">
                <p className="text-emerald-800">
                  New balance will be <span className="font-bold num-font">{formatCurrency(pool.balance + parseFloat(fundAmount))}</span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFunds(false)}>Cancel</Button>
            <Button onClick={handleAddFunds} disabled={!fundAmount || parseFloat(fundAmount) <= 0}>
              <Plus className="h-4 w-4" />Add {fundAmount ? formatCurrency(parseFloat(fundAmount)) : 'Funds'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Release / Retry Confirmation Dialog ─────── */}
      <Dialog open={!!confirmRelease} onOpenChange={open => { if (!open) setConfirmRelease(null) }}>
        <DialogContent onClose={() => setConfirmRelease(null)} className="max-w-md">
          {confirmRelease && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {confirmRelease.type === 'release'
                    ? `Release ${confirmRelease.txns.length} Payout${confirmRelease.txns.length > 1 ? 's' : ''}`
                    : `Retry ${confirmRelease.txns.length} Failed Payout${confirmRelease.txns.length > 1 ? 's' : ''}`
                  }
                </DialogTitle>
                <DialogDescription>
                  {confirmRelease.type === 'release'
                    ? 'This will transfer funds from the pool directly to creator UPI accounts. This action cannot be undone.'
                    : 'This will re-attempt the failed transactions. The original payment method will be used.'
                  }
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 my-2">
                {/* Summary */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total amount</span>
                    <span className="font-bold num-font text-lg text-primary">
                      {formatCurrency(confirmRelease.txns.reduce((s, t) => s + t.amount, 0))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Number of payouts</span>
                    <span className="font-semibold">{confirmRelease.txns.length}</span>
                  </div>
                  {confirmRelease.type === 'release' && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pool balance after</span>
                      <span className="font-semibold num-font text-emerald-600">
                        {formatCurrency(pool.balance - confirmRelease.txns.reduce((s, t) => s + t.amount, 0))}
                      </span>
                    </div>
                  )}
                </div>

                {/* Creator list preview */}
                <div className="max-h-48 overflow-y-auto space-y-1.5">
                  {confirmRelease.txns.slice(0, 5).map(txn => (
                    <div key={txn.id} className="flex items-center justify-between bg-white rounded-lg p-2.5 border border-slate-100">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar name={txn.creatorName} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{txn.creatorName}</p>
                          <p className="text-xs text-muted-foreground">{txn.upiId}</p>
                        </div>
                      </div>
                      <p className="font-semibold num-font text-sm shrink-0">{formatCurrency(txn.amount)}</p>
                    </div>
                  ))}
                  {confirmRelease.txns.length > 5 && (
                    <p className="text-xs text-center text-muted-foreground py-1">
                      + {confirmRelease.txns.length - 5} more
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmRelease(null)}>Cancel</Button>
                <Button
                  variant={confirmRelease.type === 'retry' ? 'warning' : 'default'}
                  onClick={handleConfirmRelease}
                >
                  {confirmRelease.type === 'release' ? (
                    <><Send className="h-4 w-4" />Confirm Release</>
                  ) : (
                    <><RefreshCw className="h-4 w-4" />Confirm Retry</>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Queue Card Component ─────────────────────────────────
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
      'admin-card transition-all',
      isSelected && 'ring-2 ring-primary/30 shadow-md',
      txn.status === 'failed' && 'border-red-200 bg-red-50/30',
    )}>
      <div className="p-4 flex items-center gap-3">
        {/* Checkbox */}
        {isSuperAdmin && isActionable && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="rounded cursor-pointer accent-primary shrink-0"
          />
        )}

        {/* Creator Info */}
        <button onClick={onToggleExpand} className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer text-left">
          <Avatar name={txn.creatorName} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-sm truncate">{txn.creatorName}</p>
              <StatusBadge status={txn.status} />
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {txn.campaignName}
              {txn.failureReason && (
                <span className="text-red-500 ml-1">— {txn.failureReason}</span>
              )}
            </p>
          </div>
        </button>

        {/* Amount */}
        <div className="text-right shrink-0 mr-2">
          <p className="font-bold num-font text-primary">{formatCurrency(txn.amount)}</p>
          <p className="text-xs text-muted-foreground">{txn.upiId}</p>
        </div>

        {/* Action */}
        <div className="shrink-0 flex items-center gap-2">
          {isSuperAdmin && txn.status === 'processing' && onAction && (
            <Button size="sm" onClick={onAction}>
              <Send className="h-3.5 w-3.5" />Release
            </Button>
          )}
          {isSuperAdmin && txn.status === 'failed' && onAction && (
            <Button size="sm" variant="destructive" onClick={onAction}>
              <RefreshCw className="h-3.5 w-3.5" />Retry
            </Button>
          )}
          {txn.status === 'locked' && (
            <Button size="sm" variant="ghost" onClick={onViewCreator}>
              View <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          )}
          {!isSuperAdmin && isActionable && (
            <Button size="sm" variant="ghost" onClick={onViewCreator}>
              View <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs">
            <div>
              <span className="text-muted-foreground">Transaction ID</span>
              <p className="font-mono mt-0.5">{txn.id.toUpperCase()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Submission</span>
              <p className="font-mono mt-0.5">{txn.submissionId.toUpperCase()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Created</span>
              <p className="mt-0.5">{getRelativeTime(txn.createdAt)}</p>
            </div>
            {txn.status === 'locked' && txn.unlockAt && (
              <div>
                <span className="text-muted-foreground">Unlocks</span>
                <p className="mt-0.5 text-amber-600 font-medium">{getRelativeTime(txn.unlockAt)}</p>
              </div>
            )}
            {txn.failureReason && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Failure Reason</span>
                <p className="mt-0.5 text-red-600 font-medium">{txn.failureReason}</p>
              </div>
            )}
            {txn.processedBy && (
              <div>
                <span className="text-muted-foreground">Processed By</span>
                <p className="mt-0.5">{txn.processedBy}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
