import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'PAID', label: 'Paid' },
]

const STAGE_OPTIONS = [
  { value: '', label: 'All Stages', chip: 'All' },
  { value: 't0', label: 'T0 (Initial)', chip: 'T0' },
  { value: 'h24', label: '24h Check', chip: '24h' },
  { value: 'h72', label: '72h Final', chip: '72h' },
  { value: 'completed', label: 'Completed', chip: 'Done' },
]

interface SubmissionFilterBarProps {
  search: string
  statusFilter: string
  stageFilter: string
  hasActiveFilters: boolean
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onStageFilterChange: (value: string) => void
  onClearFilters: () => void
}

export function SubmissionFilterBar({
  search,
  statusFilter,
  stageFilter,
  hasActiveFilters,
  onSearchChange,
  onStatusFilterChange,
  onStageFilterChange,
  onClearFilters,
}: SubmissionFilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Search bar — full width with inline clear */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <Input
          placeholder="Search creator, campaign, ID…"
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

      {/* Mobile: horizontal scroll stage chips */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 sm:hidden" style={{ scrollbarWidth: 'none' }}>
        {STAGE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onStageFilterChange(opt.value)}
            className={cn(
              'shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all',
              stageFilter === opt.value
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            )}
          >
            {opt.chip}
          </button>
        ))}
      </div>

      {/* Desktop: select dropdowns */}
      <div className="hidden sm:flex gap-2 items-center">
        <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0" />
        <Select value={statusFilter} onValueChange={onStatusFilterChange} options={STATUS_OPTIONS} className="w-40 shrink-0" />
        <Select value={stageFilter} onValueChange={onStageFilterChange} options={STAGE_OPTIONS} className="w-40 shrink-0" />
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground">
            Clear all
          </Button>
        )}
      </div>
    </div>
  )
}
