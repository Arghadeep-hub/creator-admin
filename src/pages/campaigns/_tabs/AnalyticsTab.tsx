import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { CampaignAdmin } from '@/types'

interface AnalyticsTabProps {
  campaign: CampaignAdmin
  approvalRate: number
  approved: number
  pending: number
  totalSubmissions: number
}

export default function AnalyticsTab({
  campaign,
  approvalRate,
  approved,
  pending,
  totalSubmissions,
}: AnalyticsTabProps) {
  return (
    <div className="space-y-4">

      {/* Top metrics — 2-col on mobile, 4-col on md+ */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Approval Rate',  value: `${approvalRate}%`,                     sub: `${approved} of ${totalSubmissions}` },
          { label: 'Total Paid Out', value: formatCurrency(campaign.totalPaidOut),   sub: 'Lifetime' },
          { label: 'Avg. Earning',   value: formatCurrency(campaign.averageEarning), sub: 'Per creator' },
          { label: 'Pending Review', value: String(pending),                         sub: 'Awaiting action' },
        ].map(m => (
          <div key={m.label} className="admin-card p-4">
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="num-font mt-1 text-2xl font-bold">{m.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Payout Health */}
      <Card>
        <CardHeader className="pb-3"><CardTitle>Payout Health</CardTitle></CardHeader>
        <CardContent className="space-y-4">

          {/* Payout blocks — horizontal scroll on mobile, grid on sm+ */}
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
            {[
              {
                label: 'Payout Range',
                value: `${formatCurrency(campaign.payoutMin)} → ${formatCurrency(campaign.payoutBase)} → ${formatCurrency(campaign.payoutMax)}`,
                sub: 'Min → Base → Max per creator',
                bg: 'bg-slate-50',
                textColor: 'text-slate-800',
              },
              {
                label: 'Bonus Structure',
                value: `+${formatCurrency(campaign.bonusPerThousandViews)} / 1K views`,
                sub: `Threshold: ${formatNumber(campaign.requiredViews)} views`,
                bg: 'bg-emerald-50',
                textColor: 'text-emerald-700',
              },
              {
                label: 'Capacity',
                value: `${campaign.totalSpots - campaign.spotsLeft} / ${campaign.totalSpots} spots`,
                sub: `${campaign.spotsLeft} spots remaining`,
                bg: 'bg-orange-50',
                textColor: 'text-orange-700',
              },
            ].map(block => (
              <div
                key={block.label}
                className={`w-56 shrink-0 rounded-xl p-4 sm:w-auto sm:shrink ${block.bg}`}
              >
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
              Based on {campaign.totalSubmissions} total submissions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
