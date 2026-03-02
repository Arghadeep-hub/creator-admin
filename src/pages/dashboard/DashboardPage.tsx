import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  Users, Megaphone, Video, Wallet, AlertTriangle, Clock, TrendingUp,
  CheckCircle, ArrowRight, Flame, ShieldAlert, FileSearch, CircleAlert, Sparkles
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { cn, formatCurrency, formatNumber, getRelativeTime } from '@/lib/utils'
import {
  CREATOR_GROWTH_DATA, SUBMISSION_WEEKLY_DATA, PAYOUT_STATUS_DATA,
  ACTIVATION_FUNNEL_DATA, DASHBOARD_TOP_CAMPAIGNS
} from '@/data/chart-data'
import { MOCK_ACTIVITY_FEED } from '@/data/activity-feed'
import { MOCK_NOTIFICATIONS } from '@/data/notifications'
import { MOCK_SUBMISSIONS } from '@/data/submissions'

type DashboardPeriod = '7d' | '30d' | '90d'
type InsightTone = 'success' | 'warning' | 'critical' | 'info'

const PIE_COLORS = ['#10b981', '#0ea5e9', '#f97316', '#ef4444']

const PERIOD_OPTIONS: Array<{ value: DashboardPeriod; label: string; days: number; hint: string }> = [
  { value: '7d', label: '7D', days: 7, hint: 'Short-term triage focus' },
  { value: '30d', label: '30D', days: 30, hint: 'Balanced operations view' },
  { value: '90d', label: '90D', days: 90, hint: 'Strategic performance view' },
]

const SEVERITY_WEIGHT = {
  critical: 3,
  warning: 2,
  info: 1,
} as const

const INSIGHT_TONE_STYLES: Record<InsightTone, { bg: string; icon: string; value: string }> = {
  success: { bg: 'bg-emerald-50', icon: 'text-emerald-600', value: 'text-emerald-700' },
  warning: { bg: 'bg-amber-50', icon: 'text-amber-600', value: 'text-amber-700' },
  critical: { bg: 'bg-red-50', icon: 'text-red-600', value: 'text-red-700' },
  info: { bg: 'bg-blue-50', icon: 'text-blue-600', value: 'text-blue-700' },
}

function toAbsolutePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

function severityBadgeVariant(severity: 'info' | 'warning' | 'critical') {
  if (severity === 'critical') return 'error'
  if (severity === 'warning') return 'warning'
  return 'info'
}

function severityLabel(severity: 'info' | 'warning' | 'critical') {
  if (severity === 'critical') return 'Critical'
  if (severity === 'warning') return 'Warning'
  return 'Info'
}

export function DashboardPage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [period, setPeriod] = useState<DashboardPeriod>('30d')

  const now = useMemo(() => new Date(), [])
  const firstName = session?.name?.split(' ')[0] ?? 'Team'
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'
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

  const averageProjectedPayout = reviewedInPeriod.length > 0
    ? reviewedInPeriod.reduce((sum, submission) => sum + submission.projectedPayout, 0) / reviewedInPeriod.length
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
  const actionRequired = unreadNotifications.filter(notification => notification.severity !== 'info')
  const criticalAlerts = actionRequired.filter(notification => notification.severity === 'critical').length
  const payoutFailures = unreadNotifications.filter(notification => notification.type === 'payout_failed').length
  const kycPendingAlerts = unreadNotifications.filter(notification => notification.type === 'kyc_pending').length

  const priorityQueue = useMemo(
    () => [...actionRequired]
      .sort((a, b) => {
        const severityDiff = SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]
        if (severityDiff !== 0) return severityDiff
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })
      .slice(0, 4),
    [actionRequired]
  )

  const firstActivationStep = ACTIVATION_FUNNEL_DATA[0]?.count ?? 0
  const finalActivationStep = ACTIVATION_FUNNEL_DATA[ACTIVATION_FUNNEL_DATA.length - 1]?.count ?? 0
  const activationRate = firstActivationStep > 0 ? (finalActivationStep / firstActivationStep) * 100 : 0
  const failedPayoutRate = PAYOUT_STATUS_DATA.find(item => item.status === 'Failed')?.value ?? 0

  const quickActions = [
    {
      label: 'Review Pending',
      description: `${pendingSubmissions} submissions waiting`,
      icon: FileSearch,
      href: '/submissions?filter=pending',
      tone: pendingSubmissions > 12 ? 'warning' : 'info',
    },
    {
      label: 'Resolve Payouts',
      description: `${payoutFailures} payout issue${payoutFailures === 1 ? '' : 's'}`,
      icon: Wallet,
      href: '/payouts?status=failed',
      tone: payoutFailures > 0 ? 'critical' : 'success',
    },
    {
      label: 'Fraud Checks',
      description: `${criticalAlerts} critical alert${criticalAlerts === 1 ? '' : 's'}`,
      icon: ShieldAlert,
      href: '/submissions?filter=fraud',
      tone: criticalAlerts > 0 ? 'critical' : 'success',
    },
    {
      label: 'KYC Verification',
      description: `${kycPendingAlerts} pending request${kycPendingAlerts === 1 ? '' : 's'}`,
      icon: CheckCircle,
      href: '/creators?filter=kyc_pending',
      tone: kycPendingAlerts > 0 ? 'warning' : 'success',
    },
  ] as const

  const operationalStats = [
    {
      icon: CheckCircle,
      label: 'Approval Rate',
      value: `${approvalRate.toFixed(1)}%`,
      helper: `${approvedInPeriod.length}/${reviewedInPeriod.length || 0} approved in ${periodConfig.label}`,
      tone: approvalRate >= 85 ? 'success' : 'warning',
    },
    {
      icon: Clock,
      label: 'Overdue Reviews',
      value: formatNumber(overdueReviews),
      helper: 'Pending for more than 48h',
      tone: overdueReviews === 0 ? 'success' : 'critical',
    },
    {
      icon: AlertTriangle,
      label: 'Risky Pending',
      value: formatNumber(highRiskPending),
      helper: 'Need manual verification',
      tone: highRiskPending > 0 ? 'warning' : 'success',
    },
    {
      icon: TrendingUp,
      label: 'Avg. Projected Payout',
      value: formatCurrency(Math.round(averageProjectedPayout)),
      helper: `From reviewed submissions (${periodConfig.label})`,
      tone: 'info',
    },
  ] as const

  const handleNavigate = (target?: string) => {
    if (!target) return
    navigate(toAbsolutePath(target.replace('#', '')))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${firstName}`}
        subtitle={`Operations snapshot for ${todayLabel}. ${periodConfig.hint}.`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-lg bg-slate-100 p-1">
            {PERIOD_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPeriod(option.value)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  period === option.value
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={() => navigate('/submissions?filter=pending')}>
            Open Review Queue <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 bg-gradient-to-br from-white via-white to-orange-50/40">
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Today Focus
              </span>
              <Badge variant="gray" className="text-xs">{periodConfig.hint}</Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Quick actions are prioritized to reduce review delay and payout risk.
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map(action => {
              const Icon = action.icon
              const toneStyles = INSIGHT_TONE_STYLES[action.tone]
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => navigate(action.href)}
                  className="rounded-xl border border-slate-200 bg-white p-3 text-left hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('rounded-lg p-2 shrink-0', toneStyles.bg)}>
                      <Icon className={cn('h-4 w-4', toneStyles.icon)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{action.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 ml-auto text-slate-400 shrink-0" />
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="text-base">Priority Queue</span>
              <Badge variant={priorityQueue.length > 0 ? 'warning' : 'success'} className="text-xs">
                {priorityQueue.length} open
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Critical and warning alerts sorted by urgency.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {priorityQueue.length === 0 && (
              <div className="rounded-lg border border-emerald-200 bg-white/90 px-3 py-2 text-xs text-emerald-700">
                No urgent blockers right now.
              </div>
            )}
            {priorityQueue.map(item => {
              const SeverityIcon = item.severity === 'critical' ? AlertTriangle : CircleAlert
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.actionUrl)}
                  className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-left hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <SeverityIcon className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant={severityBadgeVariant(item.severity)} className="text-[10px] px-1.5 py-0">
                          {severityLabel(item.severity)}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">{getRelativeTime(item.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button type="button" className="text-left" onClick={() => navigate('/creators')}>
          <StatCard
            label="Total Creators"
            value={formatNumber(2437)}
            subValue="+127 this month"
            trend={5.5}
            trendLabel="vs last month"
            icon={Users}
            iconColor="text-blue-500"
            iconBg="bg-blue-50"
            badge={<Badge variant="info" className="text-[10px]">View</Badge>}
          />
        </button>
        <button type="button" className="text-left" onClick={() => navigate('/campaigns')}>
          <StatCard
            label="Active Campaigns"
            value="48"
            subValue="5 ending this week"
            trend={2.1}
            trendLabel="vs last month"
            icon={Megaphone}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-50"
            badge={<Badge variant="success" className="text-[10px]">Healthy</Badge>}
          />
        </button>
        <button type="button" className="text-left" onClick={() => navigate('/submissions?filter=pending')}>
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
            badge={
              <Badge
                variant={overdueReviews > 0 ? 'warning' : 'success'}
                className="text-[10px]"
              >
                {overdueReviews > 0 ? 'Needs Action' : 'On Track'}
              </Badge>
            }
          />
        </button>
        <button type="button" className="text-left" onClick={() => navigate('/payouts')}>
          <StatCard
            label="Payouts This Month"
            value={formatCurrency(1240000)}
            subValue={`${formatCurrency(185000)} pending`}
            trend={12.4}
            trendLabel="vs last month"
            icon={Wallet}
            iconColor="text-purple-500"
            iconBg="bg-purple-50"
            badge={
              <Badge
                variant={payoutFailures > 0 ? 'error' : 'success'}
                className="text-[10px]"
              >
                {payoutFailures > 0 ? `${payoutFailures} failures` : 'Stable'}
              </Badge>
            }
          />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex flex-wrap items-center justify-between gap-2">
              <span>Creator Growth</span>
              <Badge variant="success" className="text-xs">+{formatNumber(127)} this month</Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Total vs new creator momentum ({periodConfig.label} context).
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartCreatorGrowthData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="total" name="Total" stroke="#f97316" strokeWidth={2} fill="url(#totalGrad)" />
                <Area type="monotone" dataKey="new" name="New" stroke="#10b981" strokeWidth={2} fill="url(#newGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between gap-2">
              <span>Payout Status</span>
              <Badge variant={failedPayoutRate > 5 ? 'warning' : 'success'} className="text-xs">
                {failedPayoutRate}% failed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={PAYOUT_STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {PAYOUT_STATUS_DATA.map((_entry, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {PAYOUT_STATUS_DATA.map((item, i) => (
                <div key={item.status} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-xs text-muted-foreground">{item.status}</span>
                  <span className="text-xs font-semibold ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {failedPayoutRate > 5
                ? 'Failure rate is elevated. Keep retries and UPI corrections prioritized.'
                : 'Payout reliability is stable. Continue routine monitoring.'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex flex-wrap items-center justify-between gap-2">
              <span>Submission Volume & Approval</span>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary inline-block" />Total</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />Approved</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400 inline-block" />Rejected</span>
              </div>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Fast comparison of workload and review outcomes.
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartSubmissionData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Bar dataKey="total" name="Total" fill="#f97316" radius={[3, 3, 0, 0]} />
                <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between gap-2">
              <span>Creator Activation Funnel</span>
              <Badge variant={activationRate >= 45 ? 'success' : 'warning'} className="text-xs">
                {activationRate.toFixed(1)}% activated
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ACTIVATION_FUNNEL_DATA.map((step, i) => (
              <div key={step.step}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground truncate pr-2">{step.step}</span>
                  <span className="font-semibold text-foreground shrink-0">
                    {formatNumber(step.count)}
                    <span className="text-muted-foreground font-normal ml-1">({step.percent}%)</span>
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${step.percent}%`,
                      backgroundColor: i === 0 ? '#f97316' : `hsl(${25 + i * 8}, 80%, ${50 + i * 4}%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Top Campaigns</span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/campaigns')}>
                View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="md:hidden space-y-2 p-4">
              {DASHBOARD_TOP_CAMPAIGNS.map((campaign, i) => (
                <div key={campaign.name} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                        <Flame className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">#{i + 1}</p>
                        <p className="font-medium text-sm truncate">{campaign.name}</p>
                      </div>
                    </div>
                    <Badge variant={campaign.success >= 88 ? 'success' : 'warning'} className="text-[10px]">
                      {campaign.success}% success
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md bg-slate-50 p-2">
                      <p className="text-muted-foreground">Submissions</p>
                      <p className="font-semibold num-font">{campaign.submissions}</p>
                    </div>
                    <div className="rounded-md bg-slate-50 p-2">
                      <p className="text-muted-foreground">Avg. Payout</p>
                      <p className="font-semibold num-font">{formatCurrency(campaign.avgPayout)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 px-4 text-xs text-muted-foreground font-medium">#</th>
                    <th className="text-left py-2 px-4 text-xs text-muted-foreground font-medium">Campaign</th>
                    <th className="text-right py-2 px-4 text-xs text-muted-foreground font-medium">Submissions</th>
                    <th className="text-right py-2 px-4 text-xs text-muted-foreground font-medium">Avg. Payout</th>
                    <th className="text-right py-2 px-4 text-xs text-muted-foreground font-medium">Success</th>
                  </tr>
                </thead>
                <tbody>
                  {DASHBOARD_TOP_CAMPAIGNS.map((campaign, i) => (
                    <tr key={campaign.name} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="py-2.5 px-4">
                        <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                            <Flame className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="font-medium text-sm">{campaign.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-right text-sm num-font">{campaign.submissions}</td>
                      <td className="py-2.5 px-4 text-right text-sm num-font">{formatCurrency(campaign.avgPayout)}</td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="text-xs font-semibold text-emerald-600">{campaign.success}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Activity Feed</span>
              <Badge variant="gray" className="text-xs">{MOCK_ACTIVITY_FEED.length} events</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
              {MOCK_ACTIVITY_FEED.slice(0, 12).map(activity => (
                <button
                  key={activity.id}
                  type="button"
                  onClick={() => handleNavigate(activity.targetUrl)}
                  className="w-full text-left flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50/60 transition-colors"
                >
                  <Avatar name={activity.actorName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-snug">
                      <span className="font-medium">{activity.actorName}</span>{' '}
                      <span className="text-muted-foreground">{activity.action}</span>{' '}
                      <span className="font-medium text-primary truncate">{activity.target}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {getRelativeTime(activity.timestamp)} · Open details
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {operationalStats.map(stat => {
          const Icon = stat.icon
          const toneStyles = INSIGHT_TONE_STYLES[stat.tone]

          return (
            <div key={stat.label} className="admin-card p-4 flex items-center gap-3">
              <div className={cn('rounded-xl p-2.5 shrink-0', toneStyles.bg)}>
                <Icon className={cn('h-5 w-5', toneStyles.icon)} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={cn('text-lg font-bold num-font', toneStyles.value)}>{stat.value}</p>
                <p className="text-xs text-muted-foreground truncate">{stat.helper}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
