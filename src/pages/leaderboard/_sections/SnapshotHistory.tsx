import { memo } from 'react'
import { Trophy, Users, TrendingUp, ChevronRight } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RANK_ICONS } from '../leaderboard.types'
import type { LeaderboardConfig } from '@/types'

type WeeklySnapshot = LeaderboardConfig['weeklySnapshots'][number]

interface SnapshotHistoryProps {
  snapshots: WeeklySnapshot[]
  onViewWeek: (idx: number) => void
  onViewCreator: (id: string) => void
}

export const SnapshotHistory = memo(function SnapshotHistory({
  snapshots,
  onViewWeek,
  onViewCreator,
}: SnapshotHistoryProps) {
  return (
    <div className="space-y-3">
      {snapshots.map((snap, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className={cn(
                'h-8 w-8 rounded-xl flex items-center justify-center',
                i === 0 ? 'bg-amber-100' : 'bg-slate-100'
              )}>
                <Trophy className={cn('h-4 w-4', i === 0 ? 'text-amber-600' : 'text-slate-400')} />
              </div>
              <div>
                <p className="font-bold text-sm">
                  {i === 0 ? 'Current' : ''} Week of {snap.weekStart}
                </p>
                <p className="text-xs text-muted-foreground">
                  {snap.entries.length} creators ranked
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={i === 0 ? 'success' : 'gray'} className="rounded-full text-xs">
                {i === 0 ? 'Active' : 'Archived'}
              </Badge>
              {i !== 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 rounded-xl"
                  onClick={() => onViewWeek(i)}
                >
                  View <ChevronRight className="h-3 w-3 ml-0.5" />
                </Button>
              )}
            </div>
          </div>

          <div className="p-5">
            {/* Top-3 previews: h-scroll on mobile */}
            <div className="-mx-5 sm:mx-0">
              <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto scrollbar-hide px-5 sm:px-0 pb-1 sm:pb-0">
                {snap.entries.slice(0, 3).map((e) => (
                  <div
                    key={e.creatorId}
                    className={cn(
                      'flex items-center gap-3 bg-slate-50 hover:bg-slate-100 rounded-xl p-3 cursor-pointer transition-colors active:scale-[0.98]',
                      'shrink-0 w-[72%] sm:shrink sm:w-auto'
                    )}
                    onClick={() => onViewCreator(e.creatorId)}
                  >
                    <span className="text-xl">{RANK_ICONS[e.rank - 1]}</span>
                    <Avatar name={e.creatorName} size="sm" />
                    <div className="min-w-0">
                      <p className="font-semibold text-xs leading-tight truncate">
                        {e.creatorName}
                      </p>
                      <p className="text-xs text-primary num-font font-bold mt-0.5">
                        {formatCurrency(e.weeklyEarnings)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {snap.entries.length} creators
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                Top:{' '}
                <span className="font-semibold num-font text-emerald-600 ml-0.5">
                  {formatCurrency(snap.entries[0]?.weeklyEarnings ?? 0)}
                </span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})
