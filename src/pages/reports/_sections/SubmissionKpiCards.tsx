import { memo } from 'react'
import { BarChart3, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import { KpiCard } from '../reports.types'

interface SubmissionKpiCardsProps {
  latestData: {
    total: number
    approved: number
    rejected: number
    approvalRate: number
  }
}

export const SubmissionKpiCards = memo(function SubmissionKpiCards({ latestData }: SubmissionKpiCardsProps) {
  return (
    <div className="-mx-4 sm:mx-0">
      <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3 w-full overflow-x-auto sm:overflow-visible scrollbar-hide px-4 sm:px-0">
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="Submissions This Week"
            value={latestData.total}
            icon={BarChart3}
            color="text-slate-700"
            bg="bg-slate-100"
          />
        </div>
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="Approved"
            value={latestData.approved}
            icon={CheckCircle}
            color="text-emerald-600"
            bg="bg-emerald-50"
            trend={{ value: `${latestData.approvalRate}%`, up: true }}
          />
        </div>
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="Rejected"
            value={latestData.rejected}
            icon={XCircle}
            color="text-red-600"
            bg="bg-red-50"
          />
        </div>
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="Approval Rate"
            value={`${latestData.approvalRate}%`}
            icon={TrendingUp}
            color="text-blue-600"
            bg="bg-blue-50"
            trend={{ value: '+2%', up: true }}
          />
        </div>
      </div>
    </div>
  )
})
