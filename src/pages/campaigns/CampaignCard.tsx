import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  MapPin,
  MoreVertical,
  Pause,
  Pencil,
  Play,
  Timer,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn, formatCurrency } from '@/lib/utils'
import type { CampaignAdmin } from '@/types'
import {
  CATEGORY_EMOJI,
  DIFFICULTY_COLOR,
  getFillPercent,
  getUrgencyMeta,
  getAttentionScore,
} from './campaigns.utils'

interface CampaignCardProps {
  campaign: CampaignAdmin
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  onStatusToggle: () => void
}

function CampaignCard({ campaign, onView, onEdit, onDelete, onStatusToggle }: CampaignCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const spotsPercent = getFillPercent(campaign)
  const urgency = getUrgencyMeta(campaign)
  const isAlmostFull = campaign.spotsLeft <= 3
  const isAtRisk = campaign.status === 'active' && getAttentionScore(campaign) >= 92

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="admin-card-elevated group cursor-pointer overflow-hidden bg-white"
        onClick={onView}
      >
        {/* Image header — taller on mobile for better visual weight */}
        <div className="relative h-40 sm:h-32">
          {imageFailed ? (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-orange-100 via-amber-50 to-slate-100 text-5xl">
              {CATEGORY_EMOJI[campaign.category] ?? CATEGORY_EMOJI.Other}
            </div>
          ) : (
            <img
              src={campaign.businessLogo}
              alt={campaign.businessName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              onError={() => setImageFailed(true)}
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-900/20 to-transparent" />

          {/* Top left: status + risk badge */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <StatusBadge status={campaign.status} />
            {isAtRisk && (
              <Badge className="bg-red-100 text-red-700">
                <AlertTriangle className="h-3 w-3" />
                Attention
              </Badge>
            )}
          </div>

          {/* Top right: urgency + menu */}
          <div className="absolute right-3 top-3 flex items-start gap-2">
            <Badge className={urgency.badgeClass}>{urgency.label}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Larger tap target on mobile */}
                <button
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/90 text-slate-700 shadow-sm backdrop-blur hover:bg-white active:scale-90 transition-transform"
                  onClick={e => e.stopPropagation()}
                  aria-label="Campaign options"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={e => { e.stopPropagation(); onView() }}>
                  <Eye className="mr-2 h-4 w-4" />View Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={e => { e.stopPropagation(); onEdit() }}>
                  <Pencil className="mr-2 h-4 w-4" />Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={e => { e.stopPropagation(); onStatusToggle() }}>
                  {campaign.status === 'active' ? (
                    <><Pause className="mr-2 h-4 w-4" />Pause</>
                  ) : (
                    <><Play className="mr-2 h-4 w-4" />Activate</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={e => { e.stopPropagation(); onDelete() }}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Bottom overlay: name + location */}
          <div className="absolute bottom-3 left-3 right-14">
            <p className="truncate text-sm font-semibold text-white">{campaign.name}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-white/70">
              <MapPin className="h-3 w-3" />
              {campaign.businessName} · {campaign.city}
            </p>
          </div>
        </div>

        {/* Card body */}
        <div className="space-y-3 p-4">
          {/* Payout + difficulty */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Payout range</p>
              <p className="num-font text-base font-bold text-slate-900">
                {formatCurrency(campaign.payoutMin)} – {formatCurrency(campaign.payoutMax)}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Base {formatCurrency(campaign.payoutBase)}
              </p>
            </div>
            <Badge className={DIFFICULTY_COLOR[campaign.difficulty]}>{campaign.difficulty}</Badge>
          </div>

          {/* Spots fill bar */}
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Users className="h-3 w-3 text-orange-500" />
                {campaign.totalSpots - campaign.spotsLeft}/{campaign.totalSpots} spots filled
              </span>
              <span className={isAlmostFull ? 'font-semibold text-red-600' : 'text-slate-500'}>
                {campaign.spotsLeft} left
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  isAlmostFull
                    ? 'bg-linear-to-r from-red-500 to-rose-500'
                    : 'bg-linear-to-r from-orange-500 to-amber-500',
                )}
                style={{ width: `${spotsPercent}%` }}
              />
            </div>
          </div>

          {/* Metric pills */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
              <Timer className="h-3 w-3 text-orange-500" />
              {campaign.estimatedVisitTimeMins}m visit
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
              <TrendingUp className="h-3 w-3 text-orange-500" />
              {campaign.successRate}% success
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
              <CheckCircle2 className="h-3 w-3 text-orange-500" />
              {campaign.totalSubmissions} submitted
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <div className="text-xs">
              <p className={cn('font-medium', urgency.helperClass)}>{urgency.label}</p>
              <p className="mt-0.5 text-slate-400">Paid out {formatCurrency(campaign.totalPaidOut)}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); onEdit() }}>
                <Pencil className="h-3 w-3" />
                Edit
              </Button>
              <Button size="sm" onClick={e => { e.stopPropagation(); onView() }}>
                Open
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default memo(CampaignCard)
