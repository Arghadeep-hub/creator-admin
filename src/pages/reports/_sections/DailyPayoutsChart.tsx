import { memo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { ChartCard, CHART_MARGIN, TOOLTIP_STYLE, TICK_PROPS } from '../reports.types'
import type { RevenueReport } from '@/store/api/reportsApi'

interface Props {
  revenueReport: RevenueReport | null
}

export const DailyPayoutsChart = memo(function DailyPayoutsChart({ revenueReport }: Props) {
  const data = revenueReport?.byMonth?.map(m => ({
    date: m.month,
    paid: m.payouts,
    processing: 0,
    failed: 0,
  })) ?? []

  return (
    <ChartCard title="Monthly Payouts" subtitle="Paid out over time">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={TICK_PROPS} tickLine={false} axisLine={false} />
          <YAxis tick={TICK_PROPS} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
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
