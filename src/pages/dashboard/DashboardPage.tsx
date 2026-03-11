import { lazy, Suspense, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, Clock, CheckCircle, FileSearch, ShieldAlert, Send, Banknote,
} from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import {
  useGetDashboardStatsQuery,
  useGetCreatorGrowthQuery,
  useGetSubmissionVolumeQuery,
  useGetTopCampaignsQuery,
  useGetActivationFunnelQuery,
  useGetActivityFeedQuery,
  useGetOperationalHealthQuery,
} from '@/store/api/dashboardApi'
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

const PAYOUT_STATUS_DATA_FALLBACK = [
  { status: 'Paid', value: 0 },
  { status: 'Processing', value: 0 },
  { status: 'Pending', value: 0 },
  { status: 'Failed', value: 0 },
]

export function DashboardPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<DashboardPeriod>('30d')

  const now = useMemo(() => new Date(), [])
  const greeting = getGreeting(now.getHours())
  const todayLabel = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })

  const periodConfig = PERIOD_OPTIONS.find(o => o.value === period) ?? PERIOD_OPTIONS[1]

  // ── RTK Query hooks ──
  const { data: stats } = useGetDashboardStatsQuery({ period })
  const { data: creatorGrowthData = [] } = useGetCreatorGrowthQuery({ period })
  const { data: submissionVolumeData = [] } = useGetSubmissionVolumeQuery({ period })
  const { data: topCampaigns = [] } = useGetTopCampaignsQuery({ limit: 5 })
  const { data: activationFunnelData } = useGetActivationFunnelQuery()
  const { data: activityFeedData = [] } = useGetActivityFeedQuery({ limit: 12 })
  const { data: operationalHealth } = useGetOperationalHealthQuery()

  // ── Derived values from API stats ──
  const pendingSubmissions = stats?.pendingSubmissions ?? 0
  const totalCreators = stats?.totalCreators ?? 0
  const activeCampaigns = stats?.activeCampaigns ?? 0
  const approvalRate = stats?.approvalRate ?? 0
  const poolBalance = operationalHealth?.poolBalance ?? 0
  const releaseQueueCount = stats?.pendingPayouts ?? 0
  const overdueReviews = stats?.submissionsNeedReviewToday ?? 0
  const criticalAlerts: number = 0 // comes from notifications; placeholder

  const failedPayoutsCount = operationalHealth?.failedPayoutsLast24h ?? 0
  const kycPendingCount = operationalHealth?.pendingKycCount ?? 0

  // Pool utilization from pending payout amount vs pool balance
  const pendingPayoutAmount = stats?.pendingPayouts ?? 0
  const poolUtilization = poolBalance > 0 ? Math.min(Math.round((pendingPayoutAmount / poolBalance) * 100), 100) : 0
  const poolAvailable = Math.max(poolBalance - pendingPayoutAmount, 0)

  const activationRate = activationFunnelData
    ? (activationFunnelData.registered > 0
        ? Math.round((activationFunnelData.firstSubmission / activationFunnelData.registered) * 100)
        : 0)
    : 0

  // Map API data shapes to what child components expect
  const chartCreatorGrowthData = useMemo(
    () => creatorGrowthData.map(d => ({ month: d.week, total: d.creators, new: d.creators })),
    [creatorGrowthData],
  )

  const chartSubmissionData = useMemo(
    () => submissionVolumeData.map(d => ({ week: d.week, total: d.submissions, approved: d.approved, rejected: d.rejected })),
    [submissionVolumeData],
  )

  const topCampaignsMapped = useMemo(
    () => topCampaigns.map(c => ({
      name: c.name,
      submissions: c.totalSubmissions,
      avgPayout: c.totalSubmissions > 0 ? Math.round(c.totalPaidOut / c.totalSubmissions) : 0,
      success: Math.round(c.successRate),
    })),
    [topCampaigns],
  )

  const funnelData = useMemo(() => {
    if (!activationFunnelData) return []
    const total = activationFunnelData.registered || 1
    return [
      { step: 'Registered',          count: activationFunnelData.registered,          percent: 100 },
      { step: 'Instagram Connected', count: activationFunnelData.instagramConnected,  percent: Math.round((activationFunnelData.instagramConnected / total) * 100) },
      { step: 'KYC Submitted',       count: activationFunnelData.kycSubmitted,        percent: Math.round((activationFunnelData.kycSubmitted / total) * 100) },
      { step: 'KYC Verified',        count: activationFunnelData.kycVerified,         percent: Math.round((activationFunnelData.kycVerified / total) * 100) },
      { step: 'First Submission',    count: activationFunnelData.firstSubmission,     percent: Math.round((activationFunnelData.firstSubmission / total) * 100) },
    ]
  }, [activationFunnelData])

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
      tone: (releaseQueueCount > 0 ? 'warning' : 'success') as InsightTone,
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
      description: `${kycPendingCount} pending KYC request${kycPendingCount === 1 ? '' : 's'}`,
      icon: CheckCircle,
      href: '/creators?filter=kyc_pending',
      tone: (kycPendingCount > 0 ? 'warning' : 'success') as InsightTone,
      count: kycPendingCount,
    },
  ], [pendingSubmissions, releaseQueueCount, criticalAlerts, kycPendingCount])

  const operationalStats = useMemo(() => [
    {
      icon: CheckCircle,
      label: 'Approval Rate',
      value: `${approvalRate.toFixed(1)}%`,
      numericValue: approvalRate,
      helper: `Based on ${periodConfig.label}`,
      tone: (approvalRate >= 85 ? 'success' : 'warning') as InsightTone,
    },
    {
      icon: Clock,
      label: 'Overdue Reviews',
      value: formatNumber(overdueReviews),
      numericValue: overdueReviews > 0 ? Math.max(100 - overdueReviews * 10, 20) : 100,
      helper: 'Pending for more than 24h',
      tone: (overdueReviews === 0 ? 'success' : 'critical') as InsightTone,
    },
    {
      icon: AlertTriangle,
      label: 'Failed Payouts',
      value: String(failedPayoutsCount),
      numericValue: failedPayoutsCount > 0 ? Math.max(100 - failedPayoutsCount * 10, 10) : 100,
      helper: 'Failed payouts in last 24h',
      tone: (failedPayoutsCount > 5 ? 'critical' : failedPayoutsCount > 0 ? 'warning' : 'success') as InsightTone,
    },
    {
      icon: Banknote,
      label: 'Fraud Flagged Today',
      value: `${operationalHealth?.fraudFlaggedToday ?? 0}`,
      numericValue: operationalHealth?.fraudFlaggedToday ?? 0,
      helper: `${operationalHealth?.avgSubmissionReviewHours?.toFixed(1) ?? '0'}h avg review time`,
      tone: ((operationalHealth?.fraudFlaggedToday ?? 0) > 5 ? 'warning' : 'success') as InsightTone,
    },
  ], [approvalRate, periodConfig.label, overdueReviews, failedPayoutsCount, operationalHealth])

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
        poolBalance={poolBalance}
        releaseQueueCount={releaseQueueCount}
        overdueReviews={overdueReviews}
      />

      <KpiStatCards
        pendingSubmissions={pendingSubmissions}
        overdueReviews={overdueReviews}
        poolBalance={poolBalance}
        pendingReleaseAmount={pendingPayoutAmount}
        hasFailedTxns={failedPayoutsCount > 5}
        onNavigate={navigate}
        totalCreators={totalCreators}
        activeCampaigns={activeCampaigns}
        creatorsGrowthPercent={stats?.creatorsGrowthPercent}
        submissionsGrowthPercent={stats?.submissionsGrowthPercent}
        payoutsGrowthPercent={stats?.payoutsGrowthPercent}
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
            newThisMonth={stats?.newCreatorsThisMonth}
          />
          <PayoutsPoolCard
            poolBalance={poolBalance}
            poolUtilization={poolUtilization}
            poolAvailable={poolAvailable}
            releaseQueueCount={releaseQueueCount}
            processingCount={0}
            failedCount={failedPayoutsCount}
            payoutStatusData={PAYOUT_STATUS_DATA_FALLBACK}
            onNavigate={navigate}
          />
        </div>
      </Suspense>

      {/* ── Charts Row 2 — lazy ── */}
      <Suspense fallback={<ChartRowSkeleton />}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <SubmissionVolumeChart data={chartSubmissionData} />
          <ActivationFunnelCard
            data={funnelData}
            activationRate={activationRate}
          />
        </div>
      </Suspense>

      {/* ── Top Campaigns + Activity Feed — lazy ── */}
      <Suspense fallback={<ChartRowSkeleton />}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <TopCampaignsCard
            campaigns={topCampaignsMapped}
            onNavigate={navigate}
          />
          <ActivityFeedCard
            activities={activityFeedData}
            totalCount={activityFeedData.length}
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
