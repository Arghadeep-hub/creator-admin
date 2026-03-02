import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FormState, SetField } from './types'

interface Props {
  form: Pick<FormState, 'totalSpots' | 'estimatedVisitTimeMins' | 'checkInRadiusMeters'>
  set: SetField
}

export function LogisticsCard({ form, set }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Total Spots</Label>
          <Input
            type="number"
            value={form.totalSpots}
            onChange={e => set('totalSpots', +e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Max creators who can participate</p>
        </div>
        <div className="space-y-1.5">
          <Label>Est. Visit Time (mins)</Label>
          <Input
            type="number"
            value={form.estimatedVisitTimeMins}
            onChange={e => set('estimatedVisitTimeMins', +e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>GPS Check-in Radius (m)</Label>
          <Input
            type="number"
            value={form.checkInRadiusMeters}
            onChange={e => set('checkInRadiusMeters', +e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Area within which check-in is accepted</p>
        </div>
      </CardContent>
    </Card>
  )
}
