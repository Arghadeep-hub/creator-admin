import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Instagram, Users, UserCheck, Clock, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { TrustScoreGauge } from '@/components/shared/TrustScoreGauge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
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

  const stats = {
    total: MOCK_CREATORS.length,
    active: MOCK_CREATORS.filter(c => c.accountStatus === 'active').length,
    kycPending: MOCK_CREATORS.filter(c => c.kycStatus === 'pending').length,
    flagged: MOCK_CREATORS.filter(c => c.accountStatus === 'flagged').length,
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Creators"
        subtitle={`${stats.total} total creators`}
      />

      {/* Stats Row — all cards are actionable filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: Users, iconColor: 'text-primary', iconBg: 'bg-orange-50', filterKey: '' as const, filterValue: '' },
          { label: 'Active', value: stats.active, icon: UserCheck, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50', filterKey: 'status' as const, filterValue: 'active' },
          { label: 'KYC Pending', value: stats.kycPending, icon: Clock, iconColor: 'text-amber-600', iconBg: 'bg-amber-50', filterKey: 'kyc' as const, filterValue: 'pending' },
          { label: 'Flagged', value: stats.flagged, icon: AlertTriangle, iconColor: 'text-red-600', iconBg: 'bg-red-50', filterKey: 'status' as const, filterValue: 'flagged' },
        ].map(s => {
          const Icon = s.icon
          const isActive =
            (s.filterKey === 'status' && statusFilter === s.filterValue) ||
            (s.filterKey === 'kyc' && kycFilter === s.filterValue)

          return (
            <button
              key={s.label}
              onClick={() => {
                if (s.filterKey === 'status') {
                  setStatusFilter(prev => prev === s.filterValue ? '' : s.filterValue)
                  setKycFilter('')
                } else if (s.filterKey === 'kyc') {
                  setKycFilter(prev => prev === s.filterValue ? '' : s.filterValue)
                  setStatusFilter('')
                } else {
                  clearFilters()
                }
              }}
              className={cn(
                'admin-card p-4 text-left cursor-pointer hover:shadow-md transition-all flex items-center gap-3',
                isActive && 'ring-2 ring-primary/30 shadow-md'
              )}
            >
              <div className={cn('rounded-lg p-2 shrink-0', s.iconBg)}>
                <Icon className={cn('h-4 w-4', s.iconColor)} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={cn('text-2xl font-bold num-font', s.iconColor)}>{s.value}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search by name, email, or handle..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={kycFilter} onValueChange={setKycFilter} options={KYC_OPTIONS} className="w-44" />
        <Select value={statusFilter} onValueChange={setStatusFilter} options={ACCOUNT_OPTIONS} className="w-40" />
        <Select value={cityFilter} onValueChange={setCityFilter} options={CITY_OPTIONS} className="w-40" />
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            Clear all
          </Button>
        )}
      </div>

      {/* Results count inline */}
      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {stats.total} creator{stats.total !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No creators found"
          description="Try adjusting your search or filters."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Creator', 'City', 'Instagram', 'KYC', 'Trust', 'Earnings', 'Submissions', 'Status'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(creator => (
                  <tr
                    key={creator.id}
                    className={cn(
                      'hover:bg-slate-50/50 cursor-pointer transition-colors',
                      creator.accountStatus === 'flagged' && 'bg-red-50/40 hover:bg-red-50/60'
                    )}
                    onClick={() => navigate(`/creators/${creator.id}`)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={creator.name} size="sm" />
                        <div>
                          <p className="font-medium">{creator.name}</p>
                          <p className="text-xs text-muted-foreground">{creator.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                        <MapPin className="h-3.5 w-3.5" />{creator.city}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium">{creator.instagramHandle}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Instagram className="h-3 w-3" />{formatNumber(creator.instagramFollowers)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={creator.kycStatus} />
                    </td>
                    <td className="py-3 px-4">
                      <TrustScoreGauge score={creator.trustScore} size="sm" showLabel={false} />
                    </td>
                    <td className="py-3 px-4 num-font">
                      <p className="font-semibold text-primary">{formatCurrency(creator.walletBalance)}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(creator.lifetimeEarnings)} lifetime</p>
                    </td>
                    <td className="py-3 px-4 num-font">
                      <p>{creator.totalSubmissions}</p>
                      <p className="text-xs text-emerald-600">{creator.approvedSubmissions} approved</p>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={creator.accountStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
