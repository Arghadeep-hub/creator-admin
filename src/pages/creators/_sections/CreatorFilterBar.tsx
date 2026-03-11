import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { cn } from '@/lib/utils'

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

interface CreatorFilterBarProps {
  search: string
  kycFilter: string
  statusFilter: string
  cityFilter: string
  cityOptions: { value: string; label: string }[]
  hasActiveFilters: boolean
  onSearchChange: (value: string) => void
  onKycFilterChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onCityFilterChange: (value: string) => void
  onClearFilters: () => void
}

export function CreatorFilterBar({
  search,
  kycFilter,
  statusFilter,
  cityFilter,
  cityOptions,
  hasActiveFilters,
  onSearchChange,
  onKycFilterChange,
  onStatusFilterChange,
  onCityFilterChange,
  onClearFilters,
}: CreatorFilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Search bar — full width with inline clear */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <Input
          placeholder="Search by name, email, or handle…"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Mobile: horizontal scroll city chips */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 sm:hidden" style={{ scrollbarWidth: 'none' }}>
        {cityOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => onCityFilterChange(opt.value)}
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
        <Select value={kycFilter} onValueChange={onKycFilterChange} options={KYC_OPTIONS} className="w-44 shrink-0" />
        <Select value={statusFilter} onValueChange={onStatusFilterChange} options={ACCOUNT_OPTIONS} className="w-40 shrink-0" />
        <Select value={cityFilter} onValueChange={onCityFilterChange} options={cityOptions} className="w-40 shrink-0" />
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground">
            Clear all
          </Button>
        )}
      </div>
    </div>
  )
}
