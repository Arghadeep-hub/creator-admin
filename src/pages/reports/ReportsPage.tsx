import { lazy, Suspense, useState } from 'react'
import { DollarSign, Users, AlertTriangle } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PageLoader } from '@/components/ui/PageLoader'
import { EmptyState } from '@/components/shared/EmptyState'
import { useToast } from '@/contexts/ToastContext'
import {
  useGetCreatorsReportQuery,
  useGetSubmissionsReportQuery,
  useGetRevenueReportQuery,
  useGetFraudReportQuery,
  useGetKycReportQuery,
} from '@/store/api/reportsApi'

// ── Above the fold — regular imports ──
import { ReportsHero } from './_sections/ReportsHero'
import { RevenueKpiCards } from './_sections/RevenueKpiCards'

// ── Below the fold — lazy loaded (overview tab) ──
const DailyPayoutsChart = lazy(() => import('./_sections/DailyPayoutsChart').then(m => ({ default: m.DailyPayoutsChart })))
const SubmissionKpiCards = lazy(() => import('./_sections/SubmissionKpiCards').then(m => ({ default: m.SubmissionKpiCards })))
const WeeklySubmissionsChart = lazy(() => import('./_sections/WeeklySubmissionsChart').then(m => ({ default: m.WeeklySubmissionsChart })))

// ── Below the fold — lazy loaded (platform tab) ──
const CreatorKpiCards = lazy(() => import('./_sections/CreatorKpiCards').then(m => ({ default: m.CreatorKpiCards })))
const CreatorGrowthChart = lazy(() => import('./_sections/CreatorGrowthChart').then(m => ({ default: m.CreatorGrowthChart })))
const KycPieChart = lazy(() => import('./_sections/KycPieChart').then(m => ({ default: m.KycPieChart })))
const TrustScoreChart = lazy(() => import('./_sections/TrustScoreChart').then(m => ({ default: m.TrustScoreChart })))
const CampaignsCityChart = lazy(() => import('./_sections/CampaignsCityChart').then(m => ({ default: m.CampaignsCityChart })))
const SuccessRateCard = lazy(() => import('./_sections/SuccessRateCard').then(m => ({ default: m.SuccessRateCard })))

// ── Below the fold — lazy loaded (integrity tab) ──
const FraudKpiCards = lazy(() => import('./_sections/FraudKpiCards').then(m => ({ default: m.FraudKpiCards })))
const FraudTrendChart = lazy(() => import('./_sections/FraudTrendChart').then(m => ({ default: m.FraudTrendChart })))
const FraudBreakdownCard = lazy(() => import('./_sections/FraudBreakdownCard').then(m => ({ default: m.FraudBreakdownCard })))
const ActivationFunnelCard = lazy(() => import('./_sections/ActivationFunnelCard').then(m => ({ default: m.ActivationFunnelCard })))

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      <CardSkeleton className="h-64 sm:h-72" />
      <CardSkeleton className="h-64 sm:h-72" />
    </div>
  )
}

const DEFAULT_PERIOD = '30d' as const

export function ReportsPage() {
  const [tab, setTab] = useState('overview')
  const { success } = useToast()

  const { data: creatorsReport, isLoading: isCreatorsLoading, isError: isCreatorsError, refetch: refetchCreators } = useGetCreatorsReportQuery({ period: DEFAULT_PERIOD })
  const { data: submissionsReport, isLoading: isSubmissionsLoading } = useGetSubmissionsReportQuery({ period: DEFAULT_PERIOD })
  const { data: revenueReport, isLoading: isRevenueLoading } = useGetRevenueReportQuery({ period: DEFAULT_PERIOD })
  const { data: fraudReport, isLoading: isFraudLoading } = useGetFraudReportQuery({ period: DEFAULT_PERIOD })
  const { data: kycReport } = useGetKycReportQuery({ period: DEFAULT_PERIOD })

  const isInitialLoading = isCreatorsLoading || isRevenueLoading || isSubmissionsLoading

  if (isInitialLoading) return <PageLoader />
  if (isCreatorsError) return (
    <EmptyState
      title="Failed to load reports"
      description="Unable to fetch report data. Please try again."
      actionLabel="Retry"
      onAction={refetchCreators}
    />
  )

  // Derive hero stats from API data
  const totalPaid = revenueReport?.totalPaidOut ?? 0
  const approvalRate = submissionsReport?.approvalRate ?? 0
  const fraudRate = fraudReport?.fraudRatePercent ?? 0
  const activationRate = creatorsReport?.activeCreators && creatorsReport?.totalCreators
    ? Math.round((creatorsReport.activeCreators / creatorsReport.totalCreators) * 100)
    : 0

  // Overview tab data
  const latestSubmissionData = {
    total: submissionsReport?.totalSubmissions ?? 0,
    approved: submissionsReport?.approvedSubmissions ?? 0,
    rejected: submissionsReport?.rejectedSubmissions ?? 0,
    approvalRate: submissionsReport?.approvalRate ?? 0,
  }

  // Platform tab data
  const latestCreatorData = {
    total: creatorsReport?.totalCreators ?? 0,
    new: creatorsReport?.newCreators ?? 0,
  }
  const kycVerifiedCount = creatorsReport?.kycVerified ?? kycReport?.totalVerified ?? 0
  const activeCampaigns = creatorsReport?.byCity?.reduce((s, c) => s + c.count, 0) ?? 0
  const creatorGrowthPct = creatorsReport?.growthByMonth?.length && creatorsReport.growthByMonth.length >= 2
    ? String(Math.round(((creatorsReport.growthByMonth[creatorsReport.growthByMonth.length - 1].new - creatorsReport.growthByMonth[creatorsReport.growthByMonth.length - 2].new) / (creatorsReport.growthByMonth[creatorsReport.growthByMonth.length - 2].new || 1)) * 100))
    : '0'

  // Integrity tab data
  const currentFraudRate = fraudReport?.fraudRatePercent ?? 0
  const totalFraudCases = fraudReport?.totalFraudFlags ?? 0

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* ── Hero Banner ── */}
      <ReportsHero
        totalPaid={totalPaid}
        approvalRate={approvalRate}
        fraudRate={fraudRate}
        activationRate={activationRate}
        onExport={() => success('Report exported')}
      />

      {/* ── Tabs ── */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-slate-100/80 border border-slate-200/60 rounded-2xl p-1 h-auto gap-0.5">
          <TabsTrigger value="overview" className="rounded-xl data-[state=active]:shadow-sm gap-1.5 text-xs">
            <DollarSign className="h-3.5 w-3.5" />Overview
          </TabsTrigger>
          <TabsTrigger value="platform" className="rounded-xl data-[state=active]:shadow-sm gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" />Creators & Campaigns
          </TabsTrigger>
          <TabsTrigger value="integrity" className="rounded-xl data-[state=active]:shadow-sm gap-1.5 text-xs">
            <AlertTriangle className="h-3.5 w-3.5" />Fraud & Funnel
          </TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ── */}
        <TabsContent value="overview" className="mt-4">
          <div className="space-y-4">
            <RevenueKpiCards
              totalPaid={revenueReport?.totalPaidOut ?? 0}
              monthlyPaid={revenueReport?.byMonth?.[revenueReport.byMonth.length - 1]?.payouts ?? 0}
              avgPerCreator={revenueReport?.avgPayoutPerCreator ?? 0}
              pendingRelease={revenueReport?.totalLocked ?? 0}
            />

            <Suspense fallback={<CardSkeleton className="h-72" />}>
              <DailyPayoutsChart revenueReport={revenueReport ?? null} />
            </Suspense>

            <Suspense fallback={<CardSkeleton className="h-20" />}>
              <SubmissionKpiCards latestData={latestSubmissionData} />
            </Suspense>

            <Suspense fallback={<CardSkeleton className="h-72" />}>
              <WeeklySubmissionsChart submissionsReport={submissionsReport ?? null} />
            </Suspense>
          </div>
        </TabsContent>

        {/* ── Creators & Campaigns Tab ── */}
        <TabsContent value="platform" className="mt-4">
          <div className="space-y-4">
            <Suspense fallback={<CardSkeleton className="h-20" />}>
              <CreatorKpiCards
                latestCreatorData={latestCreatorData}
                creatorGrowthPct={creatorGrowthPct}
                kycVerifiedCount={kycVerifiedCount}
                activeCampaigns={activeCampaigns}
              />
            </Suspense>

            <Suspense fallback={<ChartRowSkeleton />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CreatorGrowthChart creatorsReport={creatorsReport ?? null} />
                <KycPieChart creatorsReport={creatorsReport ?? null} />
              </div>
            </Suspense>

            <Suspense fallback={<ChartRowSkeleton />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TrustScoreChart creatorsReport={creatorsReport ?? null} />
                <CampaignsCityChart creatorsReport={creatorsReport ?? null} />
              </div>
            </Suspense>

            <Suspense fallback={<CardSkeleton className="h-60" />}>
              <SuccessRateCard submissionsReport={submissionsReport ?? null} />
            </Suspense>
          </div>
        </TabsContent>

        {/* ── Fraud & Funnel Tab ── */}
        <TabsContent value="integrity" className="mt-4">
          <div className="space-y-4">
            {isFraudLoading ? (
              <CardSkeleton className="h-20" />
            ) : (
              <Suspense fallback={<CardSkeleton className="h-20" />}>
                <FraudKpiCards
                  currentFraudRate={currentFraudRate}
                  totalFraudCases={totalFraudCases}
                  activationRate={activationRate}
                />
              </Suspense>
            )}

            <Suspense fallback={<ChartRowSkeleton />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FraudTrendChart fraudReport={fraudReport ?? null} />
                <FraudBreakdownCard fraudReport={fraudReport ?? null} />
              </div>
            </Suspense>

            <Suspense fallback={<CardSkeleton className="h-80" />}>
              <ActivationFunnelCard creatorsReport={creatorsReport ?? null} />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
