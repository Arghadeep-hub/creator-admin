import type { LucideIcon } from 'lucide-react'

export type DashboardPeriod = '7d' | '30d' | '90d'
export type InsightTone = 'success' | 'warning' | 'critical' | 'info'

export const PIE_COLORS = ['#10b981', '#0ea5e9', '#f97316', '#ef4444']

export const PERIOD_OPTIONS: Array<{ value: DashboardPeriod; label: string; days: number; hint: string }> = [
  { value: '7d', label: '7 Days', days: 7, hint: 'Short-term triage' },
  { value: '30d', label: '30 Days', days: 30, hint: 'Balanced operations' },
  { value: '90d', label: '90 Days', days: 90, hint: 'Strategic view' },
]

export const TONE_STYLES: Record<InsightTone, { bg: string; icon: string; value: string; border: string; gradient: string }> = {
  success:  { bg: 'bg-emerald-50', icon: 'text-emerald-600', value: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-500 to-emerald-600' },
  warning:  { bg: 'bg-amber-50',   icon: 'text-amber-600',   value: 'text-amber-700',   border: 'border-amber-200',   gradient: 'from-amber-500 to-amber-600'   },
  critical: { bg: 'bg-red-50',     icon: 'text-red-600',     value: 'text-red-700',     border: 'border-red-200',     gradient: 'from-red-500 to-red-600'       },
  info:     { bg: 'bg-blue-50',    icon: 'text-blue-600',    value: 'text-blue-700',    border: 'border-blue-200',    gradient: 'from-blue-500 to-blue-600'     },
}

export function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function toAbsolutePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

export interface QuickAction {
  label: string
  description: string
  icon: LucideIcon
  href: string
  tone: InsightTone
  count: number
}

export interface OperationalStat {
  icon: LucideIcon
  label: string
  value: string
  numericValue: number
  helper: string
  tone: InsightTone
}
