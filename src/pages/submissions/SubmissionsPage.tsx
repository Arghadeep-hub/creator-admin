import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, AlertTriangle, CheckCircle, Clock, Video, ChevronRight, Eye, Heart, Trophy, X, SlidersHorizontal } from 'lucide-react'
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
  { value: '', label: 'All Stages', chip: 'All' },
  { value: 't0', label: 'T0 (Initial)', chip: 'T0' },
  { value: 'h24', label: '24h Check', chip: '24h' },
  { value: 'h72', label: '72h Final', chip: '72h' },
  { value: 'completed', label: 'Completed', chip: 'Done' },
]

const STAT_CARDS = [
  { key: 'pending',  label: 'Pending',  icon: Clock,         color: 'text-amber-600',   bg: 'bg-amber-50',   ring: 'ring-amber-300',   activeBg: 'bg-amber-50/80'   },
  { key: 'approved', label: 'Approved', icon: CheckCircle,   color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-300', activeBg: 'bg-emerald-50/80' },
  { key: 'rejected', label: 'Rejected', icon: AlertTriangle, color: 'text-red-600',     bg: 'bg-red-50',     ring: 'ring-red-300',     activeBg: 'bg-red-50/80'     },
  { key: 'paid',     label: 'Paid',     icon: Video,         color: 'text-blue-600',    bg: 'bg-blue-50',    ring: 'ring-blue-300',    activeBg: 'bg-blue-50/80'    },
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
    total:    MOCK_SUBMISSIONS.length,
    pending:  MOCK_SUBMISSIONS.filter(s => s.status === 'pending').length,
    approved: MOCK_SUBMISSIONS.filter(s => s.status === 'approved').length,
    rejected: MOCK_SUBMISSIONS.filter(s => s.status === 'rejected').length,
    paid:     MOCK_SUBMISSIONS.filter(s => s.status === 'paid').length,
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Submissions"
        subtitle={`${stats.total} total submissions`}
      />

      {/* Stat cards — tap to filter by status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STAT_CARDS.map(s => {
          const Icon = s.icon
          const isActive = statusFilter === s.key
          const value = stats[s.key as keyof typeof stats]
          return (
            <button
              key={s.key}
              onClick={() => setStatusFilter(prev => prev === s.key ? '' : s.key)}
              className={cn(
                'admin-card p-4 text-left cursor-pointer transition-all active:scale-[0.97]',
                'hover:shadow-md',
                isActive ? `ring-2 ${s.ring} shadow-md` : 'ring-0'
              )}
            >
              <div className={cn('inline-flex p-2 rounded-xl mb-3', s.bg)}>
                <Icon className={cn('h-4 w-4', s.color)} />
              </div>
              <p className={cn('text-2xl font-bold num-font leading-none', s.color)}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1.5">{s.label}</p>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Search bar — full width with inline clear */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search creator, campaign, ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Mobile: horizontal scroll stage chips */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 sm:hidden" style={{ scrollbarWidth: 'none' }}>
          {STAGE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStageFilter(opt.value)}
              className={cn(
                'shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all',
                stageFilter === opt.value
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              )}
            >
              {opt.chip}
            </button>
          ))}
        </div>

        {/* Desktop: select dropdowns */}
        <div className="hidden sm:flex gap-2 items-center">
          <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0" />
          <Select value={statusFilter} onValueChange={setStatusFilter} options={STATUS_OPTIONS} className="w-40 shrink-0" />
          <Select value={stageFilter} onValueChange={setStageFilter} options={STAGE_OPTIONS} className="w-40 shrink-0" />
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Results count + mobile clear */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {filtered.length} of {stats.total} result{stats.total !== 1 ? 's' : ''}
        </p>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs font-medium text-primary sm:hidden">
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No submissions found"
          description="Try adjusting your search or filters."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="space-y-2.5">
          {filtered.map(sub => (
            <div
              key={sub.id}
              onClick={() => navigate(`/submissions/${sub.id}`)}
              className={cn(
                'admin-card cursor-pointer transition-all active:scale-[0.99]',
                'hover:shadow-md hover:border-border',
                sub.fraudFlags.length > 0 && 'border-red-200 bg-red-50/30'
              )}
            >
              {/* Card body */}
              <div className="p-4">
                {/* Row 1: Avatar + name/handle + status */}
                <div className="flex items-start gap-3">
                  <Avatar name={sub.creatorName} size="md" className="shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-semibold text-sm leading-tight">{sub.creatorName}</p>
                          {sub.fraudFlags.length > 0 && (
                            <Badge variant="error" className="text-[10px] px-1.5 py-0">
                              <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                              {sub.fraudFlags.length}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{sub.creatorHandle}</p>
                      </div>
                      <StatusBadge status={sub.status} className="shrink-0" />
                    </div>

                    {/* Campaign name */}
                    <p className="text-xs text-muted-foreground mt-1.5 truncate">{sub.campaignName}</p>
                  </div>
                </div>

                {/* Row 2: Metric chips */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                    <Eye className="h-3 w-3 text-slate-400" />
                    {formatNumber(sub.metricsCurrent.views)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                    <Heart className="h-3 w-3 text-slate-400" />
                    {formatNumber(sub.metricsCurrent.likes)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                    <Trophy className="h-3 w-3 text-slate-400" />
                    #{sub.ranking}/{sub.totalRankEntries}
                  </span>
                  <span className="inline-flex items-center text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium uppercase tracking-wide">
                    {sub.verificationStage}
                  </span>
                </div>
              </div>

              {/* Card footer: payout + time */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 bg-slate-50/50 rounded-b-xl">
                <p className="text-base font-bold text-primary num-font">{formatCurrency(sub.projectedPayout)}</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs">{getRelativeTime(sub.submittedAt)}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
