import { Clock, CheckCircle, Eye, Heart, MessageCircle } from 'lucide-react'
import { formatNumber, getRelativeTime } from '@/lib/utils'
import type { SubmissionAdmin } from '@/types'

interface Props {
  sub: SubmissionAdmin
}

export default function VerificationTimeline({ sub }: Props) {
  return (
    <div className="admin-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-slate-100">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
        </div>
        <h3 className="font-semibold text-sm">Verification Timeline</h3>
      </div>

      {/* Timeline */}
      <div className="relative">
        {sub.metricsTimeline.length > 1 && (
          <div className="absolute left-2.25 top-3 bottom-3 w-0.5 bg-slate-100 rounded-full" />
        )}
        <div className="space-y-4">
          {sub.metricsTimeline.map((point, i) => (
            <div key={i} className="flex gap-3">
              {/* Dot */}
              <div className="relative z-10 h-5 w-5 rounded-full bg-white border-2 border-primary/40 shrink-0 flex items-center justify-center mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary/70" />
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm">{point.label}</span>
                  <span className="text-[11px] text-muted-foreground shrink-0">{getRelativeTime(point.timestamp)}</span>
                </div>
                <div className="flex gap-3 mt-1.5">
                  <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-500">
                    <Eye className="h-3 w-3" />{formatNumber(point.views)}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-500">
                    <Heart className="h-3 w-3" />{formatNumber(point.likes)}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-500">
                    <MessageCircle className="h-3 w-3" />{formatNumber(point.comments)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage completion chips */}
      {Object.entries(sub.stageTimestamps).some(([, v]) => v) && (
        <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap gap-2">
          {Object.entries(sub.stageTimestamps).filter(([, v]) => v).map(([stage, ts]) => (
            <div key={stage} className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 rounded-full px-2.5 py-1 text-[11px] font-semibold">
              <CheckCircle className="h-3 w-3" />
              <span className="uppercase">{stage}</span>
              <span className="text-emerald-500 font-normal">
                {new Date(ts!).toLocaleString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
