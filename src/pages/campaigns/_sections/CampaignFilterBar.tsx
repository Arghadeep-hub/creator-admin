import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  Clock,
  DollarSign,
  Loader2,
  Search,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { SORT_OPTIONS } from '../campaigns.utils'
import type { CampaignSort } from '../campaigns.utils'

/** Icon for each sort option */
const sortIcons: Record<CampaignSort, React.ReactNode> = {
  attention: <AlertTriangle className="h-3.5 w-3.5 text-red-500" />,
  'highest-payout': <DollarSign className="h-3.5 w-3.5 text-emerald-500" />,
  'highest-success': <TrendingUp className="h-3.5 w-3.5 text-blue-500" />,
  deadline: <Clock className="h-3.5 w-3.5 text-amber-500" />,
  'most-filled': <Users className="h-3.5 w-3.5 text-purple-500" />,
}

/** Enriched sort options with icons for display */
const SORT_OPTIONS_WITH_ICONS = SORT_OPTIONS.map(opt => ({
  ...opt,
  label: opt.label,
  icon: sortIcons[opt.value],
}))

interface CampaignFilterBarProps {
  search: string
  sortBy: CampaignSort
  hasActiveFilters: boolean
  onSearchChange: (value: string) => void
  onSortChange: (value: CampaignSort) => void
  onClearFilters: () => void
  /** Optional: total number of active filters for the badge */
  activeFilterCount?: number
}

export function CampaignFilterBar({
  search,
  sortBy,
  hasActiveFilters,
  onSearchChange,
  onSortChange,
  onClearFilters,
  activeFilterCount,
}: CampaignFilterBarProps) {
  const [isTyping, setIsTyping] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Show a brief loading indicator while the user is typing (debounce visual)
  const handleSearch = (value: string) => {
    onSearchChange(value)
    setIsTyping(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setIsTyping(false), 400)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Count active filters (search text counts as 1, non-default sort counts as 1)
  const filterCount = activeFilterCount ?? ((search ? 1 : 0) + (sortBy !== 'attention' ? 1 : 0))

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {/* Search — full width on mobile */}
          <div className="relative w-full sm:flex-1 sm:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search campaigns, city…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="pl-9 pr-9"
            />
            {/* Typing indicator spinner */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 sm:w-52 sm:flex-none">
              <Select
                value={sortBy}
                onValueChange={value => onSortChange(value as CampaignSort)}
                options={SORT_OPTIONS_WITH_ICONS}
              />
            </div>

            {/* Clear filters with animated badge */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative shrink-0 gap-1"
                    onClick={onClearFilters}
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear
                    {filterCount > 0 && (
                      <motion.span
                        key={filterCount}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="ml-0.5 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white"
                      >
                        {filterCount}
                      </motion.span>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
