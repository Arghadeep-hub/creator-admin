import { memo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ChartTooltip } from './ChartTooltip'

interface SubmissionVolumeChartProps {
  data: Array<{ week: string; total: number; approved: number; rejected: number }>
}

export const SubmissionVolumeChart = memo(function SubmissionVolumeChart({ data }: SubmissionVolumeChartProps) {
  return (
    <Card className="lg:col-span-2 overflow-hidden">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm sm:text-base">Submission Volume & Approval</CardTitle>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              Workload and review outcomes comparison
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm bg-primary" />
            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">Total</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm bg-emerald-500" />
            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">Approved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm bg-red-400" />
            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">Rejected</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={200} className="sm:!h-[240px]">
          <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="total" name="Total" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rejected" name="Rejected" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})
