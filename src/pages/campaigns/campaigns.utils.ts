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
  Easy: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-red-100 text-red-700',
}

export const getHoursLeft = (deadline: string) =>
  Math.floor((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60))

export const getFillPercent = (campaign: CampaignAdmin) =>
  campaign.totalSpots === 0
    ? 0
    : Math.round(((campaign.totalSpots - campaign.spotsLeft) / campaign.totalSpots) * 100)

export const getApprovalRate = (campaign: CampaignAdmin) =>
  campaign.totalSubmissions === 0
    ? 0
    : Math.round((campaign.approvedSubmissions / campaign.totalSubmissions) * 100)

export const getUrgencyMeta = (campaign: CampaignAdmin) => {
  const hoursLeft = getHoursLeft(campaign.deadline)

  if (campaign.status === 'expired' || hoursLeft <= 0)
    return { label: 'Expired', badgeClass: 'bg-slate-200 text-slate-700', helperClass: 'text-slate-500', priority: 12 }
  if (campaign.status === 'draft')
    return { label: 'Draft', badgeClass: 'bg-slate-200 text-slate-700', helperClass: 'text-slate-500', priority: 26 }
  if (campaign.status === 'paused')
    return { label: 'Paused', badgeClass: 'bg-amber-100 text-amber-700', helperClass: 'text-amber-700', priority: 40 }
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
  if (campaign.status === 'paused') return 72
  if (campaign.status === 'draft') return 44
  if (campaign.status === 'expired') return 20
  const urgency = getUrgencyMeta(campaign).priority
  const lowSuccess = campaign.successRate > 0 && campaign.successRate < 75 ? 18 : 0
  const lowApproval = campaign.totalSubmissions > 0 && getApprovalRate(campaign) < 70 ? 16 : 0
  const almostFull = campaign.spotsLeft <= 5 ? 14 : 0
  return urgency + lowSuccess + lowApproval + almostFull
}
