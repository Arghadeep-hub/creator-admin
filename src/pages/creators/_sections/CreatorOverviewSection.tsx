import { motion } from 'framer-motion'
import {
  Instagram, MapPin, Phone, Mail, Wallet,
  CheckCircle, XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn, formatNumber } from '@/lib/utils'
import type { CreatorAdmin } from '@/types'

interface Props {
  creator: CreatorAdmin
}

export function CreatorOverviewSection({ creator }: Props) {
  return (
    <div className="lg:col-span-2 space-y-4">

      {/* Contact & Social */}
      <div className="admin-card overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-foreground">Contact & Social</h3>
        </div>
        <div className="px-4 pb-4 space-y-3 text-sm">
          {[
            { icon: Mail, label: 'Email', value: creator.email },
            { icon: Phone, label: 'Phone', value: creator.phone },
            { icon: MapPin, label: 'City', value: creator.city },
            { icon: Wallet, label: 'UPI ID', value: creator.upiId },
          ].map(row => {
            const Icon = row.icon
            return (
              <div key={row.label} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{row.label}</p>
                  <p className="font-medium truncate">{row.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Instagram section */}
        <div className="border-t border-border/60 bg-slate-50/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg bg-linear-to-br from-[#833AB4] via-[#C13584] to-[#F77737] flex items-center justify-center">
              <Instagram className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm">{creator.instagramHandle}</span>
            {creator.instagramConnected
              ? <Badge variant="success" className="text-[10px]">Connected</Badge>
              : <Badge variant="gray" className="text-[10px]">Not Connected</Badge>
            }
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Followers', value: formatNumber(creator.instagramFollowers) },
              { label: 'Avg. Reach', value: formatNumber(creator.instagramMetrics?.avgReach ?? creator.avgReach ?? 0) },
              { label: 'Engagement', value: `${creator.instagramMetrics?.avgEngagement ?? creator.avgEngagement ?? 0}%` },
              { label: 'Reels Submitted', value: String(creator.instagramMetrics?.totalReelsSubmitted ?? creator.reelsDone) },
            ].map(m => (
              <div key={m.label}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{m.label}</p>
                <p className="font-bold num-font text-sm mt-0.5">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activation Progress */}
      <div className="admin-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Activation Progress</h3>
          <Badge variant={creator.activationProgress === 100 ? 'success' : 'warning'} className="text-[10px]">
            {creator.activationProgress === 100 ? 'Complete' : `${creator.activationProgress}%`}
          </Badge>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
          <motion.div
            className={cn(
              'h-full rounded-full',
              creator.activationProgress === 100
                ? 'bg-linear-to-r from-emerald-500 to-emerald-400'
                : 'bg-linear-to-r from-orange-500 to-amber-500'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${creator.activationProgress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(creator.activationStepsCompleted ?? {}).map(([step, done]) => (
            <div
              key={step}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                done ? 'bg-emerald-50/70' : 'bg-slate-50'
              )}
            >
              {done
                ? <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                : <XCircle className="h-4 w-4 text-slate-300 shrink-0" />
              }
              <span className={done ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                {step.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
