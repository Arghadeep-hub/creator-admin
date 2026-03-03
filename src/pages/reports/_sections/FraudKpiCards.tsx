import { memo } from 'react'
import { AlertTriangle, XCircle, Target } from 'lucide-react'
import { KpiCard } from '../reports.types'

interface FraudKpiCardsProps {
  currentFraudRate: number
  totalFraudCases: number
  activationRate: number
}

export const FraudKpiCards = memo(function FraudKpiCards({
  currentFraudRate,
  totalFraudCases,
  activationRate,
}: FraudKpiCardsProps) {
  return (
    <div className="-mx-4 sm:mx-0">
      <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto sm:overflow-visible scrollbar-hide px-4 sm:px-0">
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="Current Fraud Rate"
            value={`${currentFraudRate}%`}
            icon={AlertTriangle}
            color="text-red-600"
            bg="bg-red-50"
            trend={{ value: '−0.3%', up: true }}
          />
        </div>
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="Total Fraud Cases"
            value={totalFraudCases}
            icon={XCircle}
            color="text-amber-600"
            bg="bg-amber-50"
          />
        </div>
        <div className="shrink-0 w-[72%] sm:shrink sm:w-auto">
          <KpiCard
            label="Activation Rate"
            value={`${activationRate}%`}
            icon={Target}
            color="text-blue-600"
            bg="bg-blue-50"
            trend={{ value: '+2%', up: true }}
          />
        </div>
      </div>
    </div>
  )
})
