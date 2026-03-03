import { memo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { DAILY_PAYOUTS_DATA } from '@/data/chart-data'
import { ChartCard, CHART_MARGIN, TOOLTIP_STYLE, TICK_PROPS } from '../reports.types'

export const DailyPayoutsChart = memo(function DailyPayoutsChart() {
  return (
    <ChartCard title="Daily Payouts" subtitle="Last 30 days — paid, processing & failed">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={DAILY_PAYOUTS_DATA} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={TICK_PROPS} tickLine={false} axisLine={false} />
          <YAxis tick={TICK_PROPS} tickLine={false} axisLine={false} tickFormatter={v => `\u20B9${(v / 1000).toFixed(0)}K`} />
          <Tooltip formatter={(v) => [typeof v === 'number' ? formatCurrency(v) : v, '']} contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="paid" name="Paid" stroke="#10b981" fill="url(#paidGrad)" strokeWidth={2.5} dot={false} />
          <Area type="monotone" dataKey="processing" name="Processing" stroke="#0ea5e9" strokeWidth={2} fillOpacity={0} dot={false} />
          <Area type="monotone" dataKey="failed" name="Failed" stroke="#ef4444" strokeWidth={2} fillOpacity={0} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
})
