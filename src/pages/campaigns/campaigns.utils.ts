import type { CampaignAdmin } from '@/types'

export const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'Restaurant', label: 'Restaurant' },
  { value: 'Fitness', label: 'Fitness' },
  { value: 'Beauty', label: 'Beauty' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Education', label: 'Education' },
  { value: 'Other', label: 'Other' },
]

export type CampaignSort = 'attention' | 'highest-payout' | 'highest-success' | 'deadline' | 'most-filled'

export const SORT_OPTIONS: Array<{ value: CampaignSort; label: string }> = [
  { value: 'attention', label: 'Needs Attention First' },
  { value: 'highest-payout', label: 'Highest Payout' },
  { value: 'highest-success', label: 'Best Approval Rate' },
  { value: 'deadline', label: 'Ending Soon' },
  { value: 'most-filled', label: 'Most Filled Spots' },
]

export const CATEGORY_EMOJI: Record<string, string> = {
  Restaurant: '🍽️',
  Fitness: '💪',
  Beauty: '💅',
  Fashion: '👗',
  Travel: '✈️',
  Education: '📚',
  Other: '🏷️',
}

export const DIFFICULTY_COLOR: Record<string, string> = {
  EASY: 'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HARD: 'bg-red-100 text-red-700',
}

/**
 * Derive a display status from the campaign's isActive flag and deadline.
 * - 'expired'  → deadline has passed (regardless of isActive)
 * - 'active'   → isActive: true AND deadline in future
 * - 'inactive' → isActive: false AND deadline in future
 */
export type CampaignDisplayStatus = 'active' | 'inactive' | 'expired'

export const getCampaignDisplayStatus = (campaign: CampaignAdmin): CampaignDisplayStatus => {
  const isExpired = new Date(campaign.deadline) <= new Date()
  if (isExpired) return 'expired'
  return campaign.isActive ? 'active' : 'inactive'
}

export const getHoursLeft = (deadline: string) =>
  Math.floor((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60))

export const getFillPercent = (campaign: CampaignAdmin) =>
  campaign.totalSpots === 0
    ? 0
    : Math.round(((campaign.totalSpots - campaign.spotsLeft) / campaign.totalSpots) * 100)

export const getUrgencyMeta = (campaign: CampaignAdmin) => {
  const displayStatus = getCampaignDisplayStatus(campaign)
  const hoursLeft = getHoursLeft(campaign.deadline)

  if (displayStatus === 'expired' || hoursLeft <= 0)
    return { label: 'Expired', badgeClass: 'bg-slate-200 text-slate-700', helperClass: 'text-slate-500', priority: 12 }
  if (displayStatus === 'inactive')
    return { label: 'Inactive', badgeClass: 'bg-slate-200 text-slate-700', helperClass: 'text-slate-500', priority: 26 }
  if (campaign.spotsLeft <= 3)
    return { label: `${campaign.spotsLeft} spots left`, badgeClass: 'bg-red-100 text-red-700', helperClass: 'text-red-600', priority: 100 }
  if (hoursLeft <= 48)
    return { label: `${hoursLeft}h left`, badgeClass: 'bg-amber-100 text-amber-700', helperClass: 'text-amber-700', priority: 90 }
  return {
    label: `${Math.max(1, Math.ceil(hoursLeft / 24))}d left`,
    badgeClass: 'bg-slate-100 text-slate-700',
    helperClass: 'text-slate-600',
    priority: 58,
  }
}

export const getAttentionScore = (campaign: CampaignAdmin) => {
  const displayStatus = getCampaignDisplayStatus(campaign)
  if (displayStatus === 'inactive') return 44
  if (displayStatus === 'expired') return 20
  const urgency = getUrgencyMeta(campaign).priority
  const lowSuccess = campaign.successRate > 0 && campaign.successRate < 75 ? 18 : 0
  const almostFull = campaign.spotsLeft <= 5 ? 14 : 0
  return urgency + lowSuccess + almostFull
}

/**
 * Returns a human-readable countdown string for a deadline.
 * e.g. "2d 5h left", "3h 12m left", "14m left", "Expired"
 */
export const getDeadlineCountdown = (deadline: string): string => {
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h ${mins}m left`
  return `${mins}m left`
}

/** Icon key for each sort option — maps to lucide icon names */
export const SORT_ICON_MAP: Record<CampaignSort, string> = {
  attention: 'AlertTriangle',
  'highest-payout': 'DollarSign',
  'highest-success': 'TrendingUp',
  deadline: 'Clock',
  'most-filled': 'Users',
}
