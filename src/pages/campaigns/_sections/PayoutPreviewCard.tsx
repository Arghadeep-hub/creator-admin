import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { INR } from './types'
import type { FormState } from './types'

interface Props {
  form: Pick<FormState, 'payoutMin' | 'payoutBase' | 'payoutMax' | 'bonusPerThousandViews' | 'status' | 'deadline'>
}

export function PayoutPreviewCard({ form }: Props) {
  const max = Math.max(form.payoutMax, 1)

  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <CardTitle>Payout Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {[
            { label: 'Minimum',          value: INR.format(form.payoutMin),  className: 'text-slate-700' },
            { label: 'Base (guaranteed)',value: INR.format(form.payoutBase), className: 'font-semibold text-primary text-base' },
            { label: 'Maximum',          value: INR.format(form.payoutMax),  className: 'text-slate-700' },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className={`num-font ${row.className}`}>{row.value}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Bonus / 1K views</span>
            <span className="num-font font-medium text-emerald-600">
              +{INR.format(form.bonusPerThousandViews)}
            </span>
          </div>
        </div>

        {/* Range visual */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-500 font-medium uppercase tracking-wide">
            <span>Min</span><span>Base</span><span>Max</span>
          </div>
          <div className="relative h-2 rounded-full bg-slate-200">
            <div
              className="absolute h-full rounded-full bg-linear-to-r from-orange-400 to-orange-600"
              style={{
                left:  `${(form.payoutMin / max) * 100}%`,
                width: `${((form.payoutMax - form.payoutMin) / max) * 100}%`,
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-primary border-2 border-white shadow-sm"
              style={{ left: `calc(${(form.payoutBase / max) * 100}% - 7px)` }}
            />
          </div>
        </div>

        {/* Status + deadline */}
        <div className="flex items-center gap-2 pt-1">
          <Badge
            className={
              form.status === 'active' ? 'bg-emerald-100 text-emerald-700'
              : form.status === 'paused' ? 'bg-amber-100 text-amber-700'
              : 'bg-slate-200 text-slate-600'
            }
          >
            {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
          </Badge>
          {form.deadline && (
            <span className="text-xs text-muted-foreground">
              Ends {new Date(form.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
