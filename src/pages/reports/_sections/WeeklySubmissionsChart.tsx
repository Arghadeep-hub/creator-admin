import { memo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { SUBMISSION_WEEKLY_DATA } from '@/data/chart-data'
import { ChartCard, CHART_MARGIN, TOOLTIP_STYLE, TICK_PROPS } from '../reports.types'

export const WeeklySubmissionsChart = memo(function WeeklySubmissionsChart() {
  return (
    <ChartCard title="Weekly Submission Trends" subtitle="Total, approved & rejected over time">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={SUBMISSION_WEEKLY_DATA} margin={CHART_MARGIN}>
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
