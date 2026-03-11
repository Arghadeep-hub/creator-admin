import { Users, UserCheck, Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const STAT_CARDS = [
  { key: 'total',      label: 'Total',       icon: Users,         color: 'text-primary',     bg: 'bg-orange-50',  ring: 'ring-orange-300',  filterKey: '' as const,       filterValue: '' },
  { key: 'active',     label: 'Active',      icon: UserCheck,     color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-300', filterKey: 'status' as const, filterValue: 'active' },
  { key: 'kycPending', label: 'KYC Pending', icon: Clock,         color: 'text-amber-600',   bg: 'bg-amber-50',   ring: 'ring-amber-300',   filterKey: 'kyc' as const,    filterValue: 'pending' },
  { key: 'flagged',    label: 'Flagged',     icon: AlertTriangle, color: 'text-red-600',     bg: 'bg-red-50',     ring: 'ring-red-300',     filterKey: 'status' as const, filterValue: 'flagged' },
]

interface Stats {
  total: number
  active: number
  kycPending: number
  flagged: number
}

interface CreatorStatsCardsProps {
  stats: Stats
  statusFilter: string
  kycFilter: string
  onStatClick: (filterKey: string, filterValue: string) => void
}

export function CreatorStatsCards({ stats, statusFilter, kycFilter, onStatClick }: CreatorStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {STAT_CARDS.map(s => {
        const Icon = s.icon
        const isActive =
          (s.filterKey === 'status' && statusFilter === s.filterValue) ||
          (s.filterKey === 'kyc' && kycFilter === s.filterValue)
        const value = stats[s.key as keyof Stats]

        return (
          <button
            key={s.key}
            onClick={() => onStatClick(s.filterKey, s.filterValue)}
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
  )
}
