import { memo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartCard, CHART_MARGIN, TOOLTIP_STYLE, TICK_PROPS } from '../reports.types'
import type { FraudReport } from '@/store/api/reportsApi'

interface Props {
  fraudReport: FraudReport | null
}

export const FraudTrendChart = memo(function FraudTrendChart({ fraudReport }: Props) {
  const data = fraudReport?.trendByDay?.map(d => ({
    week: d.date,
    rate: d.flagged,
  })) ?? []

  return (
    <ChartCard title="Fraud Flag Trend" subtitle="Daily fraud detection count">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="week" tick={TICK_PROPS} tickLine={false} axisLine={false} />
          <YAxis tick={TICK_PROPS} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Area type="monotone" dataKey="rate" name="Fraud Flags" stroke="#ef4444" fill="url(#fraudGrad)" strokeWidth={2.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
})
