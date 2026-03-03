import { memo } from 'react'
import { Star, ChevronRight } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { RankCircle } from '../leaderboard.types'
import type { LeaderboardEntry } from '@/types'

interface RankListProps {
  entries: LeaderboardEntry[]
  onViewCreator: (id: string) => void
}

export const RankList = memo(function RankList({
  entries,
  onViewCreator,
}: RankListProps) {
  if (entries.length === 0) return null

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <div
          key={entry.creatorId}
          className={cn(
            'bg-white rounded-2xl border border-slate-200/70 p-4 flex items-center gap-4 cursor-pointer',
            'hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 transition-all duration-200 active:scale-[0.98] group',
            index % 2 === 0 && 'even:bg-slate-50/50'
          )}
          onClick={() => onViewCreator(entry.creatorId)}
        >
          <RankCircle rank={entry.rank} />
          <Avatar name={entry.creatorName} size="sm" />

          {/* Desktop layout */}
          <div className="flex-1 min-w-0 hidden sm:block">
            <p className="font-semibold text-sm group-hover:text-primary transition-colors">
              {entry.creatorName}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                {entry.points} pts
              </span>
              <span>{entry.submissions} reels</span>
              {entry.badges.map(badge => (
                <Badge key={badge} variant="gray" className="text-[10px] rounded-full px-2">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          {/* Mobile layout: stacked name + meta */}
          <div className="flex-1 min-w-0 sm:hidden">
            <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
              {entry.creatorName}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                {entry.points} pts
              </span>
              <span>{entry.submissions} reels</span>
            </div>
            {entry.badges.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {entry.badges.map(badge => (
                  <Badge key={badge} variant="gray" className="text-[10px] rounded-full px-2">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Earnings & tier */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="font-bold num-font text-slate-900 text-[15px]">
                {formatCurrency(entry.weeklyEarnings)}
              </p>
              <Badge
                variant={entry.tier === 'gold' ? 'warning' : entry.tier === 'silver' ? 'secondary' : 'gray'}
                className="capitalize text-[10px] rounded-full mt-0.5"
              >
                {entry.tier}
              </Badge>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
          </div>
        </div>
      ))}
    </div>
  )
})
