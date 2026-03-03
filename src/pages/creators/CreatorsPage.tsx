import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, MapPin, Instagram, Users, UserCheck, Clock,
  AlertTriangle, ChevronRight, X, SlidersHorizontal,
  Wallet, TrendingUp,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { TrustScoreGauge } from '@/components/shared/TrustScoreGauge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'
import { MOCK_CREATORS } from '@/data/creators'

const KYC_OPTIONS = [
  { value: '', label: 'All KYC Status' },
  { value: 'verified', label: 'Verified' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' },
]
const ACCOUNT_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'flagged', label: 'Flagged' },
]
const CITY_OPTIONS = [
  { value: '', label: 'All Cities' },
  ...Array.from(new Set(MOCK_CREATORS.map(c => c.city))).map(c => ({ value: c, label: c })),
]

const STAT_CARDS = [
  { key: 'total',      label: 'Total',       icon: Users,         color: 'text-primary',     bg: 'bg-orange-50',  ring: 'ring-orange-300',  filterKey: '' as const,       filterValue: '' },
  { key: 'active',     label: 'Active',      icon: UserCheck,     color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-300', filterKey: 'status' as const, filterValue: 'active' },
  { key: 'kycPending', label: 'KYC Pending', icon: Clock,         color: 'text-amber-600',   bg: 'bg-amber-50',   ring: 'ring-amber-300',   filterKey: 'kyc' as const,    filterValue: 'pending' },
  { key: 'flagged',    label: 'Flagged',     icon: AlertTriangle, color: 'text-red-600',     bg: 'bg-red-50',     ring: 'ring-red-300',     filterKey: 'status' as const, filterValue: 'flagged' },
]

export function CreatorsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [kycFilter, setKycFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')

  const hasActiveFilters = !!(search || kycFilter || statusFilter || cityFilter)

  const clearFilters = () => {
    setSearch('')
    setKycFilter('')
    setStatusFilter('')
    setCityFilter('')
  }

  const filtered = useMemo(() => {
    return MOCK_CREATORS.filter(c => {
      const q = search.toLowerCase()
      if (q && !c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q) && !c.instagramHandle.toLowerCase().includes(q)) return false
      if (kycFilter && c.kycStatus !== kycFilter) return false
      if (statusFilter && c.accountStatus !== statusFilter) return false
      if (cityFilter && c.city !== cityFilter) return false
      return true
    })
  }, [search, kycFilter, statusFilter, cityFilter])

  const stats = useMemo(() => ({
    total: MOCK_CREATORS.length,
    active: MOCK_CREATORS.filter(c => c.accountStatus === 'active').length,
    kycPending: MOCK_CREATORS.filter(c => c.kycStatus === 'pending').length,
    flagged: MOCK_CREATORS.filter(c => c.accountStatus === 'flagged').length,
  }), [])

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

  return (
    <div className="space-y-5">
      <PageHeader
        title="Creators"
        subtitle={`${stats.total} total · ${stats.active} active${stats.flagged > 0 ? ` · ${stats.flagged} flagged` : ''}`}
      />

      {/* Stat cards — tap to filter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STAT_CARDS.map(s => {
          const Icon = s.icon
          const isActive =
            (s.filterKey === 'status' && statusFilter === s.filterValue) ||
            (s.filterKey === 'kyc' && kycFilter === s.filterValue)
          const value = stats[s.key as keyof typeof stats]

          return (
            <button
              key={s.key}
              onClick={() => handleStatClick(s.filterKey, s.filterValue)}
              className={cn(
                'admin-card p-4 text-left cursor-pointer transition-all active:scale-[0.97]',
                'hover:shadow-md',
                isActive ? `ring-2 ${s.ring} shadow-md` : 'ring-0'
              )}
            >
              <div className={cn('inline-flex p-2 rounded-xl mb-3', s.bg)}>
                <Icon className={cn('h-4 w-4', s.color)} />
              </div>
              <p className={cn('text-2xl font-bold num-font leading-none', s.color)}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1.5">{s.label}</p>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Search bar — full width with inline clear */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search by name, email, or handle…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Mobile: horizontal scroll city chips */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 sm:hidden" style={{ scrollbarWidth: 'none' }}>
          {CITY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setCityFilter(opt.value)}
              className={cn(
                'shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all',
                cityFilter === opt.value
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Desktop: select dropdowns */}
        <div className="hidden sm:flex gap-2 items-center">
          <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0" />
          <Select value={kycFilter} onValueChange={setKycFilter} options={KYC_OPTIONS} className="w-44 shrink-0" />
          <Select value={statusFilter} onValueChange={setStatusFilter} options={ACCOUNT_OPTIONS} className="w-40 shrink-0" />
          <Select value={cityFilter} onValueChange={setCityFilter} options={CITY_OPTIONS} className="w-40 shrink-0" />
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Results count + mobile clear */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {filtered.length} of {stats.total} creator{stats.total !== 1 ? 's' : ''}
        </p>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs font-medium text-primary sm:hidden">
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SlidersHorizontal}
          title="No creators found"
          description="Try adjusting your search or filters."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="space-y-2.5">
          {filtered.map(creator => (
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
                        <StatusBadge status={creator.accountStatus} className="shrink-0" />
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
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                      <TrendingUp className="h-3 w-3 text-slate-400" />
                      {creator.instagramMetrics.avgEngagement}%
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                      <Wallet className="h-3 w-3 text-slate-400" />
                      {formatCurrency(creator.lifetimeEarnings)}
                    </span>
                    <span className="inline-flex items-center text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                      {creator.approvedSubmissions}/{creator.totalSubmissions} approved
                    </span>
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
