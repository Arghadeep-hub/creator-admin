import { Activity, Calendar, Clock, Crosshair, MapPin, Navigation, Tag, TrendingUp, Users, Utensils, Zap } from 'lucide-react'
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

const DIFFICULTY_ICON: Record<string, typeof Zap> = {
  Easy:   Zap,
  Medium: Activity,
  Hard:   TrendingUp,
}

/* ── Campaign Health Indicator ──────────────────────────── */
function CampaignHealthBadge({ campaign }: { campaign: CampaignAdmin }) {
  const fillPercent = campaign.totalSpots === 0
    ? 0
    : ((campaign.totalSpots - campaign.spotsLeft) / campaign.totalSpots) * 100
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
  const isExpired = daysLeft <= 0

  // Simple health score: high fill + good success rate + time remaining = healthy
  let score = 0
  if (fillPercent >= 50) score += 1
  if (campaign.successRate >= 70) score += 1
  if (!isExpired && daysLeft > 3) score += 1

  const healthMap: Record<number, { label: string; color: string; bg: string; dot: string }> = {
    0: { label: 'Needs Attention', color: 'text-red-700', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
    1: { label: 'Fair', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
    2: { label: 'Good', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
    3: { label: 'Excellent', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  }
  const h = healthMap[score]

  return (
    <div className={cn('flex items-center gap-2 rounded-lg border px-3 py-2', h.bg)}>
      <span className={cn('h-2 w-2 shrink-0 rounded-full animate-pulse', h.dot)} />
      <span className={cn('text-xs font-semibold', h.color)}>{h.label}</span>
    </div>
  )
}

/* ── Payout Visual Bar ──────────────────────────────────── */
function PayoutBar({ min, base, max }: { min: number; max: number; base: number }) {
  const range = max - min || 1
  const basePos = ((base - min) / range) * 100

  return (
    <div className="mt-3 space-y-1.5">
      <div className="relative h-2.5 w-full rounded-full bg-slate-100">
        <div className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-orange-400 to-amber-400" style={{ width: '100%' }} />
        {/* Base marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-1 rounded-full bg-white shadow-md ring-2 ring-orange-500"
          style={{ left: `${basePos}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Min {formatCurrency(min)}</span>
        <span className="font-semibold text-orange-600">Base {formatCurrency(base)}</span>
        <span>Max {formatCurrency(max)}</span>
      </div>
    </div>
  )
}

export default function OverviewTab({ campaign }: OverviewTabProps) {
  const fillPercent = campaign.totalSpots === 0
    ? 0
    : ((campaign.totalSpots - campaign.spotsLeft) / campaign.totalSpots) * 100
  const isAlmostFull = campaign.spotsLeft <= 3

  const detailRows = [
    { label: 'Category',       value: campaign.cuisine ?? '---',                             icon: Utensils,    group: 'info' },
    { label: 'Difficulty',     value: campaign.difficulty,                                   icon: DIFFICULTY_ICON[campaign.difficulty] ?? Zap, badge: DIFFICULTY_COLOR[campaign.difficulty], group: 'info' },
    { label: 'City',           value: campaign.city,                                         icon: MapPin,      group: 'location' },
    { label: 'Address',        value: campaign.address || '---',                             icon: Navigation,  group: 'location' },
    { label: 'Deadline',       value: new Date(campaign.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), icon: Calendar, group: 'time' },
    { label: 'Est. Visit',     value: `${campaign.estimatedVisitTimeMins} mins`,             icon: Clock,       group: 'time' },
    { label: 'GPS Radius',     value: `${campaign.checkInRadiusMeters}m`,                    icon: Crosshair,   group: 'time' },
    { label: 'Success Rate',   value: `${campaign.successRate}%`,                            icon: TrendingUp,  group: 'time' },
  ] as const

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

      {/* -- Right column -- rendered first for mobile priority -- */}
      <div className="space-y-4 lg:col-start-3 lg:row-start-1">

        {/* Campaign Health */}
        <Card className="overflow-hidden">
          <CardContent className="flex items-center justify-between gap-3 pt-5 pb-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Campaign Health</p>
              <CampaignHealthBadge campaign={campaign} />
            </div>
            <div className="text-right">
              <p className="num-font text-2xl font-extrabold text-foreground">{campaign.successRate}%</p>
              <p className="text-[10px] text-muted-foreground">success rate</p>
            </div>
          </CardContent>
        </Card>

        {/* Payout Structure -- visually elevated on mobile */}
        <Card className="overflow-hidden">
          {/* Gradient header band */}
          <div className="bg-linear-to-r from-orange-500 to-amber-500 px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-100">Base Payout</p>
            <p className="num-font mt-0.5 text-3xl font-extrabold text-white">
              {formatCurrency(campaign.payoutBase)}
            </p>
            <p className="mt-1 text-sm text-orange-100">
              Range: {formatCurrency(campaign.payoutMin)} -- {formatCurrency(campaign.payoutMax)}
            </p>
          </div>
          <CardContent className="space-y-3 pt-4">
            {/* Visual payout bar */}
            <PayoutBar min={campaign.payoutMin} base={campaign.payoutBase} max={campaign.payoutMax} />

            <div className="space-y-2.5 pt-1">
              {[
                { label: 'Bonus / 1K Views',  value: `+${formatCurrency(campaign.bonusPerThousandViews)}`, cls: 'font-semibold text-emerald-600 num-font' },
                { label: 'Required Views',    value: formatNumber(campaign.requiredViews),                   cls: 'font-medium num-font' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className={row.cls}>{row.value}</span>
                </div>
              ))}
            </div>
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

      {/* -- Left column -- details, description, rules -- */}
      <div className="space-y-4 lg:col-span-2 lg:col-start-1 lg:row-start-1">

        {/* Campaign Details -- divider list on mobile, grid on sm+ */}
        <Card>
          <CardHeader className="pb-3"><CardTitle>Campaign Details</CardTitle></CardHeader>
          <CardContent>
            {/* Mobile: stacked list with dividers and icons */}
            <dl className="sm:hidden divide-y divide-slate-100">
              {detailRows.map(row => {
                const Icon = row.icon
                return (
                  <div key={row.label} className="flex items-center gap-3 py-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                      <Icon className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{row.label}</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-slate-800">
                        {'badge' in row && row.badge ? (
                          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', row.badge)}>
                            {row.value}
                          </span>
                        ) : (
                          row.value
                        )}
                      </dd>
                    </div>
                  </div>
                )
              })}
            </dl>
            {/* Desktop: 2-col grid with icons */}
            <dl className="hidden sm:grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {detailRows.map(row => {
                const Icon = row.icon
                return (
                  <div key={row.label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50">
                      <Icon className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground mb-0.5">{row.label}</dt>
                      <dd className="font-medium">
                        {'badge' in row && row.badge ? (
                          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', row.badge)}>
                            {row.value}
                          </span>
                        ) : (
                          row.value
                        )}
                      </dd>
                    </div>
                  </div>
                )
              })}
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
