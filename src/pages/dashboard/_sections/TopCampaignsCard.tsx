import { memo } from 'react'
import { Flame, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn, formatCurrency } from '@/lib/utils'

interface Campaign {
  name: string
  submissions: number
  avgPayout: number
  success: number
}

interface TopCampaignsCardProps {
  campaigns: Campaign[]
  onNavigate: (path: string) => void
}

export const TopCampaignsCard = memo(function TopCampaignsCard({ campaigns, onNavigate }: TopCampaignsCardProps) {
  return (
    <Card className="lg:col-span-2 overflow-hidden">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base">Top Campaigns</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs gap-1.5 hover:bg-orange-50" onClick={() => onNavigate('/campaigns')}>
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile: Premium card layout */}
        <div className="md:hidden space-y-2.5 px-4 pb-4">
          {campaigns.map((campaign, i) => (
            <div key={campaign.name} className="rounded-xl border border-slate-100 bg-linear-to-br from-white to-slate-50/50 p-3 active:scale-[0.99] transition-all">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <div className="h-9 w-9 rounded-xl bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center shrink-0 border border-orange-100/50 shadow-sm">
                      <Flame className="h-4 w-4 text-primary" />
                    </div>
                    <span className="absolute -top-1.5 -left-1.5 h-4.5 w-4.5 rounded-full bg-linear-to-br from-slate-700 to-slate-900 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                      {i + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[13px] truncate">{campaign.name}</p>
                    <p className="text-[10px] text-muted-foreground">{campaign.submissions} submissions</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge variant={campaign.success >= 88 ? 'success' : 'warning'} className="text-[10px]">
                    {campaign.success}%
                  </Badge>
                  <span className="text-[10px] num-font font-semibold text-muted-foreground">{formatCurrency(campaign.avgPayout)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Table layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2.5 px-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">#</th>
                <th className="text-left py-2.5 px-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Campaign</th>
                <th className="text-right py-2.5 px-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Submissions</th>
                <th className="text-right py-2.5 px-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Avg. Payout</th>
                <th className="text-right py-2.5 px-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Success</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, i) => (
                <tr key={campaign.name} className="border-b border-slate-50 hover:bg-orange-50/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-600">
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center shrink-0 border border-orange-100/50">
                        <Flame className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-semibold text-sm">{campaign.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="num-font font-semibold">{campaign.submissions}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="num-font font-semibold">{formatCurrency(campaign.avgPayout)}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
                      campaign.success >= 88 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    )}>
                      {campaign.success}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
})
