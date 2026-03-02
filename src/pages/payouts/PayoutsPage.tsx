import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, RefreshCw, Download, AlertTriangle, Wallet, Clock, CheckCircle } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useToast } from '@/contexts/ToastContext'
import { formatCurrency, getRelativeTime } from '@/lib/utils'
import { MOCK_TRANSACTIONS } from '@/data/transactions'

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'locked', label: 'Locked' },
  { value: 'processing', label: 'Processing' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
]

export function PayoutsPage() {
  const { success } = useToast()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filtered = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(t => {
      const q = search.toLowerCase()
      if (q && !t.creatorName.toLowerCase().includes(q) && !t.campaignName.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q)) return false
      if (statusFilter && t.status !== statusFilter) return false
      return true
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [search, statusFilter])

  const stats = useMemo(() => ({
    total: MOCK_TRANSACTIONS.reduce((s, t) => t.status === 'paid' ? s + t.amount : s, 0),
    processing: MOCK_TRANSACTIONS.filter(t => t.status === 'processing').reduce((s, t) => s + t.amount, 0),
    locked: MOCK_TRANSACTIONS.filter(t => t.status === 'locked').reduce((s, t) => s + t.amount, 0),
    failed: MOCK_TRANSACTIONS.filter(t => t.status === 'failed').length,
  }), [])

  const failedTxns = MOCK_TRANSACTIONS.filter(t => t.status === 'failed')

  function toggleSelect(id: string) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payout Management"
        subtitle={`${MOCK_TRANSACTIONS.length} total transactions`}
      >
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />Export
        </Button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Paid Out', value: formatCurrency(stats.total), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Processing', value: formatCurrency(stats.processing), icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Locked (72h)', value: formatCurrency(stats.locked), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Failed', value: `${stats.failed} payouts`, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', action: () => setStatusFilter('failed') },
        ].map(s => {
          const Icon = s.icon
          return (
            <button key={s.label} onClick={s.action} className={`admin-card p-4 text-left ${s.action ? 'cursor-pointer hover:shadow-md' : ''} transition-shadow`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`p-1.5 rounded-lg ${s.bg}`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className={`text-xl font-bold num-font ${s.color}`}>{s.value}</p>
            </button>
          )
        })}
      </div>

      {/* Failed Payouts Alert */}
      {failedTxns.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold text-red-800">{failedTxns.length} Failed Payouts — Action Required</h3>
            </div>
            <Button size="sm" variant="destructive" onClick={() => success(`Retrying ${failedTxns.length} failed payouts`)}>
              <RefreshCw className="h-4 w-4" />Retry All
            </Button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {failedTxns.map(t => (
              <div key={t.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100">
                <div className="flex items-center gap-3">
                  <Avatar name={t.creatorName} size="sm" />
                  <div>
                    <p className="font-medium text-sm">{t.creatorName}</p>
                    <p className="text-xs text-red-600">{t.failureReason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold num-font">{formatCurrency(t.amount)}</p>
                  <Button size="sm" variant="outline" onClick={() => success('Retrying payout', t.creatorName)}>
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
          <p className="text-sm font-medium text-blue-800">{selectedIds.length} transactions selected</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => { success(`Released ${selectedIds.length} payouts`); setSelectedIds([]) }}>Release Selected</Button>
            <Button size="sm" variant="outline" onClick={() => setSelectedIds([])}>Deselect</Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search by creator, campaign..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter} options={STATUS_OPTIONS} className="w-40" />
        <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} transactions</p>

      {filtered.length === 0 ? (
        <EmptyState title="No transactions found" actionLabel="Clear Filters" onAction={() => { setSearch(''); setStatusFilter('') }} />
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-8">
                    <input type="checkbox" className="rounded cursor-pointer" onChange={e => {
                      if (e.target.checked) setSelectedIds(filtered.filter(t => t.status === 'processing').map(t => t.id))
                      else setSelectedIds([])
                    }} />
                  </th>
                  {['Transaction', 'Creator', 'Amount', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(txn => (
                  <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      {txn.status === 'processing' && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(txn.id)}
                          onChange={() => toggleSelect(txn.id)}
                          className="rounded cursor-pointer"
                        />
                      )}
                    </td>
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
                        <p className="text-xs text-amber-600 mt-0.5">
                          Unlocks {getRelativeTime(txn.unlockAt)}
                        </p>
                      )}
                      {txn.failureReason && (
                        <p className="text-xs text-red-600 mt-0.5">{txn.failureReason}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {txn.status === 'processing' && (
                        <Button size="sm" onClick={() => success('Payout released', txn.creatorName)}>
                          <Wallet className="h-3.5 w-3.5" />Release
                        </Button>
                      )}
                      {txn.status === 'failed' && (
                        <Button size="sm" variant="outline" onClick={() => success('Retrying payout', txn.creatorName)}>
                          <RefreshCw className="h-3.5 w-3.5" />Retry
                        </Button>
                      )}
                      {txn.status === 'paid' && (
                        <button
                          className="text-xs text-primary hover:underline cursor-pointer"
                          onClick={() => navigate(`creators/${txn.creatorId}`)}
                        >
                          View Creator
                        </button>
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
  )
}
