import { memo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatNumber } from '@/lib/utils'
import { ChartTooltip } from './ChartTooltip'

interface CreatorGrowthChartProps {
  data: Array<{ month: string; total: number; new: number }>
  periodLabel: string
  newThisMonth?: number
}

export const CreatorGrowthChart = memo(function CreatorGrowthChart({ data, periodLabel, newThisMonth = 0 }: CreatorGrowthChartProps) {
  return (
    <Card className="lg:col-span-2 overflow-hidden">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm sm:text-base">Creator Growth</CardTitle>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              Total vs new creator momentum ({periodLabel})
            </p>
          </div>
          <Badge variant="success" className="text-[10px] sm:text-xs font-semibold">
            +{formatNumber(newThisMonth)} this month
          </Badge>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm bg-primary" />
            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">Total</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm bg-emerald-500" />
            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">New</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={200} className="sm:!h-[240px]">
          <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="total" name="Total" stroke="#f97316" strokeWidth={2} fill="url(#totalGrad)" dot={false} activeDot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} />
            <Area type="monotone" dataKey="new" name="New" stroke="#10b981" strokeWidth={2} fill="url(#newGrad)" dot={false} activeDot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})
