import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Eye, Heart, ExternalLink, ChevronRight, Video } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { PageLoader } from '@/components/ui/PageLoader'
import { cn, formatCurrency, formatNumber, getRelativeTime } from '@/lib/utils'
import type { CreatorSubmissionItem } from '@/types'

interface Props {
  submissions: CreatorSubmissionItem[]
  isLoading: boolean
}

export function CreatorSubmissionsSection({ submissions, isLoading }: Props) {
  const navigate = useNavigate()

  if (isLoading) return <PageLoader />

  if (submissions.length === 0) {
    return (
      <EmptyState
        icon={Video}
        title="No submissions yet"
        description="This creator hasn't submitted any content yet."
      />
    )
  }

  return (
    <div className="space-y-2.5">
      {submissions.map(sub => (
        <motion.div
          key={sub.id}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.1 }}
        >
          <div
            onClick={() => navigate(`/submissions/${sub.id}`)}
            className={cn(
              'admin-card cursor-pointer transition-all',
              'hover:shadow-md hover:border-border',
              sub.fraudFlags.length > 0 && 'border-red-200 bg-red-50/30'
            )}
          >
            <div className="p-4">
              {/* Campaign name + status */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-semibold text-sm leading-tight">{sub.restaurantName}</p>
                    {sub.fraudFlags.length > 0 && (
                      <Badge variant="error" className="text-[10px] px-1.5 py-0">
                        <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                        {sub.fraudFlags.length}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Submitted {getRelativeTime(sub.submittedAt)}
                  </p>
                </div>
                <StatusBadge status={sub.status} className="shrink-0" />
              </div>

              {/* Metric chips */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                  <Eye className="h-3 w-3 text-slate-400" />
                  {formatNumber(sub.latestViews)}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                  <Heart className="h-3 w-3 text-slate-400" />
                  {formatNumber(sub.latestLikes)}
                </span>
                <span className="inline-flex items-center text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium uppercase tracking-wide">
                  {sub.verificationStage}
                </span>
              </div>
            </div>

            {/* Card footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 bg-slate-50/50 rounded-b-xl">
              <p className="text-base font-bold text-primary num-font">{formatCurrency(sub.projectedPayout)}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <a
                  href={sub.reelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />Reel
                </a>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
