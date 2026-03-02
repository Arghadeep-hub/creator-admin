import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  Users, Megaphone, Video, Wallet, AlertTriangle, Clock,
  CheckCircle, ArrowRight, Flame, ShieldAlert, FileSearch, Sparkles, ArrowUpRight,
  Lock, Send, Banknote,
} from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn, formatCurrency, formatNumber, getRelativeTime } from '@/lib/utils'
import {
  CREATOR_GROWTH_DATA, SUBMISSION_WEEKLY_DATA, PAYOUT_STATUS_DATA,
  ACTIVATION_FUNNEL_DATA, DASHBOARD_TOP_CAMPAIGNS
} from '@/data/chart-data'
import { MOCK_ACTIVITY_FEED } from '@/data/activity-feed'
import { MOCK_NOTIFICATIONS } from '@/data/notifications'
import { MOCK_SUBMISSIONS } from '@/data/submissions'
import { MOCK_POOL, MOCK_TRANSACTIONS } from '@/data/transactions'

type DashboardPeriod = '7d' | '30d' | '90d'
type InsightTone = 'success' | 'warning' | 'critical' | 'info'

const PIE_COLORS = ['#10b981', '#0ea5e9', '#f97316', '#ef4444']

const PERIOD_OPTIONS: Array<{ value: DashboardPeriod; label: string; days: number; hint: string }> = [
  { value: '7d', label: '7 Days', days: 7, hint: 'Short-term triage' },
  { value: '30d', label: '30 Days', days: 30, hint: 'Balanced operations' },
  { value: '90d', label: '90 Days', days: 90, hint: 'Strategic view' },
]

const TONE_STYLES: Record<InsightTone, { bg: string; icon: string; value: string; border: string; gradient: string }> = {
  success: { bg: 'bg-emerald-50', icon: 'text-emerald-600', value: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-500 to-emerald-600' },
  warning: { bg: 'bg-amber-50', icon: 'text-amber-600', value: 'text-amber-700', border: 'border-amber-200', gradient: 'from-amber-500 to-amber-600' },
  critical: { bg: 'bg-red-50', icon: 'text-red-600', value: 'text-red-700', border: 'border-red-200', gradient: 'from-red-500 to-red-600' },
  info: { bg: 'bg-blue-50', icon: 'text-blue-600', value: 'text-blue-700', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600' },
}

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function toAbsolutePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

/* ── Custom chart tooltip ── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-sm p-3 shadow-xl shadow-slate-200/50">
      <p className="text-[11px] font-semibold text-foreground mb-1.5 uppercase tracking-wide">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="font-bold num-font ml-auto">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<DashboardPeriod>('30d')

  const now = useMemo(() => new Date(), [])
  const greeting = getGreeting(now.getHours())
  const todayLabel = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })

  const periodConfig = PERIOD_OPTIONS.find(option => option.value === period) ?? PERIOD_OPTIONS[1]
  const periodStart = useMemo(() => {
    const start = new Date(now)
    start.setDate(start.getDate() - periodConfig.days)
    return start
  }, [now, periodConfig.days])

  const chartCreatorGrowthData = useMemo(() => {
    if (period === '7d') return CREATOR_GROWTH_DATA.slice(-6)
    if (period === '30d') return CREATOR_GROWTH_DATA.slice(-9)
    return CREATOR_GROWTH_DATA
  }, [period])

  const chartSubmissionData = useMemo(() => {
    if (period === '7d') return SUBMISSION_WEEKLY_DATA.slice(-4)
    if (period === '30d') return SUBMISSION_WEEKLY_DATA.slice(-6)
    return SUBMISSION_WEEKLY_DATA
  }, [period])

  const recentSubmissions = useMemo(
    () => MOCK_SUBMISSIONS.filter(submission => new Date(submission.submittedAt) >= periodStart),
    [periodStart]
  )

  const reviewedInPeriod = useMemo(
    () => recentSubmissions.filter(submission => submission.status !== 'pending'),
    [recentSubmissions]
  )

  const approvedInPeriod = useMemo(
    () => reviewedInPeriod.filter(submission => submission.status === 'approved' || submission.status === 'paid'),
    [reviewedInPeriod]
  )

  const approvalRate = reviewedInPeriod.length > 0
    ? (approvedInPeriod.length / reviewedInPeriod.length) * 100
    : 0

  const pendingSubmissions = MOCK_SUBMISSIONS.filter(submission => submission.status === 'pending').length
  const overdueReviews = MOCK_SUBMISSIONS.filter(
    submission =>
      submission.status === 'pending'
      && (now.getTime() - new Date(submission.submittedAt).getTime()) / 3600000 > 48
  ).length
  const highRiskPending = MOCK_SUBMISSIONS.filter(
    submission =>
      submission.status === 'pending'
      && (submission.trustSignals.postDeleted || submission.trustSignals.captionEdited || !submission.trustSignals.gpsVerified)
  ).length

  const unreadNotifications = MOCK_NOTIFICATIONS.filter(notification => !notification.read)
  const criticalAlerts = unreadNotifications.filter(notification => notification.severity === 'critical').length
  const kycPendingAlerts = unreadNotifications.filter(notification => notification.type === 'kyc_pending').length

  const firstActivationStep = ACTIVATION_FUNNEL_DATA[0]?.count ?? 0
  const finalActivationStep = ACTIVATION_FUNNEL_DATA[ACTIVATION_FUNNEL_DATA.length - 1]?.count ?? 0
  const activationRate = firstActivationStep > 0 ? (finalActivationStep / firstActivationStep) * 100 : 0
  const failedPayoutRate = PAYOUT_STATUS_DATA.find(item => item.status === 'Failed')?.value ?? 0

  // Pool & transaction-derived stats
  const poolAvailable = MOCK_POOL.balance - MOCK_POOL.totalAllocated
  const poolUtilization = MOCK_POOL.balance > 0 ? Math.round((MOCK_POOL.totalAllocated / MOCK_POOL.balance) * 100) : 0
  const processingTxns = MOCK_TRANSACTIONS.filter(t => t.status === 'processing')
  const failedTxns = MOCK_TRANSACTIONS.filter(t => t.status === 'failed')
  const releaseQueueCount = processingTxns.length + failedTxns.length
  const processingAmount = processingTxns.reduce((s, t) => s + t.amount, 0)
  const failedAmount = failedTxns.reduce((s, t) => s + t.amount, 0)

  const quickActions = [
    {
      label: 'Review Pending',
      description: `${pendingSubmissions} submissions waiting`,
      icon: FileSearch,
      href: '/submissions?filter=pending',
      tone: (pendingSubmissions > 12 ? 'warning' : 'info') as InsightTone,
      count: pendingSubmissions,
    },
    {
      label: 'Release Queue',
      description: `${releaseQueueCount} payout${releaseQueueCount === 1 ? '' : 's'} awaiting action`,
      icon: Send,
      href: '/payouts',
      tone: (failedTxns.length > 0 ? 'critical' : releaseQueueCount > 0 ? 'warning' : 'success') as InsightTone,
      count: releaseQueueCount,
    },
    {
      label: 'Fraud Checks',
      description: `${criticalAlerts} critical alert${criticalAlerts === 1 ? '' : 's'}`,
      icon: ShieldAlert,
      href: '/submissions?filter=fraud',
      tone: (criticalAlerts > 0 ? 'critical' : 'success') as InsightTone,
      count: criticalAlerts,
    },
    {
      label: 'KYC Verification',
      description: `${kycPendingAlerts} pending request${kycPendingAlerts === 1 ? '' : 's'}`,
      icon: CheckCircle,
      href: '/creators?filter=kyc_pending',
      tone: (kycPendingAlerts > 0 ? 'warning' : 'success') as InsightTone,
      count: kycPendingAlerts,
    },
  ]

  const operationalStats = [
    {
      icon: CheckCircle,
      label: 'Approval Rate',
      value: `${approvalRate.toFixed(1)}%`,
      numericValue: approvalRate,
      helper: `${approvedInPeriod.length}/${reviewedInPeriod.length || 0} approved in ${periodConfig.label}`,
      tone: (approvalRate >= 85 ? 'success' : 'warning') as InsightTone,
    },
    {
      icon: Clock,
      label: 'Overdue Reviews',
      value: formatNumber(overdueReviews),
      numericValue: overdueReviews > 0 ? Math.max(100 - overdueReviews * 10, 20) : 100,
      helper: 'Pending for more than 48h',
      tone: (overdueReviews === 0 ? 'success' : 'critical') as InsightTone,
    },
    {
      icon: AlertTriangle,
      label: 'Risky Pending',
      value: formatNumber(highRiskPending),
      numericValue: highRiskPending > 0 ? Math.max(100 - highRiskPending * 15, 15) : 100,
      helper: 'Need manual verification',
      tone: (highRiskPending > 0 ? 'warning' : 'success') as InsightTone,
    },
    {
      icon: Banknote,
      label: 'Pool Utilization',
      value: `${poolUtilization}%`,
      numericValue: poolUtilization,
      helper: `${formatCurrency(poolAvailable)} available of ${formatCurrency(MOCK_POOL.balance)}`,
      tone: (poolUtilization > 80 ? 'critical' : poolUtilization > 50 ? 'warning' : 'success') as InsightTone,
    },
  ]

  const handleNavigate = (target?: string) => {
    if (!target) return
    navigate(toAbsolutePath(target.replace('#', '')))
  }

  return (
    <div className="space-y-5 lg:space-y-7">

      {/* ═══════════════════════════════════════════════════════
          HERO BANNER — Gradient card with greeting & live status
         ═══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-orange-50 via-amber-50/30 to-white border border-orange-100/50 p-5 sm:p-6 lg:p-8">
        {/* Decorative background orbs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-linear-to-bl from-orange-200/25 to-transparent rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-linear-to-tr from-amber-200/20 to-transparent rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-linear-to-tl from-orange-100/15 to-transparent rounded-full pointer-events-none" />

        <div className="relative">
          {/* Top: Greeting + Period Toggle */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-foreground tracking-tight">
                {greeting}
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                {todayLabel}
                <span className="mx-1.5 text-slate-300">·</span>
                <span className="font-medium text-foreground/70">{periodConfig.hint}</span>
              </p>
            </div>

            {/* Period toggle — premium pill */}
            <div className="inline-flex items-center rounded-xl bg-white/70 backdrop-blur-sm border border-orange-100/60 p-1 shadow-sm">
              {PERIOD_OPTIONS.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPeriod(option.value)}
                  className={cn(
                    'rounded-lg px-3 sm:px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer',
                    period === option.value
                      ? 'bg-primary text-white shadow-md shadow-primary/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/80'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live status badges */}
          <div className="flex flex-wrap gap-2 mt-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 px-3.5 py-1.5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="text-xs font-medium text-foreground">{pendingSubmissions} pending reviews</span>
            </div>
            {criticalAlerts > 0 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50/80 backdrop-blur-sm border border-red-200/60 px-3.5 py-1.5 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-xs font-medium text-red-700">{criticalAlerts} critical alerts</span>
              </div>
            )}
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/90 backdrop-blur-sm border border-slate-700/60 px-3.5 py-1.5 shadow-sm">
              <Banknote className="h-3 w-3 text-emerald-400" />
              <span className="text-xs font-medium text-white">Pool: {formatCurrency(MOCK_POOL.balance)}</span>
            </div>
            {releaseQueueCount > 0 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-50/80 backdrop-blur-sm border border-purple-200/60 px-3.5 py-1.5 shadow-sm">
                <Send className="h-3 w-3 text-purple-500" />
                <span className="text-xs font-medium text-purple-700">{releaseQueueCount} in release queue</span>
              </div>
            )}
            {overdueReviews > 0 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 px-3.5 py-1.5 shadow-sm">
                <Clock className="h-3 w-3 text-orange-500" />
                <span className="text-xs font-medium text-foreground">{overdueReviews} overdue 48h+</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          KPI STAT CARDS — Big numbers at a glance
         ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <button type="button" className="text-left cursor-pointer group" onClick={() => navigate('/creators')}>
          <StatCard
            label="Total Creators"
            value={formatNumber(2437)}
            subValue="+127 this month"
            trend={5.5}
            trendLabel="vs last month"
            icon={Users}
            iconColor="text-blue-500"
            iconBg="bg-blue-50"
            className="h-full transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5"
          />
        </button>
        <button type="button" className="text-left cursor-pointer group" onClick={() => navigate('/campaigns')}>
          <StatCard
            label="Active Campaigns"
            value="48"
            subValue="5 ending this week"
            trend={2.1}
            trendLabel="vs last month"
            icon={Megaphone}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-50"
            className="h-full transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5"
          />
        </button>
        <button type="button" className="text-left cursor-pointer group" onClick={() => navigate('/submissions?filter=pending')}>
          <StatCard
            label="Pending Reviews"
            value={pendingSubmissions}
            subValue={`${overdueReviews} overdue by 48h`}
            trend={-8.3}
            trendLabel="vs last week"
            icon={Video}
            iconColor="text-primary"
            iconBg="bg-orange-50"
            highlight={pendingSubmissions > 10}
            className="h-full transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5"
          />
        </button>
        <button type="button" className="text-left cursor-pointer group" onClick={() => navigate('/payouts')}>
          <StatCard
            label="Pool Balance"
            value={formatCurrency(MOCK_POOL.balance)}
            subValue={`${formatCurrency(processingAmount + failedAmount)} pending release`}
            trend={12.4}
            trendLabel="vs last month"
            icon={Wallet}
            iconColor="text-purple-500"
            iconBg="bg-purple-50"
            highlight={failedTxns.length > 5}
            className="h-full transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5"
          />
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════
          QUICK ACTIONS — Prioritized ops tasks
         ═══════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Today's Focus</h2>
          <span className="text-xs text-muted-foreground">— Prioritized actions to reduce delay and risk</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {quickActions.map(action => {
            const Icon = action.icon
            const tone = TONE_STYLES[action.tone]
            return (
              <button
                key={action.label}
                type="button"
                onClick={() => navigate(action.href)}
                className={cn(
                  'group relative overflow-hidden rounded-xl border bg-white p-4 text-left transition-all duration-200 cursor-pointer',
                  'hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]',
                  tone.border
                )}
              >
                {/* Accent gradient bar */}
                <div className={cn('absolute inset-x-0 top-0 h-0.75 bg-linear-to-r', tone.gradient)} />

                <div className="flex items-start justify-between gap-2">
                  <div className={cn('rounded-xl p-2.5', tone.bg)}>
                    <Icon className={cn('h-5 w-5', tone.icon)} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-muted-foreground">Open</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-bold text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                </div>
                {action.count > 0 && (
                  <div className={cn('absolute bottom-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-bold', tone.bg, tone.value)}>
                    {action.count}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CHARTS ROW 1 — Creator Growth + Payout Status
         ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Creator Growth — 2/3 */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">Creator Growth</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Total vs new creator momentum ({periodConfig.label})
                </p>
              </div>
              <Badge variant="success" className="text-xs font-semibold">
                +{formatNumber(127)} this month
              </Badge>
            </div>
            {/* Inline legend */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
                <span className="text-[11px] text-muted-foreground font-medium">Total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                <span className="text-[11px] text-muted-foreground font-medium">New</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartCreatorGrowthData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="total" name="Total" stroke="#f97316" strokeWidth={2.5} fill="url(#totalGrad)" dot={false} activeDot={{ r: 5, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} />
                <Area type="monotone" dataKey="new" name="New" stroke="#10b981" strokeWidth={2.5} fill="url(#newGrad)" dot={false} activeDot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payout & Pool — 1/3 */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">Payouts & Pool</CardTitle>
              <Badge variant={failedPayoutRate > 5 ? 'warning' : 'success'} className="text-xs font-semibold">
                {failedPayoutRate}% failed
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Pool utilization mini-card */}
            <button
              type="button"
              onClick={() => navigate('/payouts')}
              className="w-full rounded-xl bg-linear-to-br from-slate-800 to-slate-900 text-white p-3.5 mb-4 text-left cursor-pointer hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Banknote className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[11px] text-slate-400">Pool Balance</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-white transition-colors" />
              </div>
              <p className="text-xl font-bold num-font">{formatCurrency(MOCK_POOL.balance)}</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>{poolUtilization}% allocated</span>
                  <span>{formatCurrency(poolAvailable)} free</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      poolUtilization > 80 ? 'bg-red-400' : poolUtilization > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                    )}
                    style={{ width: `${poolUtilization}%` }}
                  />
                </div>
              </div>
              {releaseQueueCount > 0 && (
                <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-white/10 text-[11px]">
                  <span className="flex items-center gap-1 text-blue-400">
                    <Lock className="h-3 w-3" />{processingTxns.length} ready
                  </span>
                  {failedTxns.length > 0 && (
                    <span className="flex items-center gap-1 text-red-400">
                      <AlertTriangle className="h-3 w-3" />{failedTxns.length} failed
                    </span>
                  )}
                </div>
              )}
            </button>

            {/* Pie chart */}
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={PAYOUT_STATUS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={66}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {PAYOUT_STATUS_DATA.map((_entry, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, '']}
                    contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              {PAYOUT_STATUS_DATA.map((item, i) => (
                <div key={item.status} className="flex items-center gap-2 rounded-lg bg-slate-50/70 px-2.5 py-1.5">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-[11px] text-muted-foreground flex-1 truncate">{item.status}</span>
                  <span className="text-xs font-bold num-font">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CHARTS ROW 2 — Submission Volume + Activation Funnel
         ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Submission Volume — 2/3 */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">Submission Volume & Approval</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Workload and review outcomes comparison
                </p>
              </div>
            </div>
            {/* Inline legend */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
                <span className="text-[11px] text-muted-foreground font-medium">Total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                <span className="text-[11px] text-muted-foreground font-medium">Approved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-red-400" />
                <span className="text-[11px] text-muted-foreground font-medium">Rejected</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartSubmissionData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="total" name="Total" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" name="Rejected" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Creator Activation Funnel — 1/3 */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">Activation Funnel</CardTitle>
              <Badge variant={activationRate >= 45 ? 'success' : 'warning'} className="text-xs font-semibold">
                {activationRate.toFixed(1)}% activated
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {ACTIVATION_FUNNEL_DATA.map((step, i) => {
              const isFirst = i === 0
              const isLast = i === ACTIVATION_FUNNEL_DATA.length - 1
              return (
                <div key={step.step}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={cn('truncate pr-2', isFirst || isLast ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                      {step.step}
                    </span>
                    <span className="font-bold num-font text-foreground shrink-0">
                      {formatNumber(step.count)}
                      <span className="text-muted-foreground font-normal ml-1 text-[11px]">({step.percent}%)</span>
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${step.percent}%`,
                        background: isFirst
                          ? 'linear-gradient(90deg, #f97316, #fb923c)'
                          : isLast
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : `linear-gradient(90deg, hsl(${25 + i * 12}, 75%, ${50 + i * 3}%), hsl(${25 + i * 12}, 70%, ${55 + i * 3}%))`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════
          TOP CAMPAIGNS + ACTIVITY FEED
         ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Campaigns — 2/3 */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Top Campaigns</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1.5 hover:bg-orange-50" onClick={() => navigate('/campaigns')}>
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile: Card layout */}
            <div className="md:hidden space-y-2 p-4">
              {DASHBOARD_TOP_CAMPAIGNS.map((campaign, i) => (
                <div key={campaign.name} className="rounded-xl border border-slate-200 bg-white p-3.5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative">
                        <div className="h-8 w-8 rounded-lg bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center shrink-0 border border-orange-100/50">
                          <Flame className="h-4 w-4 text-primary" />
                        </div>
                        <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                      </div>
                      <p className="font-semibold text-sm truncate">{campaign.name}</p>
                    </div>
                    <Badge variant={campaign.success >= 88 ? 'success' : 'warning'} className="text-[10px] shrink-0">
                      {campaign.success}%
                    </Badge>
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-muted-foreground">Submissions</p>
                      <p className="font-bold num-font text-foreground">{campaign.submissions}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-muted-foreground">Avg. Payout</p>
                      <p className="font-bold num-font text-foreground">{formatCurrency(campaign.avgPayout)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2.5 px-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">#</th>
                    <th className="text-left py-2.5 px-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Campaign</th>
                    <th className="text-right py-2.5 px-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Submissions</th>
                    <th className="text-right py-2.5 px-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Avg. Payout</th>
                    <th className="text-right py-2.5 px-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Success</th>
                  </tr>
                </thead>
                <tbody>
                  {DASHBOARD_TOP_CAMPAIGNS.map((campaign, i) => (
                    <tr key={campaign.name} className="border-b border-slate-50 hover:bg-orange-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-600">
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center shrink-0 border border-orange-100/50">
                            <Flame className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-semibold text-sm">{campaign.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="num-font font-semibold">{campaign.submissions}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="num-font font-semibold">{formatCurrency(campaign.avgPayout)}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
                          campaign.success >= 88 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        )}>
                          {campaign.success}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed — 1/3 */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Activity Feed</CardTitle>
              <Badge variant="gray" className="text-[10px] font-semibold">{MOCK_ACTIVITY_FEED.length} events</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-95 overflow-y-auto">
              {MOCK_ACTIVITY_FEED.slice(0, 12).map((activity, i) => (
                <button
                  key={activity.id}
                  type="button"
                  onClick={() => handleNavigate(activity.targetUrl)}
                  className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors cursor-pointer relative"
                >
                  {/* Timeline connector line */}
                  {i < 11 && (
                    <div className="absolute left-7.5 top-10.5 w-px h-[calc(100%-24px)] bg-slate-100" />
                  )}
                  <div className="relative z-10">
                    <Avatar name={activity.actorName} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-snug">
                      <span className="font-semibold text-foreground">{activity.actorName}</span>{' '}
                      <span className="text-muted-foreground">{activity.action}</span>{' '}
                      <span className="font-semibold text-primary">{activity.target}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                      {getRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════
          OPERATIONAL HEALTH — Visual progress indicators
         ═══════════════════════════════════════════════════════ */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-3">Operational Health</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
          {operationalStats.map(stat => {
            const Icon = stat.icon
            const tone = TONE_STYLES[stat.tone]

            return (
              <div key={stat.label} className="admin-card p-4 hover:shadow-md transition-shadow relative overflow-hidden">
                {/* Subtle accent bar */}
                <div className={cn('absolute inset-x-0 top-0 h-0.5 bg-linear-to-r', tone.gradient)} />

                <div className="flex items-start gap-3">
                  <div className={cn('rounded-xl p-2.5 shrink-0', tone.bg)}>
                    <Icon className={cn('h-5 w-5', tone.icon)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                    <p className={cn('text-xl font-bold num-font mt-0.5', tone.value)}>{stat.value}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700 bg-linear-to-r', tone.gradient)}
                      style={{ width: `${Math.min(stat.numericValue, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5 truncate">{stat.helper}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
