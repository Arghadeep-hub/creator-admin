import {
  CheckCircle, XCircle, Shield, AlertTriangle,
  Calendar, Clock,
} from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { TrustScoreGauge } from '@/components/shared/TrustScoreGauge'
import { Button } from '@/components/ui/button'
import { cn, getRelativeTime } from '@/lib/utils'
import type { CreatorAdmin } from '@/types'

interface Props {
  creator: CreatorAdmin
  isUpdatingKyc: boolean
  isSuperAdmin: boolean
  onVerifyKyc: () => void
  onRejectKyc: () => void
}

export function CreatorKycSection({
  creator,
  isUpdatingKyc,
  isSuperAdmin,
  onVerifyKyc,
  onRejectKyc,
}: Props) {
  return (
    <div className="space-y-4">

      {/* Trust Score card */}
      <div className="admin-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Trust Score</h3>
        <div className="flex flex-col items-center gap-2">
          <TrustScoreGauge score={creator.trustScore} size="lg" />
          <p className="text-xs text-muted-foreground text-center mt-1">
            {creator.trustScore >= 80 ? 'Excellent — Highly trustworthy' :
             creator.trustScore >= 60 ? 'Good — Reliable creator' :
             creator.trustScore >= 40 ? 'Fair — Needs monitoring' :
             'Poor — Requires review'}
          </p>
        </div>
      </div>

      {/* KYC Verification */}
      <div className={cn(
        'admin-card overflow-hidden',
        creator.kycStatus === 'PENDING' && 'ring-1 ring-amber-200',
        creator.kycStatus === 'SUBMITTED' && 'ring-1 ring-amber-200',
      )}>
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-foreground">KYC Verification</h3>
          <StatusBadge status={creator.kycStatus} />
        </div>
        <div className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-lg p-2.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">PAN</p>
              <p className="font-mono font-medium text-xs mt-0.5">{creator.kycRecords?.[0]?.panNumber ?? '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Aadhaar</p>
              <p className="font-mono font-medium text-xs mt-0.5">
                {creator.kycRecords?.[0]?.aadhaarLast4 ? `XXXX-${creator.kycRecords[0].aadhaarLast4}` : '—'}
              </p>
            </div>
          </div>
          {isSuperAdmin && (creator.kycStatus === 'PENDING' || creator.kycStatus === 'SUBMITTED') && (
            <div className="flex gap-2">
              <Button className="flex-1 h-9" onClick={onVerifyKyc} disabled={isUpdatingKyc}>
                <CheckCircle className="h-3.5 w-3.5" />
                Verify
              </Button>
              <Button variant="destructive" className="flex-1 h-9" onClick={onRejectKyc} disabled={isUpdatingKyc}>
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="admin-card p-4 space-y-3 text-sm">
        <h3 className="text-sm font-semibold text-foreground">Account</h3>
        <div className="space-y-2.5">
          {[
            { label: 'Joined', value: new Date(creator.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), icon: Calendar },
            ...(creator.lastActiveAt ? [{ label: 'Last Active', value: getRelativeTime(creator.lastActiveAt), icon: Clock }] : []),
            ...(creator.assignedAdmin ? [{ label: 'Assigned Admin', value: creator.assignedAdmin, icon: Shield }] : []),
          ].map(row => {
            const Icon = row.icon
            return (
              <div key={row.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />{row.label}
                </span>
                <span className="font-medium">{row.value}</span>
              </div>
            )
          })}
        </div>
        {creator.flagReason && (
          <div className="bg-red-50 rounded-lg p-3 border border-red-100 mt-2">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
              <p className="text-xs font-semibold text-red-700">Flag Reason</p>
            </div>
            <p className="text-xs text-red-600">{creator.flagReason}</p>
          </div>
        )}
      </div>
    </div>
  )
}
