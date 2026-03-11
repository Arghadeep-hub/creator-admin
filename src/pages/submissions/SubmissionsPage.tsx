import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ChevronRight, Eye, Heart } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { PageLoader } from '@/components/ui/PageLoader'
import { cn, formatCurrency, formatNumber, getRelativeTime } from '@/lib/utils'
import { useGetSubmissionsQuery } from '@/store/api/submissionsApi'
import { SubmissionStatsCards } from './_sections/SubmissionStatsCards'
import { SubmissionFilterBar } from './_sections/SubmissionFilterBar'

export function SubmissionsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [page] = useState(1)
  const [limit] = useState(100)

  const hasActiveFilters = !!(search || statusFilter || stageFilter)

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setStageFilter('')
  }

  const { data, isLoading, isError, refetch } = useGetSubmissionsQuery({
    page,
    limit,
    search: search || undefined,
    status: statusFilter ? (statusFilter.toLowerCase() as 'pending' | 'approved' | 'rejected' | 'paid') : undefined,
    verificationStage: stageFilter ? (stageFilter as 't0' | 'h24' | 'h72' | 'completed') : undefined,
  })

  const submissions = data?.data ?? []
  const total = data?.total ?? 0

  // Compute stat counts from loaded data
  const stats = {
    total,
    PENDING:  submissions.filter(s => s.status === 'PENDING').length,
    APPROVED: submissions.filter(s => s.status === 'APPROVED').length,
    REJECTED: submissions.filter(s => s.status === 'REJECTED').length,
    PAID:     submissions.filter(s => s.status === 'PAID').length,
  }

  if (isLoading) return <PageLoader />
  if (isError) return (
    <EmptyState
      title="Failed to load submissions"
      description="Unable to fetch submission data. Please try again."
      actionLabel="Retry"
      onAction={refetch}
    />
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="Submissions"
        subtitle={`${total} total submissions`}
      />

      <SubmissionStatsCards
        stats={stats}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <SubmissionFilterBar
        search={search}
        statusFilter={statusFilter}
        stageFilter={stageFilter}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onStageFilterChange={setStageFilter}
        onClearFilters={clearFilters}
      />

      {/* Results count + mobile clear */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {submissions.length} of {total} result{total !== 1 ? 's' : ''}
        </p>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs font-medium text-primary sm:hidden">
            Clear filters
          </button>
        )}
      </div>

      {submissions.length === 0 ? (
        <EmptyState
          title="No submissions found"
          description="Try adjusting your search or filters."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="space-y-2.5">
          {submissions.map(sub => (
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
                  <Avatar name={sub.creator?.name ?? 'Unknown'} size="md" className="shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-semibold text-sm leading-tight">{sub.creator?.name}</p>
                          {sub.fraudFlags.length > 0 && (
                            <Badge variant="error" className="text-[10px] px-1.5 py-0">
                              <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                              {sub.fraudFlags.length}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{sub.creator?.instagramHandle}</p>
                      </div>
                      <StatusBadge status={sub.status} className="shrink-0" />
                    </div>

                    {/* Campaign name */}
                    <p className="text-xs text-muted-foreground mt-1.5 truncate">{sub.campaign?.restaurantName}</p>
                  </div>
                </div>

                {/* Row 2: Metric chips */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(() => {
                    const latest = sub.submissionMetrics?.[sub.submissionMetrics.length - 1]
                    return (
                      <>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                          <Eye className="h-3 w-3 text-slate-400" />
                          {formatNumber(latest?.views ?? 0)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                          <Heart className="h-3 w-3 text-slate-400" />
                          {formatNumber(latest?.likes ?? 0)}
                        </span>
                      </>
                    )
                  })()}
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
