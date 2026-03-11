import { Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SubmissionAdmin } from '@/types'

interface Props {
  sub: SubmissionAdmin
}

const TRUST_CHECKS = [
  { label: 'GPS Verified',      key: (s: SubmissionAdmin) =>  s.gpsVerified },
  { label: 'Bill Verified',     key: (s: SubmissionAdmin) =>  s.billVerified },
  { label: 'Post Not Deleted',  key: (s: SubmissionAdmin) => !s.postDeleted },
  { label: 'Caption Unchanged', key: (s: SubmissionAdmin) => !s.captionEdited },
  { label: 'Normal Engagement', key: (s: SubmissionAdmin) => !s.lowEngagement },
]

export default function TrustSignals({ sub }: Props) {
  const allOk = TRUST_CHECKS.every(({ key }) => key(sub))

  return (
    <div className="admin-card p-4">
      {/* Header with summary badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50">
            <Shield className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <h3 className="font-semibold text-sm">Trust Signals</h3>
        </div>
        <span className={cn(
          'text-[11px] font-semibold px-2.5 py-1 rounded-full',
          allOk
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-amber-100 text-amber-700'
        )}>
          {allOk ? '✓ All Passed' : '⚠ Review Needed'}
        </span>
      </div>

      {/* Check rows */}
      <div className="space-y-1.5">
        {TRUST_CHECKS.map(({ label, key }) => {
          const ok = key(sub)
          return (
            <div
              key={label}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg text-sm',
                ok ? 'bg-emerald-50/70' : 'bg-red-50'
              )}
            >
              <span className={cn('font-medium', ok ? 'text-slate-700' : 'text-red-700')}>
                {label}
              </span>
              {ok
                ? <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                : <XCircle className="h-4 w-4 text-red-500 shrink-0" />
              }
            </div>
          )
        })}
      </div>

      {/* Fraud flags */}
      {sub.fraudFlags.length > 0 && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0" />
            <p className="text-xs font-semibold text-red-700">
              {sub.fraudFlags.length} Fraud Flag{sub.fraudFlags.length > 1 ? 's' : ''} Detected
            </p>
          </div>
          <div className="space-y-1">
            {sub.fraudFlags.map((flag, i) => (
              <p key={i} className="text-xs text-red-600">• {flag}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
