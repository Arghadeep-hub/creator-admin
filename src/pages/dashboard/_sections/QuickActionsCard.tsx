import { memo } from 'react'
import { Sparkles, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TONE_STYLES } from '../dashboard.types'
import type { QuickAction } from '../dashboard.types'

interface QuickActionsCardProps {
  actions: QuickAction[]
  onNavigate: (path: string) => void
}

export const QuickActionsCard = memo(function QuickActionsCard({ actions, onNavigate }: QuickActionsCardProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 px-4 sm:px-0">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold text-foreground">Today's Focus</h2>
        <span className="hidden sm:inline text-xs text-muted-foreground">— Prioritized actions to reduce delay and risk</span>
      </div>

      <div className="-mx-4 sm:mx-0">
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 gap-y-4 sm:gap-4 w-full overflow-x-auto sm:overflow-visible scrollbar-hide px-4 sm:px-0">
          {actions.map(action => {
            const Icon = action.icon
            const tone = TONE_STYLES[action.tone]
            return (
              <button
                key={action.label}
                type="button"
                onClick={() => onNavigate(action.href)}
                className={cn(
                  'group relative overflow-hidden rounded-xl border bg-white p-3.5 sm:p-4 text-left transition-all duration-200 cursor-pointer',
                  'hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]',
                  'shrink-0 sm:shrink w-[60%] sm:w-auto',
                  tone.border
                )}
              >
                {/* Accent gradient bar */}
                <div className={cn('absolute inset-x-0 top-0 h-0.75 bg-linear-to-r', tone.gradient)} />

                <div className="flex items-start justify-between gap-2">
                  <div className={cn('rounded-xl p-2 sm:p-2.5', tone.bg)}>
                    <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', tone.icon)} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-muted-foreground">Open</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>

                <div className="mt-2.5 sm:mt-3">
                  <p className="text-[13px] sm:text-sm font-bold text-foreground">{action.label}</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{action.description}</p>
                </div>

                {action.count > 0 && (
                  <div className={cn('absolute bottom-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-bold', tone.bg, tone.value)}>
                    {action.count}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
})
