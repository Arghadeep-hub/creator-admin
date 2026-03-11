import { memo, useState } from 'react'
import { AlertTriangle, Zap, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency } from '@/lib/utils'

interface UrgentAlertBannerProps {
  failedCount: number
  failedAmount: number
  onResolve: () => void
}

const BANNER_STYLES = `
@keyframes urgent-shake {
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(-8deg); }
  20% { transform: rotate(8deg); }
  30% { transform: rotate(-6deg); }
  40% { transform: rotate(6deg); }
  50% { transform: rotate(0deg); }
}
@keyframes urgent-breathe {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.92; }
}
.urgent-shake-icon {
  animation: urgent-shake 2.5s ease-in-out infinite;
}
.urgent-breathe {
  animation: urgent-breathe 3s ease-in-out infinite;
}
`

export const UrgentAlertBanner = memo(function UrgentAlertBanner({
  failedCount,
  failedAmount,
  onResolve,
}: UrgentAlertBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <>
      <style>{BANNER_STYLES}</style>
      <div className={cn(
        'urgent-breathe relative overflow-hidden rounded-2xl bg-linear-to-r from-red-500 via-rose-500 to-red-600 text-white shadow-xl shadow-red-500/20',
        'p-4 sm:p-4',
      )}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent_70%)]" />

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-150 z-10"
          aria-label="Dismiss alert"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 pr-8 sm:pr-0">
            <div className="urgent-shake-icon h-11 w-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 ring-1 ring-white/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-[15px]">{failedCount} payouts failed</p>
              <p className="text-red-100 text-xs mt-0.5">{formatCurrency(failedAmount)} at risk — resolve to maintain creator trust</p>
            </div>
          </div>

          <Button
            size="sm"
            className="bg-white text-red-600 hover:bg-red-50 shrink-0 font-bold shadow-lg shadow-red-900/20 rounded-xl h-11 sm:h-9 w-full sm:w-auto active:scale-[0.98]"
            onClick={onResolve}
          >
            <Zap className="h-3.5 w-3.5" />Resolve Now
          </Button>
        </div>
      </div>
    </>
  )
})
