import { memo } from 'react'
import { Users, TrendingUp, CheckCircle, Megaphone } from 'lucide-react'
import { KpiCard } from '../reports.types'

interface CreatorKpiCardsProps {
  latestCreatorData: { total: number; new: number }
  creatorGrowthPct: string
  kycVerifiedCount: number
  activeCampaigns: number
}

export const CreatorKpiCards = memo(function CreatorKpiCards({
  latestCreatorData,
  creatorGrowthPct,
  kycVerifiedCount,
  activeCampaigns,
}: CreatorKpiCardsProps) {
  return (
    <div className="-mx-4 sm:mx-0">
      <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3 w-full overflow-x-auto sm:overflow-visible scrollbar-hide px-4 sm:px-0">
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="Total Creators"
            value={latestCreatorData.total.toLocaleString()}
            icon={Users}
            color="text-primary"
            bg="bg-orange-50"
            trend={{ value: `+${creatorGrowthPct}%`, up: true }}
          />
        </div>
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="New This Month"
            value={`+${latestCreatorData.new}`}
            icon={TrendingUp}
            color="text-emerald-600"
            bg="bg-emerald-50"
            trend={{ value: '+18%', up: true }}
          />
        </div>
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="KYC Verified"
            value={kycVerifiedCount.toLocaleString()}
            icon={CheckCircle}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
        </div>
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="Active Campaigns"
            value={activeCampaigns}
            icon={Megaphone}
            color="text-blue-600"
            bg="bg-blue-50"
            trend={{ value: '+5', up: true }}
          />
        </div>
      </div>
    </div>
  )
})
