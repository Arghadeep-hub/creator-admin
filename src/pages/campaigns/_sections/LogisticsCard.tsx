import { memo } from 'react'
import { MapPin, Clock, Settings2, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FormState, SetField } from './types'

interface Props {
  form: Pick<FormState, 'totalSpots' | 'estimatedVisitTimeMins' | 'checkInRadiusMeters'>
  set: SetField
}

export const LogisticsCard = memo(function LogisticsCard({ form, set }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
            <Settings2 className="h-3.5 w-3.5 text-slate-600" />
          </div>
          Logistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <Label className="text-xs text-slate-500">Total Spots</Label>
          </div>
          <Input
            type="number"
            value={form.totalSpots}
            onChange={e => set('totalSpots', +e.target.value)}
            className="bg-white"
          />
          <p className="text-[11px] text-slate-400">Max creators who can participate</p>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <Label className="text-xs text-slate-500">Est. Visit Time (mins)</Label>
          </div>
          <Input
            type="number"
            value={form.estimatedVisitTimeMins}
            onChange={e => set('estimatedVisitTimeMins', +e.target.value)}
            className="bg-white"
          />
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <Label className="text-xs text-slate-500">GPS Check-in Radius (m)</Label>
          </div>
          <Input
            type="number"
            value={form.checkInRadiusMeters}
            onChange={e => set('checkInRadiusMeters', +e.target.value)}
            className="bg-white"
          />
          <p className="text-[11px] text-slate-400">Area within which check-in is accepted</p>
        </div>
      </CardContent>
    </Card>
  )
})
