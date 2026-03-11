import { memo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { ChartCard, TOOLTIP_STYLE, TICK_PROPS } from '../reports.types'
import type { CreatorsReport } from '@/store/api/reportsApi'

interface Props {
  creatorsReport: CreatorsReport | null
}

export const CampaignsCityChart = memo(function CampaignsCityChart({ creatorsReport }: Props) {
  const data = creatorsReport?.byCity ?? []

  return (
    <ChartCard title="Creators by City" subtitle="Creator count per location">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, bottom: 0, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis type="number" tick={TICK_PROPS} tickLine={false} axisLine={false} />
          <YAxis dataKey="city" type="category" tick={TICK_PROPS} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="count" name="Creators" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
})
