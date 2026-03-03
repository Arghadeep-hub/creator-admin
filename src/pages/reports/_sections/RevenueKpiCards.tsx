import { memo } from 'react'
import { CheckCircle, TrendingUp, Users, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { KpiCard } from '../reports.types'

interface RevenueKpiCardsProps {
  totalPaid: number
  monthlyPaid: number
  avgPerCreator: number
  pendingRelease: number
}

export const RevenueKpiCards = memo(function RevenueKpiCards({
  totalPaid,
  monthlyPaid,
  avgPerCreator,
  pendingRelease,
}: RevenueKpiCardsProps) {
  return (
    <div className="-mx-4 sm:mx-0">
      <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3 w-full overflow-x-auto sm:overflow-visible scrollbar-hide px-4 sm:px-0">
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="Total Paid Out"
            value={formatCurrency(totalPaid)}
            icon={CheckCircle}
            color="text-emerald-600"
            bg="bg-emerald-50"
            trend={{ value: '+12%', up: true }}
          />
        </div>
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="This Month"
            value={formatCurrency(monthlyPaid)}
            icon={TrendingUp}
            color="text-primary"
            bg="bg-orange-50"
            trend={{ value: '+8%', up: true }}
          />
        </div>
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="Avg per Creator"
            value={formatCurrency(avgPerCreator)}
            icon={Users}
            color="text-blue-600"
            bg="bg-blue-50"
            trend={{ value: '+3%', up: true }}
          />
        </div>
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="Pending Release"
            value={formatCurrency(pendingRelease)}
            icon={Clock}
            color="text-amber-600"
            bg="bg-amber-50"
            trend={{ value: '\u22125%', up: false }}
          />
        </div>
      </div>
    </div>
  )
})
