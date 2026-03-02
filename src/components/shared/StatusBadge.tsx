import { Badge } from '@/components/ui/badge'
import type { BadgeProps } from '@/components/ui/badge'

type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'paid'
type CampaignStatus = 'draft' | 'active' | 'paused' | 'expired'
type PayoutStatus = 'locked' | 'processing' | 'paid' | 'failed'
type KycStatus = 'pending' | 'verified' | 'rejected'
type AccountStatus = 'active' | 'inactive' | 'flagged'

type StatusType = SubmissionStatus | CampaignStatus | PayoutStatus | KycStatus | AccountStatus

const statusConfig: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
  // Submission
  pending:    { label: 'Pending',    variant: 'warning' },
  approved:   { label: 'Approved',   variant: 'success' },
  rejected:   { label: 'Rejected',   variant: 'error' },
  paid:       { label: 'Paid',       variant: 'info' },
  // Campaign
  draft:      { label: 'Draft',      variant: 'gray' },
  active:     { label: 'Active',     variant: 'success' },
  paused:     { label: 'Paused',     variant: 'warning' },
  expired:    { label: 'Expired',    variant: 'gray' },
  // Payout
  locked:     { label: 'Locked',     variant: 'orange' },
  processing: { label: 'Processing', variant: 'info' },
  failed:     { label: 'Failed',     variant: 'error' },
  // KYC
  verified:   { label: 'Verified',   variant: 'success' },
  // Account
  inactive:   { label: 'Inactive',   variant: 'gray' },
  flagged:    { label: 'Flagged',    variant: 'error' },
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = statusConfig[status] ?? { label: status, variant: 'gray' as const }
  return <Badge variant={cfg.variant} className={className}>{cfg.label}</Badge>
}
