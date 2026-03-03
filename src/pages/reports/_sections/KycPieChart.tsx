import { memo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { KYC_DISTRIBUTION } from '@/data/chart-data'
import { ChartCard, TOOLTIP_STYLE } from '../reports.types'

export const KycPieChart = memo(function KycPieChart() {
  return (
    <ChartCard title="KYC Status Distribution" subtitle="Creator verification breakdown">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={KYC_DISTRIBUTION}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            dataKey="count"
            nameKey="status"
            label={(props) => `${(props as any).status}: ${(props as any).count}`}
            labelLine={false}
          >
            {KYC_DISTRIBUTION.map((entry, i) => (
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
