import { lazy, Suspense, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, Clock, CheckCircle, FileSearch, ShieldAlert, Send, Banknote,
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'
import {
  CREATOR_GROWTH_DATA, SUBMISSION_WEEKLY_DATA, PAYOUT_STATUS_DATA,
  ACTIVATION_FUNNEL_DATA, DASHBOARD_TOP_CAMPAIGNS,
} from '@/data/chart-data'
import { MOCK_ACTIVITY_FEED } from '@/data/activity-feed'
import { MOCK_NOTIFICATIONS } from '@/data/notifications'
import { MOCK_SUBMISSIONS } from '@/data/submissions'
import { MOCK_POOL, MOCK_TRANSACTIONS } from '@/data/transactions'
import { getGreeting, toAbsolutePath, PERIOD_OPTIONS } from './dashboard.types'
import type { DashboardPeriod, InsightTone } from './dashboard.types'

// ── Above the fold — regular imports (paint instantly) ──
import { HeroBanner } from './_sections/HeroBanner'
import { KpiStatCards } from './_sections/KpiStatCards'
import { QuickActionsCard } from './_sections/QuickActionsCard'

// ── Below the fold — lazy loaded separate chunks ──
const CreatorGrowthChart    = lazy(() => import('./_sections/CreatorGrowthChart').then(m => ({ default: m.CreatorGrowthChart })))
const PayoutsPoolCard       = lazy(() => import('./_sections/PayoutsPoolCard').then(m => ({ default: m.PayoutsPoolCard })))
const SubmissionVolumeChart = lazy(() => import('./_sections/SubmissionVolumeChart').then(m => ({ default: m.SubmissionVolumeChart })))
const ActivationFunnelCard  = lazy(() => import('./_sections/ActivationFunnelCard').then(m => ({ default: m.ActivationFunnelCard })))
const TopCampaignsCard      = lazy(() => import('./_sections/TopCampaignsCard').then(m => ({ default: m.TopCampaignsCard })))
const ActivityFeedCard      = lazy(() => import('./_sections/ActivityFeedCard').then(m => ({ default: m.ActivityFeedCard })))
const OperationalHealthCard = lazy(() => import('./_sections/OperationalHealthCard').then(m => ({ default: m.OperationalHealthCard })))

// ── Skeleton fallbacks ──
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 animate-pulse ${className ?? ''}`}>
      <div className="h-4 w-1/3 rounded bg-slate-200 mb-4" />
      <div className="space-y-2.5">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
        <div className="h-3 w-4/5 rounded bg-slate-100" />
      </div>
    </div>
  )
}

function ChartRowSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
      <CardSkeleton className="lg:col-span-2 h-64 sm:h-72" />
      <CardSkeleton className="h-64 sm:h-72" />
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<DashboardPeriod>('30d')

  const now = useMemo(() => new Date(), [])
  const greeting = getGreeting(now.getHours())
  const todayLabel = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })

  const periodConfig = PERIOD_OPTIONS.find(o => o.value === period) ?? PERIOD_OPTIONS[1]
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
    () => MOCK_SUBMISSIONS.filter(s => new Date(s.submittedAt) >= periodStart),
    [periodStart]
  )
  const reviewedInPeriod = useMemo(
    () => recentSubmissions.filter(s => s.status !== 'pending'),
    [recentSubmissions]
  )
  const approvedInPeriod = useMemo(
    () => reviewedInPeriod.filter(s => s.status === 'approved' || s.status === 'paid'),
    [reviewedInPeriod]
  )
  const approvalRate = reviewedInPeriod.length > 0
    ? (approvedInPeriod.length / reviewedInPeriod.length) * 100
    : 0

  const pendingSubmissions = MOCK_SUBMISSIONS.filter(s => s.status === 'pending').length
  const overdueReviews = MOCK_SUBMISSIONS.filter(
    s => s.status === 'pending' && (now.getTime() - new Date(s.submittedAt).getTime()) / 3600000 > 48
  ).length
  const highRiskPending = MOCK_SUBMISSIONS.filter(
    s => s.status === 'pending'
      && (s.trustSignals.postDeleted || s.trustSignals.captionEdited || !s.trustSignals.gpsVerified)
  ).length

  const unreadNotifications = MOCK_NOTIFICATIONS.filter(n => !n.read)
  const criticalAlerts = unreadNotifications.filter(n => n.severity === 'critical').length
  const kycPendingAlerts = unreadNotifications.filter(n => n.type === 'kyc_pending').length

  const firstActivationStep = ACTIVATION_FUNNEL_DATA[0]?.count ?? 0
  const finalActivationStep = ACTIVATION_FUNNEL_DATA[ACTIVATION_FUNNEL_DATA.length - 1]?.count ?? 0
  const activationRate = firstActivationStep > 0 ? (finalActivationStep / firstActivationStep) * 100 : 0
  const failedPayoutRate = PAYOUT_STATUS_DATA.find(item => item.status === 'Failed')?.value ?? 0

  const poolAvailable = MOCK_POOL.balance - MOCK_POOL.totalAllocated
  const poolUtilization = MOCK_POOL.balance > 0 ? Math.round((MOCK_POOL.totalAllocated / MOCK_POOL.balance) * 100) : 0
  const processingTxns = MOCK_TRANSACTIONS.filter(t => t.status === 'processing')
  const failedTxns = MOCK_TRANSACTIONS.filter(t => t.status === 'failed')
  const releaseQueueCount = processingTxns.length + failedTxns.length
  const processingAmount = processingTxns.reduce((s, t) => s + t.amount, 0)
  const failedAmount = failedTxns.reduce((s, t) => s + t.amount, 0)

  const quickActions = useMemo(() => [
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
  ], [pendingSubmissions, releaseQueueCount, failedTxns.length, criticalAlerts, kycPendingAlerts])

  const operationalStats = useMemo(() => [
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
  ], [approvalRate, approvedInPeriod.length, reviewedInPeriod.length, periodConfig.label, overdueReviews, highRiskPending, poolUtilization, poolAvailable])

  const recentActivities = useMemo(() => MOCK_ACTIVITY_FEED.slice(0, 12), [])

  const handleNavigate = (target?: string) => {
    if (!target) return
    navigate(toAbsolutePath(target.replace('#', '')))
  }

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-7">

      {/* ── Above the fold — instant paint ── */}
      <HeroBanner
        greeting={greeting}
        todayLabel={todayLabel}
        periodConfig={periodConfig}
        period={period}
        onPeriodChange={setPeriod}
        pendingSubmissions={pendingSubmissions}
        criticalAlerts={criticalAlerts}
        poolBalance={MOCK_POOL.balance}
        releaseQueueCount={releaseQueueCount}
        overdueReviews={overdueReviews}
      />

      <KpiStatCards
        pendingSubmissions={pendingSubmissions}
        overdueReviews={overdueReviews}
        poolBalance={MOCK_POOL.balance}
        pendingReleaseAmount={processingAmount + failedAmount}
        hasFailedTxns={failedTxns.length > 5}
        onNavigate={navigate}
      />

      <QuickActionsCard
        actions={quickActions}
        onNavigate={navigate}
      />

      {/* ── Charts Row 1 — lazy ── */}
      <Suspense fallback={<ChartRowSkeleton />}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <CreatorGrowthChart
            data={chartCreatorGrowthData}
            periodLabel={periodConfig.label}
          />
          <PayoutsPoolCard
            poolBalance={MOCK_POOL.balance}
            poolUtilization={poolUtilization}
            poolAvailable={poolAvailable}
            releaseQueueCount={releaseQueueCount}
            processingCount={processingTxns.length}
            failedCount={failedTxns.length}
            failedPayoutRate={failedPayoutRate}
            payoutStatusData={PAYOUT_STATUS_DATA}
            onNavigate={navigate}
          />
        </div>
      </Suspense>

      {/* ── Charts Row 2 — lazy ── */}
      <Suspense fallback={<ChartRowSkeleton />}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <SubmissionVolumeChart data={chartSubmissionData} />
          <ActivationFunnelCard
            data={ACTIVATION_FUNNEL_DATA}
            activationRate={activationRate}
          />
        </div>
      </Suspense>

      {/* ── Top Campaigns + Activity Feed — lazy ── */}
      <Suspense fallback={<ChartRowSkeleton />}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <TopCampaignsCard
            campaigns={DASHBOARD_TOP_CAMPAIGNS}
            onNavigate={navigate}
          />
          <ActivityFeedCard
            activities={recentActivities}
            totalCount={MOCK_ACTIVITY_FEED.length}
            onNavigate={handleNavigate}
          />
        </div>
      </Suspense>

      {/* ── Operational Health — lazy ── */}
      <Suspense fallback={<CardSkeleton className="h-36" />}>
        <OperationalHealthCard stats={operationalStats} />
      </Suspense>

    </div>
  )
}
