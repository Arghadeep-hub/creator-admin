import { lazy, Suspense, useState } from 'react'
import { DollarSign, Users, AlertTriangle } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/contexts/ToastContext'
import {
  CREATOR_GROWTH_DATA, SUBMISSION_WEEKLY_DATA,
  KYC_DISTRIBUTION, CAMPAIGNS_BY_CITY,
  FRAUD_TREND_DATA, FRAUD_TYPE_BREAKDOWN, ACTIVATION_FUNNEL_DATA,
} from '@/data/chart-data'

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

export function ReportsPage() {
  const [tab, setTab] = useState('overview')
  const { success } = useToast()

  const latestCreatorData = CREATOR_GROWTH_DATA[CREATOR_GROWTH_DATA.length - 1]
  const latestSubmissionData = SUBMISSION_WEEKLY_DATA[SUBMISSION_WEEKLY_DATA.length - 1]
  const prevCreatorData = CREATOR_GROWTH_DATA[CREATOR_GROWTH_DATA.length - 2]
  const creatorGrowthPct = prevCreatorData
    ? (((latestCreatorData.new - prevCreatorData.new) / prevCreatorData.new) * 100).toFixed(0)
    : '0'

  const currentFraudRate = FRAUD_TREND_DATA[FRAUD_TREND_DATA.length - 1].rate
  const totalFraudCases = FRAUD_TYPE_BREAKDOWN.reduce((s, f) => s + f.count, 0)
  const activationRate = ACTIVATION_FUNNEL_DATA[ACTIVATION_FUNNEL_DATA.length - 1].percent

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* ── Hero Banner ── */}
      <ReportsHero
        totalPaid={12400000}
        approvalRate={latestSubmissionData.approvalRate}
        fraudRate={currentFraudRate}
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
            <RevenueKpiCards totalPaid={12400000} monthlyPaid={1240000} avgPerCreator={5087} pendingRelease={185000} />

            <Suspense fallback={<CardSkeleton className="h-72" />}>
              <DailyPayoutsChart />
            </Suspense>

            <Suspense fallback={<CardSkeleton className="h-20" />}>
              <SubmissionKpiCards latestData={latestSubmissionData} />
            </Suspense>

            <Suspense fallback={<CardSkeleton className="h-72" />}>
              <WeeklySubmissionsChart />
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
                kycVerifiedCount={KYC_DISTRIBUTION[0].count}
                activeCampaigns={CAMPAIGNS_BY_CITY.reduce((s, c) => s + c.count, 0)}
              />
            </Suspense>

            <Suspense fallback={<ChartRowSkeleton />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CreatorGrowthChart />
                <KycPieChart />
              </div>
            </Suspense>

            <Suspense fallback={<ChartRowSkeleton />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TrustScoreChart />
                <CampaignsCityChart />
              </div>
            </Suspense>

            <Suspense fallback={<CardSkeleton className="h-60" />}>
              <SuccessRateCard />
            </Suspense>
          </div>
        </TabsContent>

        {/* ── Fraud & Funnel Tab ── */}
        <TabsContent value="integrity" className="mt-4">
          <div className="space-y-4">
            <Suspense fallback={<CardSkeleton className="h-20" />}>
              <FraudKpiCards
                currentFraudRate={currentFraudRate}
                totalFraudCases={totalFraudCases}
                activationRate={activationRate}
              />
            </Suspense>

            <Suspense fallback={<ChartRowSkeleton />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FraudTrendChart />
                <FraudBreakdownCard />
              </div>
            </Suspense>

            <Suspense fallback={<CardSkeleton className="h-80" />}>
              <ActivationFunnelCard />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
