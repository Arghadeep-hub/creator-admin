import { useState } from 'react'
import { Trophy, Crown, Medal, TrendingUp, Users, Calendar, Settings } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/contexts/ToastContext'
import { formatCurrency } from '@/lib/utils'
import { MOCK_LEADERBOARD_CONFIG, CURRENT_LEADERBOARD } from '@/data/leaderboard'

const WEEK_OPTIONS = MOCK_LEADERBOARD_CONFIG.weeklySnapshots.map((snap, i) => ({
  value: String(i),
  label: i === 0 ? `Current Week (${snap.weekStart})` : `Week of ${snap.weekStart}`,
}))

const TIER_STYLES: Record<string, { border: string; bg: string; icon: typeof Trophy }> = {
  gold: { border: 'border-amber-300', bg: 'bg-amber-50', icon: Crown },
  silver: { border: 'border-slate-300', bg: 'bg-slate-50', icon: Medal },
  bronze: { border: 'border-amber-700/40', bg: 'bg-orange-50', icon: Trophy },
}

const RANK_ICONS = ['🥇', '🥈', '🥉']

export function LeaderboardPage() {
  const { success } = useToast()
  const [weekIdx, setWeekIdx] = useState('0')
  const [tab, setTab] = useState('leaderboard')
  const [_configChanged, _setConfigChanged] = useState(false)

  const selectedWeek = MOCK_LEADERBOARD_CONFIG.weeklySnapshots[Number(weekIdx)]
  const entries = selectedWeek?.entries ?? CURRENT_LEADERBOARD

  const podium = entries.slice(0, 3)
  const rest = entries.slice(3)

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leaderboard"
        subtitle="Weekly creator rankings"
      >
        <Select value={weekIdx} onValueChange={setWeekIdx} options={WEEK_OPTIONS} className="w-52" />
      </PageHeader>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="history">Snapshots</TabsTrigger>
        </TabsList>

        {/* ── Leaderboard ── */}
        <TabsContent value="leaderboard">
          {/* Podium (Top 3) */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[podium[1], podium[0], podium[2]].map((entry, podiumIdx) => {
              if (!entry) return null
              const visualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3
              const actualEntry = entry
              const styles = TIER_STYLES[actualEntry.tier]
              const Icon = styles.icon
              const heights = { 1: 'pt-0', 2: 'pt-6', 3: 'pt-12' }

              return (
                <div key={actualEntry.creatorId} className={`flex flex-col items-center ${heights[visualRank as 1|2|3]}`}>
                  <div className={`relative w-full rounded-2xl border-2 ${styles.border} ${styles.bg} p-4 flex flex-col items-center gap-2 transition-transform hover:scale-105`}>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="text-2xl">{RANK_ICONS[visualRank - 1]}</span>
                    </div>
                    <Avatar name={actualEntry.creatorName} size="lg" className="mt-2" />
                    <p className="font-bold text-sm text-center leading-tight">{actualEntry.creatorName}</p>
                    <p className="text-primary font-bold num-font text-lg">{formatCurrency(actualEntry.weeklyEarnings)}</p>
                    <p className="text-xs text-muted-foreground">{actualEntry.points} pts · {actualEntry.submissions} reels</p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {actualEntry.badges.map(badge => (
                        <Badge key={badge} variant="orange" className="text-xs">{badge}</Badge>
                      ))}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Icon className={`h-4 w-4 ${actualEntry.tier === 'gold' ? 'text-amber-500' : actualEntry.tier === 'silver' ? 'text-slate-400' : 'text-amber-700'}`} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Rest of leaderboard */}
          <div className="space-y-2">
            {rest.map(entry => (
              <div
                key={entry.creatorId}
                className="admin-card p-4 flex items-center gap-4"
              >
                <span className="text-lg font-bold num-font text-muted-foreground w-8 text-center">#{entry.rank}</span>
                <Avatar name={entry.creatorName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{entry.creatorName}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{entry.points} pts</span>
                    <span>{entry.submissions} reels</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {entry.badges.map(badge => (
                    <Badge key={badge} variant="gray" className="text-xs hidden sm:flex">{badge}</Badge>
                  ))}
                  <p className="font-bold num-font text-primary">{formatCurrency(entry.weeklyEarnings)}</p>
                  <Badge
                    variant={entry.tier === 'gold' ? 'warning' : entry.tier === 'silver' ? 'secondary' : 'gray'}
                    className="capitalize"
                  >
                    {entry.tier}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── Configuration ── */}
        <TabsContent value="config">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-4 w-4" />Tier Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {MOCK_LEADERBOARD_CONFIG.tiers.map(tier => (
                  <div key={tier.name} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">{tier.name} Tier</p>
                      <Badge variant={tier.name === 'Gold' ? 'warning' : tier.name === 'Silver' ? 'secondary' : 'gray'}>
                        {tier.payoutMultiplier}x payout
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span>Ranks: {tier.rankRange.min}–{tier.rankRange.max ?? '∞'}</span>
                      <span>Min Weekly: {formatCurrency(tier.minWeeklyEarnings)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-4 w-4" />Reset Settings</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reset Day</span>
                  <span className="font-medium capitalize">{MOCK_LEADERBOARD_CONFIG.resetDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reset Time</span>
                  <span className="font-medium">{MOCK_LEADERBOARD_CONFIG.resetTime} {MOCK_LEADERBOARD_CONFIG.timezone}</span>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground mb-2">Auto-assigned Badges</p>
                  <div className="space-y-1.5">
                    {MOCK_LEADERBOARD_CONFIG.badgeTypes.map(b => (
                      <div key={b.name} className="flex items-center justify-between">
                        <span>{b.name}</span>
                        <Badge variant="gray" className="text-xs">{b.criteria}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full mt-2" onClick={() => success('Leaderboard config saved')}>
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── History ── */}
        <TabsContent value="history">
          <div className="space-y-4">
            {MOCK_LEADERBOARD_CONFIG.weeklySnapshots.map((snap, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{i === 0 ? '🔴 Current' : ''} Week of {snap.weekStart}</span>
                    <Badge variant={i === 0 ? 'success' : 'gray'}>{i === 0 ? 'Active' : 'Archived'}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {snap.entries.slice(0, 3).map((e) => (
                      <div key={e.creatorId} className="flex items-center gap-2">
                        <span className="text-lg">{RANK_ICONS[e.rank - 1]}</span>
                        <div>
                          <p className="font-medium text-xs leading-tight">{e.creatorName}</p>
                          <p className="text-xs text-primary num-font">{formatCurrency(e.weeklyEarnings)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{snap.entries.length} creators ranked</span>
                    <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />
                      Top earnings: {formatCurrency(snap.entries[0]?.weeklyEarnings ?? 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
