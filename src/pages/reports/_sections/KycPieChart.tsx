import { memo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ChartCard, TOOLTIP_STYLE } from '../reports.types'
import type { CreatorsReport } from '@/store/api/reportsApi'

const KYC_COLORS: Record<string, string> = {
  verified: '#10b981',
  pending: '#f59e0b',
  rejected: '#ef4444',
}

interface Props {
  creatorsReport: CreatorsReport | null
}

export const KycPieChart = memo(function KycPieChart({ creatorsReport }: Props) {
  const data = creatorsReport?.kycDistribution?.map(d => ({
    status: d.status,
    count: d.count,
    color: KYC_COLORS[d.status] ?? '#94a3b8',
  })) ?? []

  return (
    <ChartCard title="KYC Status Distribution" subtitle="Creator verification breakdown">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            dataKey="count"
            nameKey="status"
            label={(props) => `${(props as unknown as { status: string }).status}: ${(props as unknown as { count: number }).count}`}
            labelLine={false}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
})
