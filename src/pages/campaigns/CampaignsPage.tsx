import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  MapPin,
  MoreVertical,
  Pause,
  Pencil,
  Play,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/contexts/ToastContext'
import { cn, formatCurrency } from '@/lib/utils'
import { MOCK_CAMPAIGNS } from '@/data/campaigns'
import type { CampaignAdmin } from '@/types'

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'Restaurant', label: 'Restaurant' },
  { value: 'Fitness', label: 'Fitness' },
  { value: 'Beauty', label: 'Beauty' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Education', label: 'Education' },
  { value: 'Other', label: 'Other' },
]

type CampaignSort = 'attention' | 'highest-payout' | 'highest-success' | 'deadline' | 'most-filled'

const SORT_OPTIONS: Array<{ value: CampaignSort; label: string }> = [
  { value: 'attention', label: 'Needs Attention First' },
  { value: 'highest-payout', label: 'Highest Payout' },
  { value: 'highest-success', label: 'Best Approval Rate' },
  { value: 'deadline', label: 'Ending Soon' },
  { value: 'most-filled', label: 'Most Filled Spots' },
]

const CATEGORY_EMOJI: Record<string, string> = {
  Restaurant: '🍽️',
  Fitness: '💪',
  Beauty: '💅',
  Fashion: '👗',
  Travel: '✈️',
  Education: '📚',
  Other: '🏷️',
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-red-100 text-red-700',
}

const getHoursLeft = (deadline: string) =>
  Math.floor((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60))

const getFillPercent = (campaign: CampaignAdmin) =>
  campaign.totalSpots === 0
    ? 0
    : Math.round(((campaign.totalSpots - campaign.spotsLeft) / campaign.totalSpots) * 100)

const getApprovalRate = (campaign: CampaignAdmin) =>
  campaign.totalSubmissions === 0
    ? 0
    : Math.round((campaign.approvedSubmissions / campaign.totalSubmissions) * 100)

const getUrgencyMeta = (campaign: CampaignAdmin) => {
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

const getAttentionScore = (campaign: CampaignAdmin) => {
  if (campaign.status === 'paused') return 72
  if (campaign.status === 'draft') return 44
  if (campaign.status === 'expired') return 20
  const urgency = getUrgencyMeta(campaign).priority
  const lowSuccess = campaign.successRate > 0 && campaign.successRate < 75 ? 18 : 0
  const lowApproval = campaign.totalSubmissions > 0 && getApprovalRate(campaign) < 70 ? 16 : 0
  const almostFull = campaign.spotsLeft <= 5 ? 14 : 0
  return urgency + lowSuccess + lowApproval + almostFull
}

export function CampaignsPage() {
  const navigate = useNavigate()
  const { success } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState<CampaignSort>('attention')
  const [deleteTarget, setDeleteTarget] = useState<CampaignAdmin | null>(null)

  const filtered = useMemo(() => {
    const base = MOCK_CAMPAIGNS.filter(c => {
      const q = search.toLowerCase()
      if (
        q &&
        !c.name.toLowerCase().includes(q) &&
        !c.businessName.toLowerCase().includes(q) &&
        !c.city.toLowerCase().includes(q)
      )
        return false
      if (statusFilter && c.status !== statusFilter) return false
      if (categoryFilter && c.category !== categoryFilter) return false
      return true
    })
    const sorted = [...base]
    if (sortBy === 'attention') sorted.sort((a, b) => getAttentionScore(b) - getAttentionScore(a))
    if (sortBy === 'highest-payout') sorted.sort((a, b) => b.payoutMax - a.payoutMax)
    if (sortBy === 'highest-success') sorted.sort((a, b) => b.successRate - a.successRate)
    if (sortBy === 'deadline')
      sorted.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    if (sortBy === 'most-filled') sorted.sort((a, b) => getFillPercent(b) - getFillPercent(a))
    return sorted
  }, [search, statusFilter, categoryFilter, sortBy])

  const stats = useMemo(
    () => ({
      active: MOCK_CAMPAIGNS.filter(c => c.status === 'active').length,
      draft: MOCK_CAMPAIGNS.filter(c => c.status === 'draft').length,
      paused: MOCK_CAMPAIGNS.filter(c => c.status === 'paused').length,
      expired: MOCK_CAMPAIGNS.filter(c => c.status === 'expired').length,
      attention: MOCK_CAMPAIGNS.filter(c => c.status === 'active' && getAttentionScore(c) >= 92).length,
    }),
    [],
  )

  const spotlight = useMemo(() => {
    const active = filtered.filter(c => c.status === 'active')
    if (active.length === 0) return null
    return [...active].sort((a, b) => getAttentionScore(b) - getAttentionScore(a))[0]
  }, [filtered])

  const isHighAttention = spotlight ? getAttentionScore(spotlight) >= 92 : false
  const hasActiveFilters = !!(search || statusFilter || categoryFilter || sortBy !== 'attention')

  return (
    <div className="space-y-5 pb-2">
      <PageHeader
        title="Campaigns"
        subtitle={`${MOCK_CAMPAIGNS.length} total · ${stats.active} active${stats.attention > 0 ? ` · ${stats.attention} need action` : ''}`}
      >
        <Button onClick={() => navigate('/campaigns/new')}>
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </PageHeader>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'All', value: '', count: MOCK_CAMPAIGNS.length, color: 'text-slate-700 bg-white border-slate-200 hover:border-slate-300' },
          { label: 'Active', value: 'active', count: stats.active, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { label: 'Draft', value: 'draft', count: stats.draft, color: 'text-slate-600 bg-slate-100 border-slate-200' },
          { label: 'Paused', value: 'paused', count: stats.paused, color: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Expired', value: 'expired', count: stats.expired, color: 'text-gray-500 bg-gray-50 border-gray-200' },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(s.value)}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all',
              s.color,
              statusFilter === s.value
                ? 'ring-2 ring-primary/25 ring-offset-1 shadow-sm opacity-100'
                : 'opacity-75 hover:opacity-100',
            )}
          >
            <span className="num-font font-bold tabular-nums">{s.count}</span>
            <span>{s.label}</span>
          </button>
        ))}
        {stats.attention > 0 && (
          <span className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm text-red-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="font-semibold">{stats.attention} need action</span>
          </span>
        )}
      </div>

      {/* Priority spotlight */}
      {spotlight && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <div
            className={cn(
              'flex items-center gap-4 rounded-xl border p-4',
              isHighAttention
                ? 'border-red-200 bg-red-50'
                : 'border-orange-200 bg-linear-to-r from-orange-50 via-amber-50 to-orange-50',
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                isHighAttention ? 'bg-red-100' : 'bg-orange-100',
              )}
            >
              {isHighAttention ? (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              ) : (
                <Sparkles className="h-5 w-5 text-orange-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'text-[11px] font-bold uppercase tracking-wider',
                  isHighAttention ? 'text-red-600' : 'text-orange-600',
                )}
              >
                {isHighAttention ? 'Priority Action Required' : 'Campaign Spotlight'}
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">{spotlight.name}</p>
              <p className="text-xs text-slate-600">
                {spotlight.businessName} · {spotlight.city} ·{' '}
                {formatCurrency(spotlight.payoutMin)}–{formatCurrency(spotlight.payoutMax)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate(`/campaigns/${spotlight.id}/edit`)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button size="sm" onClick={() => navigate(`/campaigns/${spotlight.id}`)}>
                Open <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search + filters */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-52 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by campaign, business, or city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-44">
              <Select value={categoryFilter} onValueChange={setCategoryFilter} options={CATEGORY_OPTIONS} />
            </div>
            <div className="w-52">
              <Select
                value={sortBy}
                onValueChange={value => setSortBy(value as CampaignSort)}
                options={SORT_OPTIONS}
              />
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('')
                  setStatusFilter('')
                  setCategoryFilter('')
                  setSortBy('attention')
                }}
              >
                Clear all
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        {hasActiveFilters && ' · filtered'}
      </p>

      {/* Campaign grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={SlidersHorizontal}
          title="No campaigns found"
          description="Try adjusting your filters or search query."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('')
            setStatusFilter('')
            setCategoryFilter('')
            setSortBy('attention')
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onView={() => navigate(`/campaigns/${campaign.id}`)}
              onEdit={() => navigate(`/campaigns/${campaign.id}/edit`)}
              onDelete={() => setDeleteTarget(campaign)}
              onStatusToggle={() =>
                success(
                  campaign.status === 'active' ? 'Campaign paused' : 'Campaign activated',
                  campaign.name,
                )
              }
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This action cannot be undone. All associated submissions and data will be archived."
        confirmLabel="Delete Campaign"
        variant="destructive"
        onConfirm={() => success('Campaign deleted', deleteTarget?.name)}
      />
    </div>
  )
}

interface CampaignCardProps {
  campaign: CampaignAdmin
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  onStatusToggle: () => void
}

function CampaignCard({ campaign, onView, onEdit, onDelete, onStatusToggle }: CampaignCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const spotsPercent = getFillPercent(campaign)
  const urgency = getUrgencyMeta(campaign)
  const isAlmostFull = campaign.spotsLeft <= 3
  const isAtRisk = campaign.status === 'active' && getAttentionScore(campaign) >= 92

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
      <div
        className="admin-card-elevated group cursor-pointer overflow-hidden bg-white"
        onClick={onView}
      >
        {/* Image header */}
        <div className="relative h-32">
          {imageFailed ? (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-orange-100 via-amber-50 to-slate-100 text-5xl">
              {CATEGORY_EMOJI[campaign.category] ?? CATEGORY_EMOJI.Other}
            </div>
          ) : (
            <img
              src={campaign.businessLogo}
              alt={campaign.businessName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              onError={() => setImageFailed(true)}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-900/20 to-transparent" />

          {/* Top left: status + risk badge */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <StatusBadge status={campaign.status} />
            {isAtRisk && (
              <Badge className="bg-red-100 text-red-700">
                <AlertTriangle className="h-3 w-3" />
                Attention
              </Badge>
            )}
          </div>

          {/* Top right: urgency + menu */}
          <div className="absolute right-3 top-3 flex items-start gap-2">
            <Badge className={urgency.badgeClass}>{urgency.label}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="cursor-pointer rounded-lg bg-white/90 p-1.5 text-slate-700 shadow-sm backdrop-blur hover:bg-white"
                  onClick={e => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={e => { e.stopPropagation(); onView() }}>
                  <Eye className="mr-2 h-4 w-4" />View Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={e => { e.stopPropagation(); onEdit() }}>
                  <Pencil className="mr-2 h-4 w-4" />Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={e => { e.stopPropagation(); onStatusToggle() }}>
                  {campaign.status === 'active' ? (
                    <><Pause className="mr-2 h-4 w-4" />Pause</>
                  ) : (
                    <><Play className="mr-2 h-4 w-4" />Activate</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={e => { e.stopPropagation(); onDelete() }}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Bottom overlay: name + location */}
          <div className="absolute bottom-3 left-3 right-16">
            <p className="truncate text-sm font-semibold text-white">{campaign.name}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-white/70">
              <MapPin className="h-3 w-3" />
              {campaign.businessName} · {campaign.city}
            </p>
          </div>
        </div>

        {/* Card body */}
        <div className="space-y-3 p-4">
          {/* Payout + difficulty */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Payout range</p>
              <p className="num-font text-base font-bold text-slate-900">
                {formatCurrency(campaign.payoutMin)} – {formatCurrency(campaign.payoutMax)}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Base {formatCurrency(campaign.payoutBase)}
              </p>
            </div>
            <Badge className={DIFFICULTY_COLOR[campaign.difficulty]}>{campaign.difficulty}</Badge>
          </div>

          {/* Spots fill bar */}
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Users className="h-3 w-3 text-orange-500" />
                {campaign.totalSpots - campaign.spotsLeft}/{campaign.totalSpots} spots filled
              </span>
              <span className={isAlmostFull ? 'font-semibold text-red-600' : 'text-slate-500'}>
                {campaign.spotsLeft} left
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  isAlmostFull
                    ? 'bg-linear-to-r from-red-500 to-rose-500'
                    : 'bg-linear-to-r from-orange-500 to-amber-500',
                )}
                style={{ width: `${spotsPercent}%` }}
              />
            </div>
          </div>

          {/* Metric pills */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
              <Timer className="h-3 w-3 text-orange-500" />
              {campaign.estimatedVisitTimeMins}m visit
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
              <TrendingUp className="h-3 w-3 text-orange-500" />
              {campaign.successRate}% success
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
              <CheckCircle2 className="h-3 w-3 text-orange-500" />
              {campaign.totalSubmissions} submitted
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <div className="text-xs">
              <p className={cn('font-medium', urgency.helperClass)}>{urgency.label}</p>
              <p className="mt-0.5 text-slate-400">Paid out {formatCurrency(campaign.totalPaidOut)}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); onEdit() }}>
                <Pencil className="h-3 w-3" />
                Edit
              </Button>
              <Button size="sm" onClick={e => { e.stopPropagation(); onView() }}>
                Open
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
