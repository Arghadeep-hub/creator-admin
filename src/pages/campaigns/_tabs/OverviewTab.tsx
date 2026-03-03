import { Calendar, Clock, MapPin, Tag, TrendingUp, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'
import type { CampaignAdmin } from '@/types'

interface OverviewTabProps {
  campaign: CampaignAdmin
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy:   'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard:   'bg-red-100 text-red-700',
}

export default function OverviewTab({ campaign }: OverviewTabProps) {
  const fillPercent = campaign.totalSpots === 0
    ? 0
    : ((campaign.totalSpots - campaign.spotsLeft) / campaign.totalSpots) * 100
  const isAlmostFull = campaign.spotsLeft <= 3

  const detailRows = [
    { label: 'Category',       value: campaign.category },
    { label: 'Difficulty',     value: campaign.difficulty,                           badge: DIFFICULTY_COLOR[campaign.difficulty] },
    { label: 'City',           value: campaign.city,                                 icon: MapPin },
    { label: 'Address',        value: campaign.address || '—' },
    { label: 'Deadline',       value: new Date(campaign.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), icon: Calendar },
    { label: 'Est. Visit',     value: `${campaign.estimatedVisitTimeMins} mins`,     icon: Clock },
    { label: 'GPS Radius',     value: `${campaign.checkInRadiusMeters}m` },
    { label: 'Success Rate',   value: `${campaign.successRate}%`,                    icon: TrendingUp },
  ] as const

  return (
    /**
     * Grid layout:
     * Mobile  — single column; right-column cards (Payout/Hashtags/Spots) render
     *           first in DOM so they appear at top on mobile.
     * Desktop — 3-col grid; right column is placed via col-start-3 / row-start-1,
     *           left column takes col-span-2 col-start-1 row-start-1.
     */
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

      {/* ── Right column — rendered first for mobile priority ── */}
      <div className="space-y-4 lg:col-start-3 lg:row-start-1">

        {/* Payout Structure — visually elevated on mobile */}
        <Card className="overflow-hidden">
          {/* Gradient header band */}
          <div className="bg-linear-to-r from-orange-500 to-amber-500 px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-100">Base Payout</p>
            <p className="num-font mt-0.5 text-3xl font-extrabold text-white">
              {formatCurrency(campaign.payoutBase)}
            </p>
            <p className="mt-1 text-sm text-orange-100">
              Range: {formatCurrency(campaign.payoutMin)} – {formatCurrency(campaign.payoutMax)}
            </p>
          </div>
          <CardContent className="space-y-3 pt-4">
            {[
              { label: 'Bonus / 1K Views',  value: `+${formatCurrency(campaign.bonusPerThousandViews)}`, cls: 'font-semibold text-emerald-600 num-font' },
              { label: 'Required Views',    value: formatNumber(campaign.requiredViews),                   cls: 'font-medium num-font' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className={row.cls}>{row.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t pt-3 text-sm">
              <span className="text-muted-foreground">Avg. Earning</span>
              <span className="num-font font-bold text-primary">{formatCurrency(campaign.averageEarning)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Spots */}
        <Card>
          <CardContent className="pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Users className="h-4 w-4 text-orange-500" />
                <span className="font-medium">
                  {campaign.totalSpots - campaign.spotsLeft}/{campaign.totalSpots} spots filled
                </span>
              </div>
              <span className={cn(
                'text-sm font-semibold',
                isAlmostFull ? 'text-red-600' : 'text-slate-600',
              )}>
                {campaign.spotsLeft} left
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  isAlmostFull
                    ? 'bg-linear-to-r from-red-500 to-rose-500'
                    : 'bg-linear-to-r from-orange-500 to-amber-500',
                )}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(fillPercent)}% capacity used
            </p>
          </CardContent>
        </Card>

        {/* Required Hashtags */}
        <Card>
          <CardHeader className="pb-3"><CardTitle>Required Hashtags</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {campaign.requiredHashtags.map(tag => (
              <Badge key={tag} variant="orange" className="text-xs">
                <Tag className="mr-1 h-3 w-3" />{tag}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Left column — details, description, rules ── */}
      <div className="space-y-4 lg:col-span-2 lg:col-start-1 lg:row-start-1">

        {/* Campaign Details — divider list on mobile, grid on sm+ */}
        <Card>
          <CardHeader className="pb-3"><CardTitle>Campaign Details</CardTitle></CardHeader>
          <CardContent>
            {/* Mobile: stacked list with dividers */}
            <dl className="sm:hidden divide-y divide-slate-100">
              {detailRows.map(row => (
                <div key={row.label} className="flex items-center justify-between py-3">
                  <dt className="text-xs font-medium text-muted-foreground">{row.label}</dt>
                  <dd className={cn('text-sm font-semibold text-slate-800', 'badge' in row && row.badge ? '' : '')}>
                    {'badge' in row && row.badge ? (
                      <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', row.badge)}>
                        {row.value}
                      </span>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            {/* Desktop: 2-col grid */}
            <dl className="hidden sm:grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {detailRows.map(row => (
                <div key={row.label}>
                  <dt className="text-xs text-muted-foreground mb-0.5">{row.label}</dt>
                  <dd className="font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        {/* Description */}
        {campaign.description && (
          <Card>
            <CardHeader className="pb-3"><CardTitle>Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{campaign.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Campaign Rules */}
        <Card>
          <CardHeader className="pb-3"><CardTitle>Campaign Rules</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {campaign.rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-slate-700">{rule}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
