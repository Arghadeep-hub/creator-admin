import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FormState, SetField } from './types'

interface Props {
  form: Pick<FormState, 'payoutMin' | 'payoutBase' | 'payoutMax' | 'requiredViews' | 'bonusPerThousandViews' | 'autoCalculateMetrics'>
  set: SetField
}

export function PayoutStructureCard({ form, set }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout Structure</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Min Payout (₹)</Label>
            <Input type="number" value={form.payoutMin} onChange={e => set('payoutMin', +e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Base Payout (₹)</Label>
            <Input type="number" value={form.payoutBase} onChange={e => set('payoutBase', +e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Max Payout (₹)</Label>
            <Input type="number" value={form.payoutMax} onChange={e => set('payoutMax', +e.target.value)} />
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

        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Auto-calculate metrics</p>
            <p className="text-xs text-muted-foreground mt-0.5">Automatically fetch and update engagement data</p>
          </div>
          <Switch checked={form.autoCalculateMetrics} onCheckedChange={v => set('autoCalculateMetrics', v)} />
        </div>
      </CardContent>
    </Card>
  )
}
