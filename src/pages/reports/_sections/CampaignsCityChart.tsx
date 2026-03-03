import { memo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { CAMPAIGNS_BY_CITY } from '@/data/chart-data'
import { ChartCard, TOOLTIP_STYLE, TICK_PROPS } from '../reports.types'

export const CampaignsCityChart = memo(function CampaignsCityChart() {
  return (
    <ChartCard title="Campaigns by City" subtitle="Active campaigns per location">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={CAMPAIGNS_BY_CITY} layout="vertical" margin={{ top: 4, right: 20, bottom: 0, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis type="number" tick={TICK_PROPS} tickLine={false} axisLine={false} />
          <YAxis dataKey="city" type="category" tick={TICK_PROPS} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="count" name="Campaigns" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
})
