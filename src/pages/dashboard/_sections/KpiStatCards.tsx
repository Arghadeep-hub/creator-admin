import { memo } from 'react'
import { Users, Megaphone, Video, Wallet } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface KpiStatCardsProps {
  pendingSubmissions: number
  overdueReviews: number
  poolBalance: number
  pendingReleaseAmount: number
  hasFailedTxns: boolean
  onNavigate: (path: string) => void
  totalCreators?: number
  activeCampaigns?: number
  creatorsGrowthPercent?: number
  submissionsGrowthPercent?: number
  payoutsGrowthPercent?: number
}

export const KpiStatCards = memo(function KpiStatCards({
  pendingSubmissions,
  overdueReviews,
  poolBalance,
  pendingReleaseAmount,
  hasFailedTxns,
  onNavigate,
  totalCreators = 0,
  activeCampaigns = 0,
  creatorsGrowthPercent,
  submissionsGrowthPercent,
  payoutsGrowthPercent,
}: KpiStatCardsProps) {
  return (
    <div className="-mx-4 sm:mx-0">
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 gap-y-4 sm:gap-4 w-full overflow-x-auto sm:overflow-visible scrollbar-hide px-4 sm:px-0">
        <button
          type="button"
          className="text-left cursor-pointer group shrink-0 sm:shrink w-[72%] sm:w-auto"
          onClick={() => onNavigate('/creators')}
        >
          <StatCard
            label="Total Creators"
            value={formatNumber(totalCreators)}
            subValue="Creator base"
            trend={creatorsGrowthPercent}
            trendLabel="vs last month"
            icon={Users}
            iconColor="text-blue-500"
            iconBg="bg-blue-50"
            className="h-full transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5"
          />
        </button>

        <button
          type="button"
          className="text-left cursor-pointer group shrink-0 sm:shrink w-[72%] sm:w-auto"
          onClick={() => onNavigate('/campaigns')}
        >
          <StatCard
            label="Active Campaigns"
            value={String(activeCampaigns)}
            subValue="Currently running"
            trend={2.1}
            trendLabel="vs last month"
            icon={Megaphone}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-50"
            className="h-full transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5"
          />
        </button>

        <button
          type="button"
          className="text-left cursor-pointer group shrink-0 sm:shrink w-[72%] sm:w-auto"
          onClick={() => onNavigate('/submissions?filter=pending')}
        >
          <StatCard
            label="Pending Reviews"
            value={pendingSubmissions}
            subValue={`${overdueReviews} need review today`}
            trend={submissionsGrowthPercent !== undefined ? -submissionsGrowthPercent : undefined}
            trendLabel="vs last period"
            icon={Video}
            iconColor="text-primary"
            iconBg="bg-orange-50"
            highlight={pendingSubmissions > 10}
            className="h-full transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5"
          />
        </button>

        <button
          type="button"
          className="text-left cursor-pointer group shrink-0 sm:shrink w-[72%] sm:w-auto"
          onClick={() => onNavigate('/payouts')}
        >
          <StatCard
            label="Pool Balance"
            value={formatCurrency(poolBalance)}
            subValue={`${formatCurrency(pendingReleaseAmount)} pending release`}
            trend={payoutsGrowthPercent}
            trendLabel="vs last month"
            icon={Wallet}
            iconColor="text-purple-500"
            iconBg="bg-purple-50"
            highlight={hasFailedTxns}
            className="h-full transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5"
          />
        </button>
      </div>
    </div>
  )
})
