import { AlertTriangle, CheckCircle, Clock, Video } from 'lucide-react'
import { cn } from '@/lib/utils'

const STAT_CARDS = [
  { key: 'PENDING',  label: 'Pending',  icon: Clock,         color: 'text-amber-600',   bg: 'bg-amber-50',   ring: 'ring-amber-300'   },
  { key: 'APPROVED', label: 'Approved', icon: CheckCircle,   color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-300' },
  { key: 'REJECTED', label: 'Rejected', icon: AlertTriangle, color: 'text-red-600',     bg: 'bg-red-50',     ring: 'ring-red-300'     },
  { key: 'PAID',     label: 'Paid',     icon: Video,         color: 'text-blue-600',    bg: 'bg-blue-50',    ring: 'ring-blue-300'    },
]

interface Stats {
  PENDING: number
  APPROVED: number
  REJECTED: number
  PAID: number
}

interface SubmissionStatsCardsProps {
  stats: Stats
  statusFilter: string
  onStatusFilterChange: (key: string) => void
}

export function SubmissionStatsCards({ stats, statusFilter, onStatusFilterChange }: SubmissionStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {STAT_CARDS.map(s => {
        const Icon = s.icon
        const isActive = statusFilter === s.key
        const value = stats[s.key as keyof Stats]
        return (
          <button
            key={s.key}
            onClick={() => onStatusFilterChange(statusFilter === s.key ? '' : s.key)}
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
