import { memo } from 'react'
import { Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { INR } from './types'
import type { FormState } from './types'

interface Props {
  form: Pick<FormState, 'payoutMin' | 'payoutBase' | 'payoutMax' | 'bonusPerThousandViews' | 'isActive' | 'deadline' | 'totalSpots'>
  poolBalance?: number
}

export const PayoutPreviewCard = memo(function PayoutPreviewCard({ form, poolBalance }: Props) {
  // Use the true maximum across all three values so nothing overflows
  const scale = Math.max(form.payoutMax, form.payoutBase, form.payoutMin, 1)
  const pct = (v: number) => Math.max(0, Math.min((v / scale) * 100, 100))

  const minPct   = pct(form.payoutMin)
  const basePct  = pct(form.payoutBase)
  const maxPct   = pct(form.payoutMax)
  const rangePct = Math.max(maxPct - minPct, 0)

  return (
    <Card className="lg:sticky lg:top-20 overflow-hidden">
      <div className="h-1 bg-linear-to-r from-primary via-amber-400 to-primary" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          Payout Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prominent base payout */}
        <div className="rounded-xl bg-linear-to-br from-primary/5 via-orange-50/80 to-amber-50/60 border border-primary/10 p-4 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Base Payout</p>
          <p className="text-2xl sm:text-xl font-bold text-primary num-font">{INR.format(form.payoutBase)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Guaranteed per creator</p>
        </div>

        {/* Min / Max / Bonus breakdown */}
        <div className="space-y-2.5">
          {[
            { label: 'Minimum', value: INR.format(form.payoutMin) },
            { label: 'Maximum', value: INR.format(form.payoutMax) },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="num-font font-medium text-slate-700">{row.value}</span>
            </div>
          ))}
          <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Bonus / 1K views</span>
            <span className="num-font font-semibold text-emerald-600">
              +{INR.format(form.bonusPerThousandViews)}
            </span>
          </div>
        </div>

        {/* Range visual */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5 space-y-2.5">
          {/* Bar */}
          <div className="relative h-2.5 rounded-full bg-slate-200">
            {/* Filled range from min to max */}
            <div
              className="absolute h-full rounded-full bg-linear-to-r from-orange-400 to-orange-500 transition-all"
              style={{ left: `${minPct}%`, width: `${rangePct}%` }}
            />
            {/* Base dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4.5 w-4.5 rounded-full bg-primary border-2 border-white shadow-md transition-all"
              style={{ left: `${basePct}%` }}
            />
          </div>

          {/* Value labels — always readable as a flex row */}
          <div className="flex items-center justify-between text-[11px] num-font">
            <div className="text-slate-400">
              <span className="font-semibold uppercase tracking-wide text-[10px]">Min </span>
              {INR.format(form.payoutMin)}
            </div>
            <div className="text-primary font-semibold">
              <span className="uppercase tracking-wide text-[10px]">Base </span>
              {INR.format(form.payoutBase)}
            </div>
            <div className="text-slate-400 text-right">
              <span className="font-semibold uppercase tracking-wide text-[10px]">Max </span>
              {INR.format(form.payoutMax)}
            </div>
          </div>
        </div>

        {/* Status + deadline */}
        <div className="flex items-center gap-2.5 pt-0.5">
          <Badge
            className={
              form.isActive ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-600'
            }
          >
            {form.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {form.deadline && (
            <span className="text-xs text-muted-foreground">
              Ends {new Date(form.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>

        {/* Pool balance indicator */}
        {poolBalance != null && (() => {
          const maxCost = form.payoutMax * (form.totalSpots ?? 0)
          const isFunded = poolBalance >= maxCost
          const shortfall = maxCost - poolBalance
          return (
            <div className="border-t border-slate-100 pt-3">
              {isFunded ? (
                <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                  Pool funded
                </Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-700 text-xs">
                  Pool needs {INR.format(shortfall)} more to publish
                </Badge>
              )}
            </div>
          )
        })()}
      </CardContent>
    </Card>
  )
})
