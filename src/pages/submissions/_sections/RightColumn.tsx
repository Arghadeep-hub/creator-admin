import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, DollarSign, Trophy, FileText, ExternalLink } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { TrustScoreGauge } from '@/components/shared/TrustScoreGauge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/contexts/ToastContext'
import { cn, formatCurrency } from '@/lib/utils'
import type { SubmissionAdmin, CreatorAdmin } from '@/types'
import { useReviewSubmissionMutation } from '@/store/api/submissionsApi'

interface Props {
  sub: SubmissionAdmin
  creator: CreatorAdmin | null
}

export default function RightColumn({ sub, creator }: Props) {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [reviewSubmission, { isLoading: isReviewing }] = useReviewSubmissionMutation()

  async function handleApprove() {
    try {
      await reviewSubmission({ id: sub.id, body: { action: 'approve' } }).unwrap()
      success('Submission approved!', `Payout of ${formatCurrency(sub.projectedPayout)} queued`)
    } catch {
      error('Failed to approve submission')
    }
  }

  async function handleReject() {
    if (!rejectionReason) return
    try {
      await reviewSubmission({ id: sub.id, body: { action: 'reject', rejectionReason } }).unwrap()
      error('Submission rejected', rejectionReason)
      setShowRejectForm(false)
      setRejectionReason('')
    } catch {
      error('Failed to reject submission')
    }
  }

  return (
    <div className="space-y-3">

      {/* ── Decision Panel ──────────────────────────────────────────────── */}
      {sub.status === 'PENDING' && (
        <div className="admin-card overflow-hidden">
          <div className="h-1 bg-linear-to-r from-emerald-400 to-emerald-500" />
          <div className="p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Review Decision
            </p>

            {/* Approve */}
            <button
              onClick={handleApprove}
              disabled={isReviewing}
              className="w-full flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-semibold rounded-xl px-4 py-3 transition-all text-sm mb-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Approve & Queue Payout</span>
              <span className="num-font text-emerald-100 text-sm shrink-0">{formatCurrency(sub.projectedPayout)}</span>
            </button>

            {/* Reject */}
            {!showRejectForm ? (
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={isReviewing}
                className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 active:scale-[0.98] font-semibold rounded-xl px-4 py-2.5 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <XCircle className="h-4 w-4" />Reject Submission
              </button>
            ) : (
              <div className="space-y-2">
                <Textarea
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="Reason for rejection…"
                  rows={3}
                  className="resize-none text-sm"
                />
                <div className="flex gap-2">
                  <button
                    disabled={!rejectionReason || isReviewing}
                    onClick={handleReject}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-all"
                  >
                    Confirm Reject
                  </button>
                  <Button variant="outline" size="sm" onClick={() => setShowRejectForm(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Payout Breakdown ────────────────────────────────────────────── */}
      <div className="admin-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-emerald-50">
            <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-sm">Payout Breakdown</h3>
        </div>

        <div className="space-y-2 text-sm">
          {[
            { label: 'Base Payout',       val: formatCurrency(sub.payoutBase),                          color: '' },
            { label: 'Engagement Bonus',  val: `+${formatCurrency(sub.payoutEngagementBonus)}`,         color: 'text-emerald-600' },
            { label: 'Trust Bonus',       val: `+${formatCurrency(sub.payoutTrustBonus)}`,              color: 'text-emerald-600' },
            ...(sub.payoutPenalties < 0
              ? [{ label: 'Penalties', val: formatCurrency(sub.payoutPenalties), color: 'text-red-600' }]
              : []),
          ].map(({ label, val, color }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-muted-foreground text-xs">{label}</span>
              <span className={cn('num-font font-medium text-xs', color)}>{val}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
          <span className="font-semibold text-sm">Total Projected</span>
          <span className="text-xl font-bold text-primary num-font">{formatCurrency(sub.projectedPayout)}</span>
        </div>

        {sub.finalPayout && (
          <div className="mt-2 flex items-center justify-between">
            <span className="font-semibold text-sm">Final Payout</span>
            <span className="text-xl font-bold text-emerald-600 num-font">{formatCurrency(sub.finalPayout)}</span>
          </div>
        )}
      </div>

      {/* ── Leaderboard Rank ────────────────────────────────────────────── */}
      <div className="admin-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-amber-50">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <h3 className="font-semibold text-sm">Campaign Rank</h3>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold num-font text-primary leading-none">N/A</p>
            <p className="text-xs text-muted-foreground mt-1">ranking not available</p>
          </div>
        </div>
      </div>

      {/* ── Creator Quick Profile ────────────────────────────────────────── */}
      {creator && (
        <div className="admin-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={creator.name} size="md" className="shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight">{creator.name}</p>
              <p className="text-xs text-muted-foreground">{creator.instagramHandle}</p>
            </div>
            <StatusBadge status={creator.kycStatus} />
          </div>
          <TrustScoreGauge score={creator.trustScore} size="sm" />
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 gap-1.5"
            onClick={() => navigate(`/creators/${creator.id}`)}
          >
            <ExternalLink className="h-3.5 w-3.5" />View Full Profile
          </Button>
        </div>
      )}

      {/* ── Bill Verification ───────────────────────────────────────────── */}
      <div className="admin-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-100">
              <FileText className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <h3 className="font-semibold text-sm">Bill Verification</h3>
          </div>
          <StatusBadge status={sub.billVerified ? 'VERIFIED' : 'PENDING'} />
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          Bill <span className="font-mono text-slate-700">#{sub.billNumber}</span>
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => success('Bill verified')}
            className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-semibold rounded-lg px-3 py-2 text-xs transition-all"
          >
            <CheckCircle className="h-3.5 w-3.5" />Verify
          </button>
          <button
            onClick={() => error('Bill rejected')}
            className="flex items-center justify-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 active:scale-[0.98] font-semibold rounded-lg px-3 py-2 text-xs transition-all"
          >
            <XCircle className="h-3.5 w-3.5" />Reject
          </button>
        </div>
      </div>
    </div>
  )
}
