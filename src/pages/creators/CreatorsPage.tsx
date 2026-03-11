import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Instagram,
  AlertTriangle, ChevronRight, SlidersHorizontal,
  Wallet, TrendingUp,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { TrustScoreGauge } from '@/components/shared/TrustScoreGauge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { PageLoader } from '@/components/ui/PageLoader'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'
import { useGetCreatorsQuery } from '@/store/api/creatorsApi'
import { CreatorStatsCards } from './_sections/CreatorStatsCards'
import { CreatorFilterBar } from './_sections/CreatorFilterBar'

export function CreatorsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [kycFilter, setKycFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [page] = useState(1)
  const [limit] = useState(100)

  const hasActiveFilters = !!(search || kycFilter || statusFilter || cityFilter)

  const clearFilters = () => {
    setSearch('')
    setKycFilter('')
    setStatusFilter('')
    setCityFilter('')
  }

  const { data, isLoading, isError, refetch } = useGetCreatorsQuery({
    page,
    limit,
    search: search || undefined,
    kycStatus: (kycFilter as 'pending' | 'verified' | 'rejected') || undefined,
    accountStatus: (statusFilter as 'active' | 'inactive' | 'flagged') || undefined,
    city: cityFilter || undefined,
  })

  const creators = useMemo(() => data?.data ?? [], [data])
  const total = data?.total ?? 0

  const stats = useMemo(() => ({
    total,
    active: creators.filter(c => c.accountStatus === 'active').length,
    kycPending: creators.filter(c => c.kycStatus === 'PENDING' || c.kycStatus === 'SUBMITTED').length,
    flagged: creators.filter(c => c.accountStatus === 'flagged').length,
  }), [creators, total])

  // Unique cities from loaded data for filter chips
  const cityOptions = useMemo(() => {
    const cities = Array.from(new Set(creators.map(c => c.city).filter((c): c is string => c != null)))
    return [
      { value: '', label: 'All Cities' },
      ...cities.map(c => ({ value: c, label: c })),
    ]
  }, [creators])

  const handleStatClick = (filterKey: string, filterValue: string) => {
    if (filterKey === 'status') {
      setStatusFilter(prev => prev === filterValue ? '' : filterValue)
      setKycFilter('')
    } else if (filterKey === 'kyc') {
      setKycFilter(prev => prev === filterValue ? '' : filterValue)
      setStatusFilter('')
    } else {
      clearFilters()
    }
  }

  if (isLoading) return <PageLoader />
  if (isError) return (
    <EmptyState
      title="Failed to load creators"
      description="Unable to fetch creator data. Please try again."
      actionLabel="Retry"
      onAction={refetch}
    />
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="Creators"
        subtitle={`${stats.total} total · ${stats.active} active${stats.flagged > 0 ? ` · ${stats.flagged} flagged` : ''}`}
      />

      <CreatorStatsCards
        stats={stats}
        statusFilter={statusFilter}
        kycFilter={kycFilter}
        onStatClick={handleStatClick}
      />

      <CreatorFilterBar
        search={search}
        kycFilter={kycFilter}
        statusFilter={statusFilter}
        cityFilter={cityFilter}
        cityOptions={cityOptions}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onKycFilterChange={setKycFilter}
        onStatusFilterChange={setStatusFilter}
        onCityFilterChange={setCityFilter}
        onClearFilters={clearFilters}
      />

      {/* Results count + mobile clear */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {creators.length} of {stats.total} creator{stats.total !== 1 ? 's' : ''}
        </p>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs font-medium text-primary sm:hidden">
            Clear filters
          </button>
        )}
      </div>

      {creators.length === 0 ? (
        <EmptyState
          icon={SlidersHorizontal}
          title="No creators found"
          description="Try adjusting your search or filters."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="space-y-2.5">
          {creators.map(creator => (
            <motion.div
              key={creator.id}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.1 }}
            >
              <div
                onClick={() => navigate(`/creators/${creator.id}`)}
                className={cn(
                  'admin-card cursor-pointer transition-all',
                  'hover:shadow-md hover:border-border',
                  creator.accountStatus === 'flagged' && 'border-red-200 bg-red-50/30'
                )}
              >
                {/* Card body */}
                <div className="p-4">
                  {/* Row 1: Avatar + name/handle + status */}
                  <div className="flex items-start gap-3">
                    <Avatar name={creator.name} size="md" className="shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-semibold text-sm leading-tight">{creator.name}</p>
                            {creator.accountStatus === 'flagged' && (
                              <Badge variant="error" className="text-[10px] px-1.5 py-0">
                                <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                                Flagged
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{creator.email}</p>
                        </div>
                        <StatusBadge status={creator.accountStatus ?? 'inactive'} className="shrink-0" />
                      </div>

                      {/* Location + Instagram handle */}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{creator.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Instagram className="h-3 w-3" />{creator.instagramHandle}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Metric chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                      <Instagram className="h-3 w-3 text-pink-400" />
                      {formatNumber(creator.instagramFollowers)}
                    </span>
                    {creator.avgEngagement != null && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                        <TrendingUp className="h-3 w-3 text-slate-400" />
                        {creator.avgEngagement}%
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                      <Wallet className="h-3 w-3 text-slate-400" />
                      {formatCurrency(creator.lifetimeEarnings)}
                    </span>
                    {creator.reelsDone != null && (
                      <span className="inline-flex items-center text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                        {creator.reelsDone} reels
                      </span>
                    )}
                    <StatusBadge status={creator.kycStatus} className="text-[10px]" />
                  </div>
                </div>

                {/* Card footer: trust + earnings + chevron */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 bg-slate-50/50 rounded-b-xl">
                  <div className="flex items-center gap-3">
                    <TrustScoreGauge score={creator.trustScore} size="sm" showLabel={false} />
                    <div>
                      <p className="text-xs text-muted-foreground">Trust Score</p>
                      <p className="text-sm font-bold num-font">{creator.trustScore}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-base font-bold text-primary num-font">{formatCurrency(creator.walletBalance)}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">balance</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
