import { memo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { ChartCard, CHART_MARGIN, TOOLTIP_STYLE, TICK_PROPS } from '../reports.types'
import type { SubmissionsReport } from '@/store/api/reportsApi'

interface Props {
  submissionsReport: SubmissionsReport | null
}

export const WeeklySubmissionsChart = memo(function WeeklySubmissionsChart({ submissionsReport }: Props) {
  const data = submissionsReport?.volumeByDay?.map(d => ({
    week: d.date,
    total: d.submitted,
    approved: d.approved,
    rejected: d.rejected,
  })) ?? []

  return (
    <ChartCard title="Submission Volume" subtitle="Submitted, approved & rejected over time">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="week" tick={TICK_PROPS} tickLine={false} axisLine={false} />
          <YAxis tick={TICK_PROPS} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="total" name="Total" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
          <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[6, 6, 0, 0]} />
          <Bar dataKey="rejected" name="Rejected" fill="#f87171" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
})
