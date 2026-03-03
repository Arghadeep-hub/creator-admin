import { Crown, Medal, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

export const TIER_CONFIG: Record<string, {
  gradient: string
  border: string
  iconBg: string
  textColor: string
  icon: typeof Trophy
  label: string
}> = {
  gold: {
    gradient: 'bg-linear-to-br from-amber-400 via-yellow-300 to-amber-500',
    border: 'border-amber-300',
    iconBg: 'bg-amber-100',
    textColor: 'text-amber-700',
    icon: Crown,
    label: 'Gold',
  },
  silver: {
    gradient: 'bg-linear-to-br from-slate-300 via-slate-200 to-slate-400',
    border: 'border-slate-300',
    iconBg: 'bg-slate-100',
    textColor: 'text-slate-600',
    icon: Medal,
    label: 'Silver',
  },
  bronze: {
    gradient: 'bg-linear-to-br from-orange-400 via-amber-300 to-orange-500',
    border: 'border-orange-300',
    iconBg: 'bg-orange-100',
    textColor: 'text-orange-700',
    icon: Trophy,
    label: 'Bronze',
  },
}

export const RANK_ICONS = ['\u{1F947}', '\u{1F948}', '\u{1F949}']

export function RankCircle({ rank }: { rank: number }) {
  const colorMap: Record<number, string> = {
    1: 'bg-amber-400 text-white',
    2: 'bg-slate-400 text-white',
    3: 'bg-orange-400 text-white',
  }
  return (
    <div className={cn(
      'h-8 w-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 num-font',
      rank <= 3 ? colorMap[rank] : 'bg-slate-100 text-slate-500'
    )}>
      {rank}
    </div>
  )
}
