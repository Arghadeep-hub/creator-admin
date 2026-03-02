import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Wifi, WifiOff, MapPin, Instagram } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { TrustScoreGauge } from '@/components/shared/TrustScoreGauge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatCurrency, formatNumber } from '@/lib/utils'
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

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-primary', bg: 'bg-orange-50' },
          { label: 'Active', value: stats.active, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'KYC Pending', value: stats.kycPending, color: 'text-amber-600', bg: 'bg-amber-50', action: () => setKycFilter('pending') },
          { label: 'Flagged', value: stats.flagged, color: 'text-red-600', bg: 'bg-red-50', action: () => setStatusFilter('flagged') },
        ].map(s => (
          <button
            key={s.label}
            onClick={s.action}
            className={`admin-card p-4 text-left ${s.action ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
          >
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold num-font mt-1 ${s.color}`}>{s.value}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search creators..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={kycFilter} onValueChange={setKycFilter} options={KYC_OPTIONS} className="w-44" />
        <Select value={statusFilter} onValueChange={setStatusFilter} options={ACCOUNT_OPTIONS} className="w-40" />
        <Select value={cityFilter} onValueChange={setCityFilter} options={CITY_OPTIONS} className="w-40" />
        <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No creators found"
          description="Try adjusting your filters."
          actionLabel="Clear Filters"
          onAction={() => { setSearch(''); setKycFilter(''); setStatusFilter(''); setCityFilter('') }}
        />
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Creator', 'City', 'Instagram', 'KYC', 'Trust Score', 'Wallet', 'Submissions', 'Status', ''].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(creator => (
                  <tr
                    key={creator.id}
                    className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`creators/${creator.id}`)}
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
                      <div className="flex items-center gap-1.5">
                        {creator.instagramConnected
                          ? <Wifi className="h-3.5 w-3.5 text-emerald-500" />
                          : <WifiOff className="h-3.5 w-3.5 text-slate-400" />
                        }
                        <span className="text-xs">@{creator.instagramHandle}</span>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
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
                    <td className="py-3 px-4">
                      <button
                        className="text-xs text-primary hover:underline cursor-pointer"
                        onClick={e => { e.stopPropagation(); navigate(`creators/${creator.id}`) }}
                      >
                        View →
                      </button>
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
