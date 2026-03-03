import { lazy, Suspense, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Settings, Calendar } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/contexts/ToastContext'
import { MOCK_LEADERBOARD_CONFIG, CURRENT_LEADERBOARD } from '@/data/leaderboard'

// ── Above the fold — regular imports ──
import { LeaderboardHero } from './_sections/LeaderboardHero'
import { PodiumSection } from './_sections/PodiumSection'

// ── Below the fold — lazy loaded ──
const RankList = lazy(() => import('./_sections/RankList').then(m => ({ default: m.RankList })))
const ConfigTab = lazy(() => import('./_sections/ConfigTab').then(m => ({ default: m.ConfigTab })))
const SnapshotHistory = lazy(() => import('./_sections/SnapshotHistory').then(m => ({ default: m.SnapshotHistory })))

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 animate-pulse ${className ?? ''}`}>
      <div className="h-4 w-1/3 rounded bg-slate-200 mb-4" />
      <div className="space-y-2.5">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
        <div className="h-3 w-4/5 rounded bg-slate-100" />
      </div>
    </div>
  )
}

const WEEK_OPTIONS = MOCK_LEADERBOARD_CONFIG.weeklySnapshots.map((snap, i) => ({
  value: String(i),
  label: i === 0 ? `Current Week (${snap.weekStart})` : `Week of ${snap.weekStart}`,
}))

export function LeaderboardPage() {
  const navigate = useNavigate()
  const { success } = useToast()
  const [weekIdx, setWeekIdx] = useState('0')
  const [tab, setTab] = useState('leaderboard')

  const selectedWeek = MOCK_LEADERBOARD_CONFIG.weeklySnapshots[Number(weekIdx)]
  const entries = selectedWeek?.entries ?? CURRENT_LEADERBOARD
  const podium = entries.slice(0, 3)
  const rest = entries.slice(3)
  const topEarner = entries[0] ? { name: entries[0].creatorName, earnings: entries[0].weeklyEarnings } : null

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* ── Hero Banner ── */}
      <LeaderboardHero
        totalEntries={entries.length}
        topEarner={topEarner}
        weekLabel={selectedWeek?.weekStart ?? 'Current'}
        weekIdx={weekIdx}
        onWeekChange={setWeekIdx}
        weekOptions={WEEK_OPTIONS}
      />

      {/* ── Tabs ── */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-slate-100/80 border border-slate-200/60 rounded-2xl p-1 h-auto gap-0.5">
          <TabsTrigger value="leaderboard" className="rounded-xl data-[state=active]:shadow-sm gap-1.5 text-xs">
            <Trophy className="h-3.5 w-3.5" />Rankings
          </TabsTrigger>
          <TabsTrigger value="config" className="rounded-xl data-[state=active]:shadow-sm gap-1.5 text-xs">
            <Settings className="h-3.5 w-3.5" />Configuration
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl data-[state=active]:shadow-sm gap-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5" />Snapshots
          </TabsTrigger>
        </TabsList>

        {/* ── Rankings Tab ── */}
        <TabsContent value="leaderboard" className="mt-5">
          <div className="space-y-5">
            <PodiumSection podium={podium} onViewCreator={id => navigate(`/creators/${id}`)} />
            <Suspense fallback={<CardSkeleton className="min-h-40" />}>
              <RankList entries={rest} onViewCreator={id => navigate(`/creators/${id}`)} />
            </Suspense>
          </div>
        </TabsContent>

        {/* ── Configuration Tab ── */}
        <TabsContent value="config" className="mt-5">
          <Suspense fallback={<CardSkeleton className="min-h-60" />}>
            <ConfigTab config={MOCK_LEADERBOARD_CONFIG} onSave={() => success('Leaderboard config saved')} />
          </Suspense>
        </TabsContent>

        {/* ── Snapshots Tab ── */}
        <TabsContent value="history" className="mt-5">
          <Suspense fallback={<CardSkeleton className="min-h-60" />}>
            <SnapshotHistory
              snapshots={MOCK_LEADERBOARD_CONFIG.weeklySnapshots}
              onViewWeek={idx => { setWeekIdx(String(idx)); setTab('leaderboard') }}
              onViewCreator={id => navigate(`/creators/${id}`)}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
