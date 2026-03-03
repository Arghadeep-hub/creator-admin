import { memo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Banknote, Lock, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn, formatCurrency } from '@/lib/utils'
import { PIE_COLORS } from '../dashboard.types'

interface PayoutsPoolCardProps {
  poolBalance: number
  poolUtilization: number
  poolAvailable: number
  releaseQueueCount: number
  processingCount: number
  failedCount: number
  failedPayoutRate: number
  payoutStatusData: Array<{ status: string; value: number }>
  onNavigate: (path: string) => void
}

export const PayoutsPoolCard = memo(function PayoutsPoolCard({
  poolBalance,
  poolUtilization,
  poolAvailable,
  releaseQueueCount,
  processingCount,
  failedCount,
  failedPayoutRate,
  payoutStatusData,
  onNavigate,
}: PayoutsPoolCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm sm:text-base">Payouts & Pool</CardTitle>
          <Badge variant={failedPayoutRate > 5 ? 'warning' : 'success'} className="text-xs font-semibold">
            {failedPayoutRate}% failed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {/* Pool utilization mini-card */}
        <button
          type="button"
          onClick={() => onNavigate('/payouts')}
          className="w-full rounded-xl bg-linear-to-br from-slate-800 to-slate-900 text-white p-3 sm:p-3.5 mb-3 sm:mb-4 text-left cursor-pointer hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Banknote className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[11px] text-slate-400">Pool Balance</span>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <p className="text-lg sm:text-xl font-bold num-font">{formatCurrency(poolBalance)}</p>
          <div className="mt-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>{poolUtilization}% allocated</span>
              <span>{formatCurrency(poolAvailable)} free</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  poolUtilization > 80 ? 'bg-red-400' : poolUtilization > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                )}
                style={{ width: `${poolUtilization}%` }}
              />
            </div>
          </div>
          {releaseQueueCount > 0 && (
            <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-white/10 text-[11px]">
              <span className="flex items-center gap-1 text-blue-400">
                <Lock className="h-3 w-3" />{processingCount} ready
              </span>
              {failedCount > 0 && (
                <span className="flex items-center gap-1 text-red-400">
                  <AlertTriangle className="h-3 w-3" />{failedCount} failed
                </span>
              )}
            </div>
          )}
        </button>

        {/* Pie chart */}
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={payoutStatusData}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={66}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {payoutStatusData.map((_entry, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, '']}
                contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          {payoutStatusData.map((item, i) => (
            <div key={item.status} className="flex items-center gap-2 rounded-lg bg-slate-50/70 px-2.5 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
              <span className="text-[11px] text-muted-foreground flex-1 truncate">{item.status}</span>
              <span className="text-xs font-bold num-font">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
