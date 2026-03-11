import { CheckCircle2, DollarSign, Hourglass, PieChart, TrendingUp, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'
import type { CampaignAdmin } from '@/types'

interface AnalyticsTabProps {
  campaign: CampaignAdmin
  approvalRate: number
  approved: number
  pending: number
  totalSubmissions: number
}

/* ── Approval Ring (circular progress) ──────────────────── */
function ApprovalRing({ percent, size = 72 }: { percent: number; size?: number }) {
  const strokeWidth = 5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference
  const color = percent >= 80 ? '#10b981' : percent >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold num-font text-foreground leading-none">{percent}%</span>
        <span className="text-[8px] text-muted-foreground mt-0.5">approved</span>
      </div>
    </div>
  )
}

export default function AnalyticsTab({
  campaign,
  approvalRate,
  approved,
  pending,
  totalSubmissions,
}: AnalyticsTabProps) {
  // Payout efficiency: total paid out / theoretical max payout for all filled spots
  const filledSpots = campaign.totalSpots - campaign.spotsLeft
  const maxPossiblePayout = filledSpots * campaign.payoutMax
  const totalPaidOut = (campaign as CampaignAdmin & { totalPaidOut?: number }).totalPaidOut ?? 0
  const payoutEfficiency = maxPossiblePayout > 0
    ? Math.round((totalPaidOut / maxPossiblePayout) * 100)
    : 0

  // Estimated remaining budget
  const avgPayout = approved > 0 ? totalPaidOut / approved : campaign.payoutBase
  const estimatedRemainingBudget = campaign.spotsLeft * avgPayout

  const metricCards = [
    {
      label: 'Approval Rate',
      value: `${approvalRate}%`,
      sub: `${approved} of ${totalSubmissions}`,
      icon: PieChart,
      gradient: 'from-emerald-50 to-teal-50/50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Total Paid Out',
      value: formatCurrency(totalPaidOut),
      sub: 'Lifetime',
      icon: Wallet,
      gradient: 'from-blue-50 to-sky-50/50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Avg. Earning',
      value: formatCurrency(campaign.averageEarning),
      sub: 'Per creator',
      icon: TrendingUp,
      gradient: 'from-orange-50 to-amber-50/50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Pending Review',
      value: String(pending),
      sub: 'Awaiting action',
      icon: Hourglass,
      gradient: 'from-violet-50 to-purple-50/50',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
  ]

  return (
    <div className="space-y-4">

      {/* Top metrics -- 2-col on mobile, 4-col on md+ -- with gradient backgrounds */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {metricCards.map(m => {
          const Icon = m.icon
          return (
            <div key={m.label} className={cn('admin-card relative overflow-hidden p-4 bg-linear-to-br', m.gradient)}>
              <div className={cn('mb-2 flex h-8 w-8 items-center justify-center rounded-lg', m.iconBg)}>
                <Icon className={cn('h-4 w-4', m.iconColor)} />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{m.label}</p>
              <p className="num-font mt-1 text-2xl font-bold">{m.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{m.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Approval Rate Ring + Payout Efficiency side by side */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Approval Ring Card */}
        <Card className="overflow-hidden">
          <CardContent className="flex items-center gap-5 pt-5 pb-5">
            <ApprovalRing percent={approvalRate} size={80} />
            <div>
              <p className="text-sm font-semibold text-slate-800">Approval Rate</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {approved} approved out of {totalSubmissions} submissions
              </p>
              {pending > 0 && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                  <Hourglass className="h-3 w-3" />{pending} pending review
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payout Efficiency Card */}
        <Card className="overflow-hidden">
          <CardContent className="flex items-center gap-5 pt-5 pb-5">
            <ApprovalRing percent={payoutEfficiency} size={80} />
            <div>
              <p className="text-sm font-semibold text-slate-800">Payout Efficiency</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatCurrency(totalPaidOut)} of {formatCurrency(maxPossiblePayout)} max
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                <DollarSign className="h-3 w-3" />Est. remaining: {formatCurrency(estimatedRemainingBudget)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Health */}
      <Card>
        <CardHeader className="pb-3"><CardTitle>Payout Health</CardTitle></CardHeader>
        <CardContent className="space-y-4">

          {/* Payout blocks -- responsive grid on mobile */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                label: 'Payout Range',
                value: `${formatCurrency(campaign.payoutMin)} -> ${formatCurrency(campaign.payoutBase)} -> ${formatCurrency(campaign.payoutMax)}`,
                sub: 'Min -> Base -> Max per creator',
                bg: 'bg-slate-50 border border-slate-200/60',
                textColor: 'text-slate-800',
                accentBar: 'from-slate-400 to-slate-500',
              },
              {
                label: 'Bonus Structure',
                value: `+${formatCurrency(campaign.bonusPerThousandViews)} / 1K views`,
                sub: `Threshold: ${formatNumber(campaign.requiredViews)} views`,
                bg: 'bg-emerald-50 border border-emerald-200/60',
                textColor: 'text-emerald-700',
                accentBar: 'from-emerald-400 to-emerald-500',
              },
              {
                label: 'Capacity',
                value: `${campaign.totalSpots - campaign.spotsLeft} / ${campaign.totalSpots} spots`,
                sub: `${campaign.spotsLeft} spots remaining`,
                bg: 'bg-orange-50 border border-orange-200/60',
                textColor: 'text-orange-700',
                accentBar: 'from-orange-400 to-orange-500',
              },
            ].map(block => (
              <div
                key={block.label}
                className={cn('relative overflow-hidden rounded-xl p-4', block.bg)}
              >
                <div className={cn('absolute inset-x-0 top-0 h-0.75 bg-linear-to-r', block.accentBar)} />
                <p className="text-xs text-muted-foreground mb-1">{block.label}</p>
                <p className={`num-font font-semibold text-sm ${block.textColor}`}>{block.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{block.sub}</p>
              </div>
            ))}
          </div>

          {/* Success rate bar */}
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Campaign Success Rate
              </span>
              <span className="num-font font-bold">{campaign.successRate}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-500 to-lime-500 transition-all duration-700"
                style={{ width: `${campaign.successRate}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Based on {campaign.submissionsCount ?? totalSubmissions} total submissions
            </p>
          </div>

          {/* Estimated Remaining Budget */}
          <div className="rounded-xl bg-linear-to-r from-violet-50 to-purple-50/50 border border-violet-200/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Est. Remaining Budget</p>
                <p className="num-font text-xl font-bold text-violet-700 mt-1">{formatCurrency(estimatedRemainingBudget)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{campaign.spotsLeft} spots x ~{formatCurrency(Math.round(avgPayout))}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">avg. payout per spot</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
