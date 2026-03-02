import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, AlertTriangle, CheckCircle, Clock, Video } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { cn, formatCurrency, formatNumber, getRelativeTime } from '@/lib/utils'
import { MOCK_SUBMISSIONS } from '@/data/submissions'

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'paid', label: 'Paid' },
]

const STAGE_OPTIONS = [
  { value: '', label: 'All Stages' },
  { value: 't0', label: 'T0 (Initial)' },
  { value: 'h24', label: '24h Check' },
  { value: 'h72', label: '72h Final' },
  { value: 'completed', label: 'Completed' },
]

export function SubmissionsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('')

  const hasActiveFilters = !!(search || statusFilter || stageFilter)

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setStageFilter('')
  }

  const filtered = useMemo(() => {
    return MOCK_SUBMISSIONS.filter(s => {
      const q = search.toLowerCase()
      if (q && !s.creatorName.toLowerCase().includes(q) && !s.campaignName.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q)) return false
      if (statusFilter && s.status !== statusFilter) return false
      if (stageFilter && s.verificationStage !== stageFilter) return false
      return true
    }).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  }, [search, statusFilter, stageFilter])

  const stats = {
    total: MOCK_SUBMISSIONS.length,
    pending: MOCK_SUBMISSIONS.filter(s => s.status === 'pending').length,
    approved: MOCK_SUBMISSIONS.filter(s => s.status === 'approved').length,
    rejected: MOCK_SUBMISSIONS.filter(s => s.status === 'rejected').length,
    paid: MOCK_SUBMISSIONS.filter(s => s.status === 'paid').length,
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Submissions"
        subtitle={`${stats.total} total submissions`}
      />

      {/* Summary Cards — toggleable filters with active state */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', filterValue: 'pending' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', filterValue: 'approved' },
          { label: 'Rejected', value: stats.rejected, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', filterValue: 'rejected' },
          { label: 'Paid', value: stats.paid, icon: Video, color: 'text-blue-600', bg: 'bg-blue-50', filterValue: 'paid' },
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
              <p className={cn('text-2xl font-bold num-font', s.color)}>{s.value}</p>
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
        <Select value={stageFilter} onValueChange={setStageFilter} options={STAGE_OPTIONS} className="w-40" />
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            Clear all
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {stats.total} submission{stats.total !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No submissions found"
          description="Try adjusting your search or filters."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(sub => (
            <div
              key={sub.id}
              className={cn(
                'admin-card p-4 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer hover:shadow-md transition-shadow',
                sub.fraudFlags.length > 0 && 'border-red-200 bg-red-50/30'
              )}
              onClick={() => navigate(`/submissions/${sub.id}`)}
            >
              <Avatar name={sub.creatorName} size="sm" className="shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{sub.creatorName}</p>
                  <span className="text-muted-foreground text-xs">{sub.creatorHandle}</span>
                  {sub.fraudFlags.length > 0 && (
                    <Badge variant="error" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />{sub.fraudFlags.length} flag{sub.fraudFlags.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{sub.campaignName}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                  <span>{formatNumber(sub.metricsCurrent.views)} views</span>
                  <span>{formatNumber(sub.metricsCurrent.likes)} likes</span>
                  <span>Stage: <span className="uppercase font-medium text-slate-600">{sub.verificationStage}</span></span>
                  <span>Rank #{sub.ranking}/{sub.totalRankEntries}</span>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
                <p className="text-primary font-semibold num-font">{formatCurrency(sub.projectedPayout)}</p>
                <StatusBadge status={sub.status} />
                <span className="text-xs text-muted-foreground">{getRelativeTime(sub.submittedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
