import { memo } from 'react'
import { Star } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { TIER_CONFIG, RANK_ICONS } from '../leaderboard.types'
import type { LeaderboardEntry } from '@/types'

interface PodiumSectionProps {
  podium: LeaderboardEntry[]
  onViewCreator: (id: string) => void
}

const shimmerKeyframes = `
@keyframes shimmer {
  0%, 100% { background-position: 200% 0; }
  50% { background-position: -200% 0; }
}
`

function getTierKey(rank: number): string {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  return 'bronze'
}

function PodiumCard({
  entry,
  visualRank,
  onViewCreator,
}: {
  entry: LeaderboardEntry
  visualRank: number
  onViewCreator: (id: string) => void
}) {
  const tierKey = getTierKey(visualRank)
  const tier = TIER_CONFIG[tierKey] ?? TIER_CONFIG.bronze
  const Icon = tier.icon
  const isFirst = visualRank === 1

  return (
    <div
      className={cn(
        'flex flex-col items-center',
        isFirst ? 'sm:-mt-4' : visualRank === 2 ? 'sm:mt-4' : 'sm:mt-8'
      )}
    >
      {/* Rank medal floating above */}
      <span className={cn('text-3xl mb-2 block', isFirst && 'text-4xl')}>
        {RANK_ICONS[visualRank - 1]}
      </span>

      <div
        className={cn(
          'relative w-full rounded-3xl border-2 overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]',
          tier.border,
          isFirst ? 'shadow-xl shadow-amber-200/60' : 'shadow-md'
        )}
        onClick={() => onViewCreator(entry.creatorId)}
      >
        {/* Shimmer border effect for 1st place */}
        {isFirst && (
          <>
            <style>{shimmerKeyframes}</style>
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none z-10"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.3), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s ease-in-out infinite',
              }}
            />
          </>
        )}

        {/* Card gradient background */}
        <div className={cn('absolute inset-0 opacity-20', tier.gradient)} />

        {/* Decorative icon */}
        <div className="absolute top-3 right-3">
          <Icon className={cn(
            'h-5 w-5',
            tierKey === 'gold' ? 'text-amber-500' : tierKey === 'silver' ? 'text-slate-400' : 'text-orange-500'
          )} />
        </div>

        <div className="relative p-4 flex flex-col items-center gap-2 text-center">
          <Avatar
            name={entry.creator.name}
            size={isFirst ? 'lg' : 'md'}
            className={cn(
              'ring-4',
              tierKey === 'gold' ? 'ring-amber-300' : tierKey === 'silver' ? 'ring-slate-300' : 'ring-orange-300'
            )}
          />
          <div>
            <p className={cn('font-bold leading-tight', isFirst ? 'text-base' : 'text-sm')}>
              {entry.creator.name}
            </p>
          </div>
          <p className={cn(
            'font-bold num-font',
            isFirst ? 'text-2xl' : 'text-xl',
            tierKey === 'gold' ? 'text-amber-700' : tierKey === 'silver' ? 'text-slate-600' : 'text-orange-700'
          )}>
            {formatCurrency(entry.weeklyEarnings)}
          </p>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-semibold text-muted-foreground">{entry.totalPoints} pts</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const PodiumSection = memo(function PodiumSection({
  podium,
  onViewCreator,
}: PodiumSectionProps) {
  if (podium.length < 3) return null

  return (
    <div className="relative mb-6">
      {/* Spotlight gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.15),transparent_70%)] rounded-3xl -z-10" />

      {/* Mobile layout: 1st full width, 2nd & 3rd side by side */}
      <div className="sm:hidden pt-6 px-2 space-y-4">
        <PodiumCard
          entry={podium[0]}
          visualRank={1}
          onViewCreator={onViewCreator}
        />
        <div className="grid grid-cols-2 gap-3">
          <PodiumCard
            entry={podium[1]}
            visualRank={2}
            onViewCreator={onViewCreator}
          />
          <PodiumCard
            entry={podium[2]}
            visualRank={3}
            onViewCreator={onViewCreator}
          />
        </div>
      </div>

      {/* Desktop layout: 2nd, 1st, 3rd */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-4 pt-6 px-2">
        <PodiumCard
          entry={podium[1]}
          visualRank={2}
          onViewCreator={onViewCreator}
        />
        <PodiumCard
          entry={podium[0]}
          visualRank={1}
          onViewCreator={onViewCreator}
        />
        <PodiumCard
          entry={podium[2]}
          visualRank={3}
          onViewCreator={onViewCreator}
        />
      </div>
    </div>
  )
})
