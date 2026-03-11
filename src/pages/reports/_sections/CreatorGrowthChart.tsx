import { memo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { ChartCard, CHART_MARGIN, TOOLTIP_STYLE, TICK_PROPS } from '../reports.types'
import type { CreatorsReport } from '@/store/api/reportsApi'

interface Props {
  creatorsReport: CreatorsReport | null
}

export const CreatorGrowthChart = memo(function CreatorGrowthChart({ creatorsReport }: Props) {
  const data = creatorsReport?.growthByMonth ?? []

  return (
    <ChartCard title="Creator Growth" subtitle="Total & new creators over time">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id="creatorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={TICK_PROPS} tickLine={false} axisLine={false} />
          <YAxis tick={TICK_PROPS} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="total" name="Total Creators" stroke="#f97316" fill="url(#creatorGrad)" strokeWidth={2.5} dot={false} />
          <Area type="monotone" dataKey="new" name="New" stroke="#10b981" fillOpacity={0} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
})
