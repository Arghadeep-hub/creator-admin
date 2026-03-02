import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  subValue?: string
  trend?: number
  trendLabel?: string
  icon?: LucideIcon
  iconColor?: string
  iconBg?: string
  highlight?: boolean
  className?: string
  badge?: React.ReactNode
}

export function StatCard({
  label,
  value,
  subValue,
  trend,
  trendLabel,
  icon: Icon,
  iconColor = 'text-primary',
  iconBg = 'bg-orange-50',
  highlight,
  className,
  badge,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <div
      className={cn(
        'admin-card p-5 relative overflow-hidden',
        highlight && 'ring-2 ring-primary/20',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground font-medium truncate">{label}</p>
          <p className="text-2xl font-bold num-font mt-1 text-foreground">{value}</p>
          {subValue && (
            <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
          )}
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <TrendIcon
                className={cn('h-3.5 w-3.5', isPositive ? 'text-emerald-500' : 'text-red-500')}
              />
              <span
                className={cn(
                  'text-xs font-medium',
                  isPositive ? 'text-emerald-600' : 'text-red-600'
                )}
              >
                {isPositive ? '+' : ''}{trend.toFixed(1)}%
              </span>
              {trendLabel && (
                <span className="text-xs text-muted-foreground">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {Icon && (
            <div className={cn('rounded-xl p-2.5', iconBg)}>
              <Icon className={cn('h-5 w-5', iconColor)} />
            </div>
          )}
          {badge}
        </div>
      </div>
    </div>
  )
}
