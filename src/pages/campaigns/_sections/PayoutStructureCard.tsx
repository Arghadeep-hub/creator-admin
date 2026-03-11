import { memo, useMemo } from 'react'
import { IndianRupee, AlertCircle, Lightbulb } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FormState, SetField } from './types'

interface Props {
  form: Pick<FormState, 'payoutMin' | 'payoutBase' | 'payoutMax' | 'requiredViews' | 'bonusPerThousandViews' | 'difficulty'>
  set: SetField
}

const TYPICAL_RANGES: Record<string, { min: number; base: number; max: number }> = {
  Easy:   { min: 300,  base: 500,  max: 1500 },
  Medium: { min: 500,  base: 1000, max: 3000 },
  Hard:   { min: 1000, base: 2000, max: 5000 },
}

export const PayoutStructureCard = memo(function PayoutStructureCard({ form, set }: Props) {
  const errors = useMemo(() => {
    const errs: string[] = []
    if (form.payoutMin >= form.payoutBase) errs.push('Min must be less than Base')
    if (form.payoutBase >= form.payoutMax) errs.push('Base must be less than Max')
    if (form.payoutMin < 0) errs.push('Min cannot be negative')
    return errs
  }, [form.payoutMin, form.payoutBase, form.payoutMax])

  const suggestion = TYPICAL_RANGES[form.difficulty] ?? TYPICAL_RANGES.Medium

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
            <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          Payout Structure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Min / Base / Max */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 sm:p-4 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Payout range (INR)</p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Min</Label>
              <Input
                type="number"
                value={form.payoutMin}
                onChange={e => set('payoutMin', +e.target.value)}
                className={`bg-white px-2.5 sm:px-3 h-11 sm:h-10 text-base sm:text-sm ${
                  form.payoutMin >= form.payoutBase ? 'border-red-300 ring-1 ring-red-200' : ''
                }`}
              />
              <p className="text-[10px] text-slate-400">Minimum guaranteed</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-primary">Base</Label>
              <Input
                type="number"
                value={form.payoutBase}
                onChange={e => set('payoutBase', +e.target.value)}
                className={`bg-white px-2.5 sm:px-3 h-11 sm:h-10 text-base sm:text-sm ring-1 ring-primary/20 border-primary/30 ${
                  form.payoutBase >= form.payoutMax ? 'border-red-300 ring-1 ring-red-200' : ''
                }`}
              />
              <p className="text-[10px] text-slate-400">Standard payout</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Max</Label>
              <Input
                type="number"
                value={form.payoutMax}
                onChange={e => set('payoutMax', +e.target.value)}
                className="bg-white px-2.5 sm:px-3 h-11 sm:h-10 text-base sm:text-sm"
              />
              <p className="text-[10px] text-slate-400">Top performer bonus</p>
            </div>
          </div>

          {/* Validation errors */}
          {errors.length > 0 && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>{errors.join('. ')}</span>
            </div>
          )}

          {/* Typical range suggestion */}
          <div className="flex items-start gap-2 rounded-lg bg-amber-50/70 border border-amber-200/60 px-3 py-2 text-xs text-amber-700">
            <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>
              Typical range for <strong>{form.difficulty}</strong> campaigns: INR {suggestion.min} / {suggestion.base} / {suggestion.max} (min / base / max)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Required Views</Label>
            <Input
              type="number"
              value={form.requiredViews}
              onChange={e => set('requiredViews', +e.target.value)}
              className="h-11 sm:h-10 text-base sm:text-sm"
            />
            <p className="text-[11px] text-slate-400">Minimum views for base payout eligibility</p>
          </div>
          <div className="space-y-1.5">
            <Label>Bonus per 1K Views (INR)</Label>
            <Input
              type="number"
              value={form.bonusPerThousandViews}
              onChange={e => set('bonusPerThousandViews', +e.target.value)}
              className="h-11 sm:h-10 text-base sm:text-sm"
            />
            <p className="text-[11px] text-slate-400">Extra payout for every 1,000 views above threshold</p>
          </div>
        </div>

      </CardContent>
    </Card>
  )
})
