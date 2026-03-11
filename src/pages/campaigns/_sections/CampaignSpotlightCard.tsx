import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, Clock, Pencil, Sparkles, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency } from '@/lib/utils'
import { getAttentionScore, getDeadlineCountdown, getFillPercent } from '../campaigns.utils'
import type { CampaignAdmin } from '@/types'

interface CampaignSpotlightCardProps {
  spotlight: CampaignAdmin
  onEdit: () => void
  onOpen: () => void
}

export function CampaignSpotlightCard({ spotlight, onEdit, onOpen }: CampaignSpotlightCardProps) {
  const isHighAttention = getAttentionScore(spotlight) >= 92
  const countdown = getDeadlineCountdown(spotlight.deadline)
  const fillPercent = getFillPercent(spotlight)

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border p-4 sm:p-5',
          isHighAttention
            ? 'border-red-200 bg-red-50'
            : 'border-orange-200 bg-linear-to-r from-orange-50 via-amber-50 to-orange-50',
        )}
      >
        {/* Pulsing glow border effect */}
        <div
          className={cn(
            'pointer-events-none absolute -inset-px rounded-xl opacity-60 animate-pulse',
            isHighAttention
              ? 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'
              : 'shadow-[0_0_15px_rgba(249,115,22,0.25)]',
          )}
        />

        {/* Main content */}
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          {/* Icon + text */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                isHighAttention ? 'bg-red-100' : 'bg-orange-100',
              )}
            >
              {isHighAttention ? (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              ) : (
                <Sparkles className="h-5 w-5 text-orange-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'text-[11px] font-bold uppercase tracking-wider',
                  isHighAttention ? 'text-red-600' : 'text-orange-600',
                )}
              >
                {isHighAttention ? 'Priority Action Required' : 'Campaign Spotlight'}
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold text-slate-900 sm:text-base">
                {spotlight.restaurantName}
              </p>
              <p className="text-xs text-slate-600">
                {spotlight.city} · {formatCurrency(spotlight.payoutMin)}–{formatCurrency(spotlight.payoutMax)}
              </p>

              {/* Extra info row — spots, deadline */}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3 text-orange-500" />
                  <span className="font-medium text-slate-800">{spotlight.spotsLeft}</span> spots left
                  <span className="text-slate-400">({fillPercent}% filled)</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className={cn('h-3 w-3', countdown === 'Expired' ? 'text-slate-400' : 'text-amber-500')} />
                  <span className={cn('font-medium', countdown === 'Expired' ? 'text-slate-500' : 'text-slate-800')}>
                    {countdown}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* CTA buttons — full width on mobile */}
          <div className="flex gap-2 sm:shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={onEdit}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              size="sm"
              className={cn(
                'flex-1 sm:flex-none',
                isHighAttention
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : '',
              )}
              onClick={onOpen}
            >
              Open <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
