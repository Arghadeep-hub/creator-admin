import { memo } from 'react'
import { AlertTriangle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

interface UrgentAlertBannerProps {
  failedCount: number
  failedAmount: number
  onResolve: () => void
}

export const UrgentAlertBanner = memo(function UrgentAlertBanner({
  failedCount,
  failedAmount,
  onResolve,
}: UrgentAlertBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-red-500 via-rose-500 to-red-600 p-4 text-white shadow-xl shadow-red-500/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent_70%)]" />
      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 ring-1 ring-white/20 animate-pulse">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-[15px]">{failedCount} payouts failed</p>
            <p className="text-red-100 text-xs mt-0.5">{formatCurrency(failedAmount)} at risk — resolve to maintain creator trust</p>
          </div>
        </div>
        <Button size="sm" className="bg-white text-red-600 hover:bg-red-50 shrink-0 font-bold shadow-lg shadow-red-900/20 rounded-xl h-10 sm:h-9 active:scale-[0.98]" onClick={onResolve}>
          <Zap className="h-3.5 w-3.5" />Resolve Now
        </Button>
      </div>
    </div>
  )
})
