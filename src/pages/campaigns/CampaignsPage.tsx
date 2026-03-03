import { lazy, Suspense, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowRight, Pencil, Plus, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useToast } from '@/contexts/ToastContext'
import { cn, formatCurrency } from '@/lib/utils'
import { MOCK_CAMPAIGNS } from '@/data/campaigns'
import type { CampaignAdmin } from '@/types'
import {
  CATEGORY_OPTIONS,
  SORT_OPTIONS,
  getAttentionScore,
  getFillPercent,
} from './campaigns.utils'
import type { CampaignSort } from './campaigns.utils'

const CampaignCard = lazy(() => import('./CampaignCard'))

function CampaignCardSkeleton() {
  return (
    <div className="admin-card-elevated animate-pulse overflow-hidden bg-white">
      <div className="h-40 bg-slate-200 sm:h-32" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-200" />
        <div className="h-1.5 rounded-full bg-slate-200" />
        <div className="flex gap-1.5">
          <div className="h-6 w-20 rounded-full bg-slate-200" />
          <div className="h-6 w-20 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  )
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

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setCategoryFilter('')
    setSortBy('attention')
  }

  return (
    <div className="space-y-4 pb-2">
      {/* Header — hide "New Campaign" on mobile (FAB handles it) */}
      <PageHeader
        title="Campaigns"
        subtitle={`${MOCK_CAMPAIGNS.length} total · ${stats.active} active${stats.attention > 0 ? ` · ${stats.attention} need action` : ''}`}
      >
        <Button className="hidden sm:flex" onClick={() => navigate('/campaigns/new')}>
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </PageHeader>

      {/* Status filter chips — edge-to-edge horizontal scroll on mobile */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:flex-wrap md:px-0 md:py-0.5">
        {[
          { label: 'All',     value: '',        count: MOCK_CAMPAIGNS.length, color: 'text-slate-700 bg-white border-slate-200 hover:border-slate-300' },
          { label: 'Active',  value: 'active',  count: stats.active,          color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { label: 'Draft',   value: 'draft',   count: stats.draft,           color: 'text-slate-600 bg-slate-100 border-slate-200' },
          { label: 'Paused',  value: 'paused',  count: stats.paused,          color: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Expired', value: 'expired', count: stats.expired,         color: 'text-gray-500 bg-gray-50 border-gray-200' },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(s.value)}
            className={cn(
              'flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all',
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
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm text-red-700">
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
              'flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:gap-4',
              isHighAttention
                ? 'border-red-200 bg-red-50'
                : 'border-orange-200 bg-linear-to-r from-orange-50 via-amber-50 to-orange-50',
            )}
          >
            {/* Icon + text */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                  isHighAttention ? 'bg-red-100' : 'bg-orange-100',
                )}
              >
                {isHighAttention ? (
                  <AlertTriangle className="h-4.5 w-4.5 text-red-600" />
                ) : (
                  <Sparkles className="h-4.5 w-4.5 text-orange-600" />
                )}
              </div>
              <div className="min-w-0">
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
            </div>

            {/* CTAs — full-width row on mobile, inline on sm+ */}
            <div className="flex gap-2 sm:shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => navigate(`/campaigns/${spotlight.id}/edit`)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() => navigate(`/campaigns/${spotlight.id}`)}
              >
                Open <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search + filters — stacked on mobile */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            {/* Search — always full width */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search campaigns, business, city…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Selects + clear — side-by-side on mobile */}
            <div className="flex items-center gap-2">
              <div className="flex-1 sm:w-44 sm:flex-none">
                <Select value={categoryFilter} onValueChange={setCategoryFilter} options={CATEGORY_OPTIONS} />
              </div>
              <div className="flex-1 sm:w-52 sm:flex-none">
                <Select
                  value={sortBy}
                  onValueChange={value => setSortBy(value as CampaignSort)}
                  options={SORT_OPTIONS}
                />
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" className="shrink-0" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
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
          onAction={clearFilters}
        />
      ) : (
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CampaignCardSkeleton key={i} />
              ))}
            </div>
          }
        >
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
        </Suspense>
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

      {/* FAB — mobile only, floats above bottom nav */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => navigate('/campaigns/new')}
        className="fixed bottom-[calc(var(--mobile-nav-height)+1rem)] right-4 z-30 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-orange-500/30 transition-shadow hover:shadow-orange-500/40 sm:hidden"
        aria-label="New Campaign"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </motion.button>
    </div>
  )
}
