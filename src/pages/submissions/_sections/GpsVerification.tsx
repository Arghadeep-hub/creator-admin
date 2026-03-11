import { MapPin, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SubmissionAdmin } from '@/types'

interface Props {
  sub: SubmissionAdmin
}

export default function GpsVerification({ sub }: Props) {
  if (sub.gpsLatitude == null || sub.gpsLongitude == null) return null

  return (
    <div className="admin-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <MapPin className="h-3.5 w-3.5 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">GPS Verification</h3>
        </div>
        <span className={cn(
          'inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full',
          sub.gpsVerified
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-red-100 text-red-700'
        )}>
          {sub.gpsVerified
            ? <><CheckCircle className="h-3 w-3" />Within Radius</>
            : <><XCircle className="h-3 w-3" />Out of Radius</>
          }
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Coordinates */}
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Coordinates</p>
          <p className="font-mono text-xs text-slate-700 leading-relaxed">
            {sub.gpsLatitude.toFixed(4)}<br />{sub.gpsLongitude.toFixed(4)}
          </p>
        </div>

        {/* Accuracy */}
        <div className={cn(
          'rounded-lg p-3',
          sub.gpsVerified ? 'bg-emerald-50' : 'bg-red-50'
        )}>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Accuracy</p>
          <p className={cn(
            'text-xl font-bold num-font leading-none',
            sub.gpsVerified ? 'text-emerald-700' : 'text-red-600'
          )}>
            {(sub.gpsAccuracyMeters ?? 0).toFixed(0)}
          </p>
          <p className={cn(
            'text-[10px] font-medium mt-0.5',
            sub.gpsVerified ? 'text-emerald-600' : 'text-red-500'
          )}>meters accuracy</p>
        </div>
      </div>
    </div>
  )
}
