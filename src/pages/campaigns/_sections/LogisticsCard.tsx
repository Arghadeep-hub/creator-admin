import { memo } from 'react'
import { MapPin, Clock, Settings2, Users, Navigation } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FormState, SetField } from './types'

interface Props {
  form: Pick<FormState, 'totalSpots' | 'estimatedVisitTimeMins' | 'checkInRadiusMeters' | 'latitude' | 'longitude'>
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
            className="bg-white h-11 sm:h-10 text-base sm:text-sm"
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
            className="bg-white h-11 sm:h-10 text-base sm:text-sm"
          />
          <p className="text-[11px] text-slate-400">Approximate time a creator will spend on-site</p>
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
            className="bg-white h-11 sm:h-10 text-base sm:text-sm"
          />
          <p className="text-[11px] text-slate-400">Area within which check-in is accepted</p>
        </div>

        {/* GPS Coordinates */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-2.5">
          <div className="flex items-center gap-2">
            <Navigation className="h-3.5 w-3.5 text-slate-400" />
            <Label className="text-xs text-slate-500">GPS Coordinates</Label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[11px] text-slate-400">Latitude</Label>
              <Input
                type="number"
                step="any"
                placeholder="e.g. 19.0760"
                value={form.latitude || ''}
                onChange={e => set('latitude', e.target.value === '' ? 0 : +e.target.value)}
                className="bg-white h-11 sm:h-10 text-base sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-slate-400">Longitude</Label>
              <Input
                type="number"
                step="any"
                placeholder="e.g. 72.8777"
                value={form.longitude || ''}
                onChange={e => set('longitude', e.target.value === '' ? 0 : +e.target.value)}
                className="bg-white h-11 sm:h-10 text-base sm:text-sm"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Right-click any location in Google Maps and copy the coordinates. Used for creator check-in verification.
          </p>
        </div>
      </CardContent>
    </Card>
  )
})
