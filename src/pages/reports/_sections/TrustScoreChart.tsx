import { memo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { TRUST_SCORE_DISTRIBUTION } from '@/data/chart-data'
import { ChartCard, CHART_MARGIN, TOOLTIP_STYLE, TICK_PROPS } from '../reports.types'

export const TrustScoreChart = memo(function TrustScoreChart() {
  return (
    <ChartCard title="Trust Score Distribution" subtitle="Creator trust score range breakdown">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={TRUST_SCORE_DISTRIBUTION} margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="range" tick={TICK_PROPS} tickLine={false} axisLine={false} />
          <YAxis tick={TICK_PROPS} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="count" name="Creators" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
})
