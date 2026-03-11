import { lazy, Suspense, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Plus, SlidersHorizontal } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/contexts/ToastContext'
import { cn } from '@/lib/utils'
import {
  useGetCampaignsQuery,
  useDeleteCampaignMutation,
  useToggleCampaignStatusMutation,
} from '@/store/api/campaignsApi'
import type { CampaignAdmin } from '@/types'
import {
  getAttentionScore,
  getFillPercent,
  getCampaignDisplayStatus,
} from './campaigns.utils'
import type { CampaignSort } from './campaigns.utils'
import { CampaignFilterBar } from './_sections/CampaignFilterBar'
import { CampaignSpotlightCard } from './_sections/CampaignSpotlightCard'

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
  const { success, error } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'' | 'active' | 'inactive'>('')
  const [sortBy, setSortBy] = useState<CampaignSort>('attention')
  const [deleteTarget, setDeleteTarget] = useState<CampaignAdmin | null>(null)
  const [page, setPage] = useState(1)
  const limit = 50

  // Map UI status filter to API isActive param
  const isActiveParam = statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined

  // RTK Query
  const { data: campaignsData, isLoading, isError } = useGetCampaignsQuery({
    page,
    limit,
    search: search || undefined,
    isActive: isActiveParam,
  })
  const [deleteCampaign] = useDeleteCampaignMutation()
  const [toggleStatus] = useToggleCampaignStatusMutation()

  const campaigns = campaignsData?.data ?? []
  const total = campaignsData?.total ?? 0
  const summary = campaignsData?.summary

  const filtered = useMemo(() => {
    const sorted = [...campaigns]
    if (sortBy === 'attention') sorted.sort((a, b) => getAttentionScore(b) - getAttentionScore(a))
    if (sortBy === 'highest-payout') sorted.sort((a, b) => b.payoutMax - a.payoutMax)
    if (sortBy === 'highest-success') sorted.sort((a, b) => b.successRate - a.successRate)
    if (sortBy === 'deadline')
      sorted.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    if (sortBy === 'most-filled') sorted.sort((a, b) => getFillPercent(b) - getFillPercent(a))
    return sorted
  }, [campaigns, sortBy])

  const stats = useMemo(
    () => ({
      active:    campaigns.filter(c => getCampaignDisplayStatus(c) === 'active').length,
      inactive:  campaigns.filter(c => getCampaignDisplayStatus(c) === 'inactive').length,
      expired:   campaigns.filter(c => getCampaignDisplayStatus(c) === 'expired').length,
      attention: campaigns.filter(c => getCampaignDisplayStatus(c) === 'active' && getAttentionScore(c) >= 92).length,
    }),
    [campaigns],
  )

  const spotlight = useMemo(() => {
    const active = filtered.filter(c => getCampaignDisplayStatus(c) === 'active')
    if (active.length === 0) return null
    return [...active].sort((a, b) => getAttentionScore(b) - getAttentionScore(a))[0]
  }, [filtered])

  const hasActiveFilters = !!(search || statusFilter || sortBy !== 'attention')

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setSortBy('attention')
    setPage(1)
  }

  const handleStatusToggle = async (campaign: CampaignAdmin) => {
    const newIsActive = !campaign.isActive
    try {
      await toggleStatus({ id: campaign.id, body: { isActive: newIsActive } }).unwrap()
      success(
        newIsActive ? 'Campaign activated' : 'Campaign deactivated',
        campaign.restaurantName,
      )
    } catch (err: unknown) {
      const data = (err as { data?: { error?: string; message?: string } })?.data
      if (data?.error === 'insufficient_pool') {
        error(data.message ?? 'Insufficient pool balance to activate campaign', campaign.restaurantName)
      } else {
        error('Failed to update campaign status', campaign.restaurantName)
      }
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteCampaign(deleteTarget.id).unwrap()
      success('Campaign deleted', deleteTarget.restaurantName)
    } catch {
      error('Failed to delete campaign', deleteTarget.restaurantName)
    } finally {
      setDeleteTarget(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 pb-2">
        <div className="h-10 w-48 rounded bg-slate-200 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CampaignCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <EmptyState
        icon={SlidersHorizontal}
        title="Failed to load campaigns"
        description="There was an error loading campaigns. Please try again."
        actionLabel="Retry"
        onAction={() => setPage(1)}
      />
    )
  }

  return (
    <div className="space-y-4 pb-2">
      {/* Header */}
      <PageHeader
        title="Campaigns"
        subtitle={`${total} total · ${summary?.active ?? stats.active} active${stats.attention > 0 ? ` · ${stats.attention} need action` : ''}`}
      >
        <Button className="hidden sm:flex" onClick={() => navigate('/campaigns/new')}>
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </PageHeader>

      {/* Status filter chips */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:flex-wrap md:px-0 md:py-0.5">
        {[
          { label: 'All',      value: '' as const,         count: total,          color: 'text-slate-700 bg-white border-slate-200 hover:border-slate-300' },
          { label: 'Active',   value: 'active' as const,   count: summary?.active ?? stats.active,   color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { label: 'Inactive', value: 'inactive' as const, count: summary?.inactive ?? stats.inactive, color: 'text-slate-600 bg-slate-100 border-slate-200' },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => { setStatusFilter(s.value); setPage(1) }}
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
        <CampaignSpotlightCard
          spotlight={spotlight}
          onEdit={() => navigate(`/campaigns/${spotlight.id}/edit`)}
          onOpen={() => navigate(`/campaigns/${spotlight.id}`)}
        />
      )}

      {/* Search + sort */}
      <CampaignFilterBar
        search={search}
        sortBy={sortBy}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={val => { setSearch(val); setPage(1) }}
        onSortChange={setSortBy}
        onClearFilters={clearFilters}
      />

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
                onStatusToggle={() => handleStatusToggle(campaign)}
              />
            ))}
          </div>
        </Suspense>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.restaurantName}"?`}
        description="This action cannot be undone. All associated submissions and data will be archived."
        confirmLabel="Delete Campaign"
        variant="destructive"
        onConfirm={handleDelete}
      />

      {/* FAB — mobile only */}
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
