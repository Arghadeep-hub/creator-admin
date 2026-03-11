import { useState } from 'react'
import { ChevronRight, Filter, Inbox, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'
import type { SubmissionAdmin } from '@/types'

interface SubmissionsTabProps {
  submissions: SubmissionAdmin[]
  approved: number
  rejected: number
  pending: number
  onNavigate: (submissionId: string) => void
}

type StatusFilter = 'ALL' | 'APPROVED' | 'PAID' | 'PENDING' | 'REJECTED'

const FILTER_CHIPS: { value: StatusFilter; label: string; color: string; activeColor: string }[] = [
  { value: 'ALL',      label: 'All',      color: 'bg-slate-100 text-slate-600',   activeColor: 'bg-slate-800 text-white' },
  { value: 'APPROVED', label: 'Approved',  color: 'bg-emerald-50 text-emerald-600', activeColor: 'bg-emerald-600 text-white' },
  { value: 'PAID',     label: 'Paid',      color: 'bg-blue-50 text-blue-600',     activeColor: 'bg-blue-600 text-white' },
  { value: 'PENDING',  label: 'Pending',   color: 'bg-amber-50 text-amber-600',   activeColor: 'bg-amber-500 text-white' },
  { value: 'REJECTED', label: 'Rejected',  color: 'bg-red-50 text-red-600',       activeColor: 'bg-red-600 text-white' },
]

/* -- Visual summary bar showing approval distribution -- */
function SubmissionSummaryBar({ approved, pending, rejected, total }: { approved: number; pending: number; rejected: number; total: number }) {
  if (total === 0) return null
  const approvedPct = (approved / total) * 100
  const pendingPct = (pending / total) * 100
  const rejectedPct = (rejected / total) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{total} total submissions</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />{approved} approved</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" />{pending} pending</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400" />{rejected} rejected</span>
        </div>
      </div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        {approvedPct > 0 && (
          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${approvedPct}%` }} />
        )}
        {pendingPct > 0 && (
          <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${pendingPct}%` }} />
        )}
        {rejectedPct > 0 && (
          <div className="h-full bg-red-400 transition-all duration-500" style={{ width: `${rejectedPct}%` }} />
        )}
      </div>
    </div>
  )
}

export default function SubmissionsTab({
  submissions,
  approved,
  rejected,
  pending,
  onNavigate,
}: SubmissionsTabProps) {
  const [filter, setFilter] = useState<StatusFilter>('ALL')

  const filteredSubmissions = filter === 'ALL'
    ? submissions
    : submissions.filter(s => s.status === filter)

  if (submissions.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title="No submissions yet"
        description="Submissions will appear here once creators start participating."
      />
    )
  }

  const total = approved + pending + rejected

  return (
    <div className="space-y-3">
      {/* Visual summary bar */}
      <div className="admin-card p-4">
        <SubmissionSummaryBar approved={approved} pending={pending} rejected={rejected} total={total} />
      </div>

      {/* Status summary -- 3 equal cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Approved', count: approved, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { label: 'Pending',  count: pending,  color: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Rejected', count: rejected, color: 'text-red-700 bg-red-50 border-red-200' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
            <p className="num-font text-2xl font-bold">{s.count}</p>
            <p className="mt-0.5 text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <Filter className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        {FILTER_CHIPS.map(chip => (
          <button
            key={chip.value}
            onClick={() => setFilter(chip.value)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer',
              filter === chip.value ? chip.activeColor : chip.color,
            )}
          >
            {chip.label}
            {chip.value !== 'ALL' && (
              <span className="ml-1 opacity-70">
                {submissions.filter(s => chip.value === 'ALL' ? true : s.status === chip.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Submission list */}
      {filteredSubmissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Inbox className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-700">No {filter.toLowerCase()} submissions</p>
          <p className="mt-1 text-xs text-muted-foreground">Try a different filter to see results.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSubmissions.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.18 }}
            >
              <div
                className="admin-card flex min-h-18 cursor-pointer items-center gap-3 px-4 py-3 transition-shadow active:bg-slate-50 hover:shadow-md"
                onClick={() => onNavigate(sub.id)}
              >
                <Avatar name={sub.creator?.name ?? 'Unknown'} size="sm" />

                {/* Creator info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-sm text-slate-900">{sub.creator?.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    @{sub.creator?.instagramHandle} · {new Date(sub.submittedAt).toLocaleDateString('en-IN')}
                  </p>
                </div>

                {/* Payout + views */}
                <div className="shrink-0 text-right">
                  <p className="num-font text-sm font-semibold text-primary">
                    {formatCurrency(sub.projectedPayout)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(sub.submissionMetrics?.[sub.submissionMetrics.length - 1]?.views ?? 0)} views
                  </p>
                </div>

                <StatusBadge status={sub.status} />

                {/* Arrow indicator -- touch affordance */}
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
