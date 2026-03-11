import { Badge } from '@/components/ui/badge'
import type { BadgeProps } from '@/components/ui/badge'

type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID'
type CampaignStatus = 'active' | 'inactive' | 'expired'
type PayoutStatus = 'LOCKED' | 'PROCESSING' | 'PAID' | 'FAILED' | 'locked' | 'processing' | 'paid' | 'failed'
type KycStatus = 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED'
type AccountStatus = 'active' | 'inactive' | 'flagged'

type StatusType = SubmissionStatus | CampaignStatus | PayoutStatus | KycStatus | AccountStatus

const statusConfig: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
  // Submission (UPPERCASE from API)
  PENDING:    { label: 'Pending',    variant: 'warning' },
  APPROVED:   { label: 'Approved',   variant: 'success' },
  REJECTED:   { label: 'Rejected',   variant: 'error' },
  PAID:       { label: 'Paid',       variant: 'info' },
  // Campaign (derived display status)
  active:     { label: 'Active',     variant: 'success' },
  inactive:   { label: 'Inactive',   variant: 'gray' },
  expired:    { label: 'Expired',    variant: 'gray' },
  // Payout statuses (lowercase from API)
  locked:     { label: 'Locked',     variant: 'orange' },
  processing: { label: 'Processing', variant: 'info' },
  failed:     { label: 'Failed',     variant: 'error' },
  // Payout statuses (uppercase fallback)
  LOCKED:     { label: 'Locked',     variant: 'orange' },
  PROCESSING: { label: 'Processing', variant: 'info' },
  FAILED:     { label: 'Failed',     variant: 'error' },
  // KYC (UPPERCASE from API)
  SUBMITTED:  { label: 'Submitted',  variant: 'warning' },
  VERIFIED:   { label: 'Verified',   variant: 'success' },
  // Account
  flagged:    { label: 'Flagged',    variant: 'error' },
}

interface StatusBadgeProps {
  status: StatusType | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = statusConfig[status] ?? { label: status, variant: 'gray' as const }
  return <Badge variant={cfg.variant} className={className}>{cfg.label}</Badge>
}
