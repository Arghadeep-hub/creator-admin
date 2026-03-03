import { memo } from 'react'
import { Download } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ReportsHeroProps {
  totalPaid: number
  approvalRate: number
  fraudRate: number
  activationRate: number
  onExport: () => void
}

export const ReportsHero = memo(function ReportsHero({
  totalPaid,
  approvalRate,
  fraudRate,
  activationRate,
  onExport,
}: ReportsHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 via-indigo-50/30 to-white border border-blue-100/50 p-4 sm:p-6 lg:p-8">
      {/* Decorative background orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-linear-to-bl from-blue-200/25 to-transparent rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-linear-to-tr from-indigo-200/20 to-transparent rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-linear-to-tl from-blue-100/15 to-transparent rounded-full pointer-events-none" />

      <div className="relative">
        {/* Top: Title + Export button */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="font-display text-lg sm:text-2xl font-bold text-foreground tracking-tight">
              Reports & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Platform-wide insights
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl self-start"
            onClick={onExport}
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Live status pills -- horizontal scroll on mobile */}
        <div className="-mx-4 sm:mx-0 mt-4 sm:mt-5">
          <div className="flex sm:flex-wrap gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-0 pb-1 sm:pb-0">
            {/* Total Paid */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 px-3 sm:px-3.5 py-1.5 shadow-sm shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-foreground whitespace-nowrap">
                {formatCurrency(totalPaid)} total paid
              </span>
            </div>

            {/* Approval Rate */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 px-3 sm:px-3.5 py-1.5 shadow-sm shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-foreground whitespace-nowrap">
                {approvalRate}% approval
              </span>
            </div>

            {/* Fraud Rate */}
            <div className={cn(
              'inline-flex items-center gap-2 rounded-full backdrop-blur-sm border px-3 sm:px-3.5 py-1.5 shadow-sm shrink-0',
              fraudRate > 5
                ? 'bg-red-50/80 border-red-200/60'
                : 'bg-white/80 border-slate-200/60'
            )}>
              <span className="relative flex h-2 w-2">
                {fraudRate > 5 && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className={cn(
                'text-[11px] sm:text-xs font-medium whitespace-nowrap',
                fraudRate > 5 ? 'text-red-700' : 'text-foreground'
              )}>
                {fraudRate}% fraud rate
              </span>
            </div>

            {/* Activation Rate */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 px-3 sm:px-3.5 py-1.5 shadow-sm shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-foreground whitespace-nowrap">
                {activationRate}% activation
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
