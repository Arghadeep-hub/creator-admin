import { ChevronRight, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { SubmissionAdmin } from '@/types'

interface SubmissionsTabProps {
  submissions: SubmissionAdmin[]
  approved: number
  rejected: number
  pending: number
  onNavigate: (submissionId: string) => void
}

export default function SubmissionsTab({
  submissions,
  approved,
  rejected,
  pending,
  onNavigate,
}: SubmissionsTabProps) {
  if (submissions.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title="No submissions yet"
        description="Submissions will appear here once creators start participating."
      />
    )
  }

  return (
    <div className="space-y-3">
      {/* Status summary — 3 equal cards */}
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

      {/* Submission list */}
      <div className="space-y-2">
        {submissions.map((sub, i) => (
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
              <Avatar name={sub.creatorName} size="sm" />

              {/* Creator info */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-sm text-slate-900">{sub.creatorName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  @{sub.creatorHandle} · {new Date(sub.submittedAt).toLocaleDateString('en-IN')}
                </p>
              </div>

              {/* Payout + views */}
              <div className="shrink-0 text-right">
                <p className="num-font text-sm font-semibold text-primary">
                  {formatCurrency(sub.projectedPayout)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(sub.metricsCurrent.views)} views
                </p>
              </div>

              <StatusBadge status={sub.status} />

              {/* Arrow indicator — touch affordance */}
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
