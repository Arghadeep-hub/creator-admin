import { memo } from 'react'
import { Settings, Calendar } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TIER_CONFIG } from '../leaderboard.types'
import type { LeaderboardConfig } from '@/types'

interface ConfigTabProps {
  config: LeaderboardConfig
  onSave: () => void
}

export const ConfigTab = memo(function ConfigTab({
  config,
  onSave,
}: ConfigTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Tier Settings */}
      <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <Settings className="h-4 w-4 text-amber-600" />
          </div>
          <h3 className="font-bold text-sm">Tier Settings</h3>
        </div>
        <div className="p-5 space-y-3">
          {config.tiers.map(tier => {
            const cfg = TIER_CONFIG[tier.name.toLowerCase()] ?? TIER_CONFIG.bronze
            return (
              <div key={tier.name} className={cn(
                'rounded-2xl border-2 p-4 relative overflow-hidden',
                cfg.border
              )}>
                <div className={cn('absolute inset-0 opacity-10', cfg.gradient)} />
                <div className="relative flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn('h-7 w-7 rounded-xl flex items-center justify-center', cfg.iconBg)}>
                      <cfg.icon className={cn('h-3.5 w-3.5', cfg.textColor)} />
                    </div>
                    <p className="font-bold text-sm">{tier.name} Tier</p>
                  </div>
                  <Badge
                    variant={tier.name === 'Gold' ? 'warning' : tier.name === 'Silver' ? 'secondary' : 'gray'}
                    className="rounded-full font-bold"
                  >
                    {tier.payoutMultiplier}x payout
                  </Badge>
                </div>
                <div className="relative grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="bg-white/70 rounded-xl px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide font-semibold mb-0.5">Rank Range</p>
                    <p className="font-semibold text-foreground">
                      {tier.rankRange.min}&ndash;{tier.rankRange.max ?? '\u221E'}
                    </p>
                  </div>
                  <div className="bg-white/70 rounded-xl px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide font-semibold mb-0.5">Min Weekly</p>
                    <p className="font-semibold text-foreground num-font">
                      {formatCurrency(tier.minWeeklyEarnings)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reset Settings */}
      <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="font-bold text-sm">Reset Settings</h3>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
            <span className="text-sm text-muted-foreground">Reset Day</span>
            <span className="font-semibold text-sm capitalize">{config.resetDay}</span>
          </div>
          <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
            <span className="text-sm text-muted-foreground">Reset Time</span>
            <span className="font-semibold text-sm num-font">
              {config.resetTime} {config.timezone}
            </span>
          </div>

          <div className="pt-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
              Auto-assigned Badges
            </p>
            <div className="space-y-2">
              {config.badgeTypes.map(b => (
                <div key={b.name} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5">
                  <span className="text-sm font-medium">{b.name}</span>
                  <Badge variant="gray" className="text-[10px] rounded-full">{b.criteria}</Badge>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full rounded-xl mt-2" onClick={onSave}>
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  )
})
