import { memo } from 'react'
import { IndianRupee } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FormState, SetField } from './types'

interface Props {
  form: Pick<FormState, 'payoutMin' | 'payoutBase' | 'payoutMax' | 'requiredViews' | 'bonusPerThousandViews' | 'autoCalculateMetrics'>
  set: SetField
}

export const PayoutStructureCard = memo(function PayoutStructureCard({ form, set }: Props) {
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
        {/* Min / Base / Max — wrapped in a subtle container */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 sm:p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Payout range (₹)</p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Min</Label>
              <Input type="number" value={form.payoutMin} onChange={e => set('payoutMin', +e.target.value)} className="bg-white px-2.5 sm:px-3" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-primary">Base</Label>
              <Input type="number" value={form.payoutBase} onChange={e => set('payoutBase', +e.target.value)} className="bg-white px-2.5 sm:px-3 ring-1 ring-primary/20 border-primary/30" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Max</Label>
              <Input type="number" value={form.payoutMax} onChange={e => set('payoutMax', +e.target.value)} className="bg-white px-2.5 sm:px-3" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Required Views</Label>
            <Input type="number" value={form.requiredViews} onChange={e => set('requiredViews', +e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Bonus per 1K Views (₹)</Label>
            <Input type="number" value={form.bonusPerThousandViews} onChange={e => set('bonusPerThousandViews', +e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-700">Auto-calculate metrics</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">Automatically fetch & update engagement data</p>
          </div>
          <Switch checked={form.autoCalculateMetrics} onCheckedChange={v => set('autoCalculateMetrics', v)} className="shrink-0" />
        </div>
      </CardContent>
    </Card>
  )
})
