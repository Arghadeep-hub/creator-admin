import { lazy, Suspense, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Wallet, Banknote, Download, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PageLoader } from '@/components/ui/PageLoader'
import { EmptyState } from '@/components/shared/EmptyState'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { formatCurrency } from '@/lib/utils'
import {
  useGetPoolBalanceQuery,
  useGetPayoutTransactionsQuery,
  useGetPayoutQueueQuery,
  useGetPoolTransactionsQuery,
  useDepositToPoolMutation,
  useReleasePayoutsMutation,
  useRetryPayoutMutation,
} from '@/store/api/payoutsApi'
import type { PayoutTransaction } from '@/types'
import type { PayoutTab } from './payouts.types'

// ── Above the fold — regular imports ──
import { PoolBalanceHero } from './_sections/PoolBalanceHero'
import { UrgentAlertBanner } from './_sections/UrgentAlertBanner'
import { PayoutKpiCards } from './_sections/PayoutKpiCards'
import { AddFundsDialog } from './_sections/AddFundsDialog'
import { ReleaseConfirmDialog } from './_sections/ReleaseConfirmDialog'

// ── Below the fold — lazy loaded ──
const QueueTab = lazy(() => import('./_sections/QueueTab').then(m => ({ default: m.QueueTab })))
const TransactionsTab = lazy(() => import('./_sections/TransactionsTab').then(m => ({ default: m.TransactionsTab })))
const LedgerTab = lazy(() => import('./_sections/LedgerTab').then(m => ({ default: m.LedgerTab })))

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white p-5 animate-pulse ${className ?? ''}`}>
      <div className="h-4 w-1/3 rounded bg-slate-200 mb-4" />
      <div className="space-y-2.5">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
        <div className="h-3 w-4/5 rounded bg-slate-100" />
      </div>
    </div>
  )
}

export function PayoutsPage() {
  const { session } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()
  const isSuperAdmin = session?.role === 'super_admin'

  const [activeTab, setActiveTab] = useState<PayoutTab>(isSuperAdmin ? 'queue' : 'transactions')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [fundAmount, setFundAmount] = useState('')
  const [fundDescription, setFundDescription] = useState('')
  const [confirmRelease, setConfirmRelease] = useState<{ txns: PayoutTransaction[]; type: 'release' | 'retry' } | null>(null)
  const [expandedTxn, setExpandedTxn] = useState<string | null>(null)

  // RTK Query hooks
  const { data: pool, isLoading: isPoolLoading, isError: isPoolError, refetch: refetchPool } = useGetPoolBalanceQuery()
  const { data: transactionsData, isLoading: isTxnsLoading } = useGetPayoutTransactionsQuery({
    page: 1,
    limit: 200,
    status: (statusFilter as PayoutTransaction['status']) || undefined,
  })
  const { data: queueData, isLoading: isQueueLoading } = useGetPayoutQueueQuery({ page: 1, limit: 100 })
  const { data: poolTxnsData, isLoading: isLedgerLoading } = useGetPoolTransactionsQuery({ page: 1, limit: 100 })

  const [depositToPool, { isLoading: isDepositing }] = useDepositToPoolMutation()
  const [releasePayouts] = useReleasePayoutsMutation()
  const [retryPayout] = useRetryPayoutMutation()

  const allTransactions = transactionsData?.data ?? []
  const queueTransactions = queueData?.data ?? []
  const poolLedger = poolTxnsData?.data ?? []

  const stats = useMemo(() => {
    const locked = allTransactions.filter(t => t.status === 'locked')
    const processing = allTransactions.filter(t => t.status === 'processing')
    const paid = allTransactions.filter(t => t.status === 'paid')
    const failed = allTransactions.filter(t => t.status === 'failed')
    return {
      lockedCount: locked.length, lockedAmount: locked.reduce((s, t) => s + t.amount, 0),
      processingCount: processing.length, processingAmount: processing.reduce((s, t) => s + t.amount, 0),
      paidCount: paid.length, paidAmount: paid.reduce((s, t) => s + t.amount, 0),
      failedCount: failed.length, failedAmount: failed.reduce((s, t) => s + t.amount, 0),
    }
  }, [allTransactions])

  const queueItems = useMemo(() => {
    const failed = queueTransactions.filter(t => t.status === 'failed').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const processing = queueTransactions.filter(t => t.status === 'processing').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const locked = queueTransactions.filter(t => t.status === 'locked').sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    return { failed, processing, locked }
  }, [queueTransactions])

  const filtered = useMemo(() => {
    return allTransactions.filter(t => {
      const q = search.toLowerCase()
      if (q && !t.creatorName?.toLowerCase().includes(q) && !t.restaurantName?.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q)) return false
      if (statusFilter && t.status !== statusFilter) return false
      return true
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [search, statusFilter, allTransactions])

  const sortedPoolLedger = useMemo(() => [...poolLedger].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [poolLedger])

  const hasActiveFilters = !!(search || statusFilter)
  const clearFilters = () => { setSearch(''); setStatusFilter('') }
  const selectableQueue = [...queueItems.failed, ...queueItems.processing]
  const allSelected = selectableQueue.length > 0 && selectableQueue.every(t => selectedIds.includes(t.id))
  const poolAvailable = pool ? pool.balance - pool.totalAllocated : 0
  const utilizationPercent = pool && pool.balance > 0 ? Math.round((pool.totalAllocated / pool.balance) * 100) : 0

  function toggleSelect(id: string) { setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]) }
  function toggleSelectAll() { if (allSelected) setSelectedIds([]); else setSelectedIds(selectableQueue.map(t => t.id)) }

  async function handleConfirmRelease() {
    if (!confirmRelease) return
    const count = confirmRelease.txns.length
    const total = confirmRelease.txns.reduce((s, t) => s + t.amount, 0)
    try {
      if (confirmRelease.type === 'release') {
        await releasePayouts({ transactionIds: confirmRelease.txns.map(t => t.id) }).unwrap()
        success(`Released ${count} payout${count > 1 ? 's' : ''} — ${formatCurrency(total)}`)
      } else {
        // Retry each failed payout
        await Promise.all(confirmRelease.txns.map(t => retryPayout(t.id).unwrap()))
        success(`Retrying ${count} failed payout${count > 1 ? 's' : ''}`)
      }
    } catch {
      error('Failed to process payouts')
    }
    setSelectedIds(prev => prev.filter(id => !confirmRelease.txns.find(t => t.id === id)))
    setConfirmRelease(null)
  }

  async function handleAddFunds() {
    const amount = parseFloat(fundAmount)
    if (!amount || amount <= 0) return
    try {
      await depositToPool({ amount, description: fundDescription || 'Fund deposit' }).unwrap()
      success(`Added ${formatCurrency(amount)} to pool`, fundDescription || 'Fund deposit')
    } catch {
      error('Failed to add funds')
    }
    setFundAmount('')
    setFundDescription('')
    setShowAddFunds(false)
  }

  if (isPoolLoading) return <PageLoader />
  if (isPoolError || !pool) return (
    <EmptyState
      title="Failed to load payout data"
      description="Unable to fetch pool balance. Please try again."
      actionLabel="Retry"
      onAction={refetchPool}
    />
  )

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold font-display text-foreground tracking-tight">Payout Command Center</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isSuperAdmin ? `${stats.processingCount + stats.failedCount} payouts need attention` : `${allTransactions.length} total transactions`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl"><Download className="h-4 w-4" />Export</Button>
          {isSuperAdmin && <Button size="sm" className="rounded-xl" onClick={() => setShowAddFunds(true)} disabled={isDepositing}><Plus className="h-4 w-4" />Add Funds</Button>}
        </div>
      </div>

      {/* ── Urgent Alert ── */}
      {isSuperAdmin && stats.failedCount > 0 && (
        <UrgentAlertBanner failedCount={stats.failedCount} failedAmount={stats.failedAmount} onResolve={() => setActiveTab('queue')} />
      )}

      {/* ── Pool Balance Hero ── */}
      <PoolBalanceHero
        pool={pool} poolAvailable={poolAvailable} utilizationPercent={utilizationPercent}
        stats={stats} isSuperAdmin={isSuperAdmin} onAddFunds={() => setShowAddFunds(true)}
        onReleaseAll={txns => setConfirmRelease({ txns, type: 'release' })} processingTxns={queueItems.processing}
      />

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as PayoutTab)}>
        <TabsList className="w-full bg-slate-100/80 border border-slate-200/60 rounded-2xl p-1 h-auto gap-0.5">
          <TabsTrigger value="queue" className="flex-1 rounded-xl data-[state=active]:shadow-sm gap-1.5 text-xs py-2.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Queue</span>
            <Badge variant={stats.failedCount > 0 ? 'error' : activeTab === 'queue' ? 'default' : 'gray'} className="text-[10px] px-1.5 py-0 min-w-5 justify-center">
              {stats.processingCount + stats.failedCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex-1 rounded-xl data-[state=active]:shadow-sm gap-1.5 text-xs py-2.5">
            <Wallet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Transactions</span>
            <Badge variant={activeTab === 'transactions' ? 'default' : 'gray'} className="text-[10px] px-1.5 py-0 min-w-5 justify-center">{allTransactions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="ledger" className="flex-1 rounded-xl data-[state=active]:shadow-sm gap-1.5 text-xs py-2.5">
            <Banknote className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ledger</span>
            <Badge variant={activeTab === 'ledger' ? 'default' : 'gray'} className="text-[10px] px-1.5 py-0 min-w-5 justify-center">{sortedPoolLedger.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          <Suspense fallback={<CardSkeleton className="min-h-[200px]" />}>
            {isQueueLoading ? <CardSkeleton className="min-h-[200px]" /> : (
              <QueueTab isSuperAdmin={isSuperAdmin} queueItems={queueItems} selectedIds={selectedIds}
                expandedTxn={expandedTxn} stats={stats} selectableQueue={selectableQueue} allSelected={allSelected}
                onToggleSelect={toggleSelect} onToggleSelectAll={toggleSelectAll} onSetConfirmRelease={setConfirmRelease}
                onSetExpandedTxn={setExpandedTxn} onNavigate={path => navigate(path)} allTransactions={queueTransactions} />
            )}
          </Suspense>
        </TabsContent>

        <TabsContent value="transactions">
          <Suspense fallback={<><CardSkeleton className="min-h-[80px]" /><CardSkeleton className="min-h-[200px] mt-4" /></>}>
            {isTxnsLoading ? <CardSkeleton className="min-h-[280px]" /> : (
              <>
                <PayoutKpiCards stats={stats} statusFilter={statusFilter} onStatusFilter={v => setStatusFilter(prev => prev === v ? '' : v)} />
                <div className="mt-4">
                  <TransactionsTab filtered={filtered} totalCount={allTransactions.length} search={search}
                    statusFilter={statusFilter} hasActiveFilters={hasActiveFilters} isSuperAdmin={isSuperAdmin}
                    onSearchChange={setSearch} onStatusFilterChange={setStatusFilter} onClearFilters={clearFilters}
                    onSetConfirmRelease={setConfirmRelease} onNavigate={path => navigate(path)} />
                </div>
              </>
            )}
          </Suspense>
        </TabsContent>

        <TabsContent value="ledger">
          <Suspense fallback={<CardSkeleton className="min-h-[200px]" />}>
            {isLedgerLoading ? <CardSkeleton className="min-h-[200px]" /> : (
              <LedgerTab poolLedger={sortedPoolLedger} isSuperAdmin={isSuperAdmin} onAddFunds={() => setShowAddFunds(true)} />
            )}
          </Suspense>
        </TabsContent>
      </Tabs>

      {/* ── Dialogs ── */}
      <AddFundsDialog open={showAddFunds} onOpenChange={setShowAddFunds} pool={pool}
        fundAmount={fundAmount} fundDescription={fundDescription}
        onFundAmountChange={setFundAmount} onFundDescriptionChange={setFundDescription} onSubmit={handleAddFunds} />
      <ReleaseConfirmDialog confirmRelease={confirmRelease} pool={pool}
        onConfirm={handleConfirmRelease} onCancel={() => setConfirmRelease(null)} />
    </div>
  )
}
