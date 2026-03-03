import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Shared Chart Constants ────────────────────────────────
export const CHART_MARGIN = { top: 4, right: 4, bottom: 0, left: -10 }
export const TOOLTIP_STYLE = { fontSize: 12, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
export const TICK_PROPS = { fontSize: 10, fill: '#94a3b8' }

// ─── ChartCard ─────────────────────────────────────────────
interface ChartCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function ChartCard({ title, subtitle, children, className }: ChartCardProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200', className)}>
      <div className="px-5 pt-5 pb-3">
        <p className="font-bold text-sm">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-5 pb-5">{children}</div>
    </div>
  )
}

// ─── KpiCard ───────────────────────────────────────────────
export interface KpiCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
  bg: string
  trend?: { value: string; up: boolean }
}

export function KpiCard({ label, value, icon: Icon, color, bg, trend }: KpiCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className={cn('h-10 w-10 rounded-2xl flex items-center justify-center shrink-0', bg)}>
          <Icon className={cn('h-5 w-5', color)} />
        </div>
        {trend && (
          <div className={cn(
            'flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full',
            trend.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          )}>
            {trend.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className={cn('text-2xl font-bold num-font', color)}>{value}</p>
    </div>
  )
}
