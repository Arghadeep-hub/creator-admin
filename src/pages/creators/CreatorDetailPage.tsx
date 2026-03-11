import { lazy, Suspense, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Instagram, MapPin, Wallet, CheckCircle,
  Shield, Star, Zap, Trophy, ChevronRight, AlertTriangle,
  Calendar, Lock, TrendingUp, Video,
} from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PageLoader } from '@/components/ui/PageLoader'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'
import {
  useGetCreatorQuery,
  useGetCreatorSubmissionsQuery,
  useUpdateCreatorKycMutation,
  useFlagCreatorMutation,
} from '@/store/api/creatorsApi'

// ── Lazy-loaded tab sections ──
const CreatorOverviewSection = lazy(() =>
  import('./_sections/CreatorOverviewSection').then(m => ({ default: m.CreatorOverviewSection }))
)
const CreatorKycSection = lazy(() =>
  import('./_sections/CreatorKycSection').then(m => ({ default: m.CreatorKycSection }))
)
const CreatorSubmissionsSection = lazy(() =>
  import('./_sections/CreatorSubmissionsSection').then(m => ({ default: m.CreatorSubmissionsSection }))
)

const BADGE_ICONS: Record<string, typeof Star> = {
  'badge-001': Star,
  'badge-002': Zap,
  'badge-003': Shield,
  'badge-004': Trophy,
}

function SectionSkeleton() {
  return <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />
}

export function CreatorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success, error } = useToast()
  const { session } = useAuth()
  const [tab, setTab] = useState('overview')
  const [subPage] = useState(1)
  const [subLimit] = useState(50)

  const { data: creator, isLoading, isError } = useGetCreatorQuery(id!)
  const { data: submissionsData, isLoading: isSubmissionsLoading } = useGetCreatorSubmissionsQuery(
    { id: id!, params: { page: subPage, limit: subLimit } },
    { skip: !id }
  )
  const [updateKyc, { isLoading: isUpdatingKyc }] = useUpdateCreatorKycMutation()
  const [flagCreator, { isLoading: isFlagging }] = useFlagCreatorMutation()

  const submissions = submissionsData?.data ?? []

  if (isLoading) return <PageLoader />
  if (isError || !creator) {
    return (
      <EmptyState
        title="Creator not found"
        description="Unable to load creator data."
        actionLabel="Back to Creators"
        onAction={() => navigate('/creators')}
      />
    )
  }

  // Derive submission counts from fetched submissions list; fallback to 0
  const totalSubmissions = submissions.length
  const approvedSubmissions = submissions.filter(s => s.status === 'APPROVED' || s.status === 'PAID').length
  const approvalRate = totalSubmissions > 0
    ? Math.round((approvedSubmissions / totalSubmissions) * 100)
    : 0

  async function handleVerifyKyc() {
    try {
      await updateKyc({ id: creator!.id, body: { kycStatus: 'verified' } }).unwrap()
      success('KYC verified', creator!.name)
    } catch {
      error('Failed to verify KYC')
    }
  }

  async function handleRejectKyc() {
    try {
      await updateKyc({ id: creator!.id, body: { kycStatus: 'rejected' } }).unwrap()
      error('KYC rejected', creator!.name)
    } catch {
      error('Failed to reject KYC')
    }
  }

  async function handleFlag() {
    try {
      await flagCreator({ id: creator!.id, body: { accountStatus: 'flagged' } }).unwrap()
      error('Creator flagged', creator!.name)
    } catch {
      error('Failed to flag creator')
    }
  }

  async function handleUnflag() {
    try {
      await flagCreator({ id: creator!.id, body: { accountStatus: 'active' } }).unwrap()
      success('Creator unflagged', creator!.name)
    } catch {
      error('Failed to unflag creator')
    }
  }

  return (
    <div className="space-y-4">

      {/* Breadcrumb nav */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={() => navigate('/creators')}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground active:scale-95 transition-all shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Creators</span>
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 hidden sm:block" />
        <span className="text-sm font-semibold text-foreground truncate min-w-0 hidden sm:block">
          {creator.name}
        </span>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {creator.accountStatus && <StatusBadge status={creator.accountStatus} />}
          <StatusBadge status={creator.kycStatus} />
        </div>
      </div>

      {/* Profile hero card */}
      <div className="admin-card overflow-hidden">
        <div className="h-1 bg-linear-to-r from-orange-300 via-primary to-orange-300" />
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Avatar src={creator.profileImage ?? undefined} name={creator.name} size="lg" className="shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-bold text-base leading-tight">{creator.name}</p>
                {creator.accountStatus === 'flagged' && (
                  <Badge variant="error" className="text-[10px] px-1.5 py-0">
                    <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                    Flagged
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{creator.instagramHandle}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />{creator.city}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />Joined {new Date(creator.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-primary num-font">{formatCurrency(creator.walletBalance)}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">balance</p>
            </div>
          </div>

          {/* Metric chips */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/60 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 rounded-full px-2.5 py-1">
              <Instagram className="h-3 w-3 text-pink-400" />{formatNumber(creator.instagramFollowers)}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 rounded-full px-2.5 py-1">
              <TrendingUp className="h-3 w-3 text-slate-400" />{creator.instagramMetrics?.avgEngagement ?? creator.avgEngagement ?? 0}% eng
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 rounded-full px-2.5 py-1">
              <Video className="h-3 w-3 text-slate-400" />{totalSubmissions} subs
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-1">
              <CheckCircle className="h-3 w-3" />{approvalRate}% approved
            </span>

            {/* Action button — pushed right */}
            <div className="ml-auto">
              {creator.accountStatus !== 'flagged' ? (
                <Button variant="destructive" size="sm" onClick={handleFlag} disabled={isFlagging} className="h-7 text-xs">
                  Flag
                </Button>
              ) : (
                <Button variant="success" size="sm" onClick={handleUnflag} disabled={isFlagging} className="h-7 text-xs">
                  Unflag
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key metrics strip — horizontal scroll on mobile */}
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 py-0.5 md:mx-0 md:grid md:grid-cols-4 md:px-0" style={{ scrollbarWidth: 'none' }}>
        {[
          { label: 'Wallet Balance', value: formatCurrency(creator.walletBalance), icon: Wallet, color: 'text-primary', bg: 'bg-orange-50' },
          { label: 'Locked (72h)', value: formatCurrency(creator.lockedEarnings), icon: Lock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Weekly Earnings', value: formatCurrency(creator.weeklyEarnings), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Lifetime Earnings', value: formatCurrency(creator.lifetimeEarnings), icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(metric => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="admin-card p-4 min-w-35 shrink-0 md:min-w-0">
              <div className={cn('inline-flex p-2 rounded-xl mb-2', metric.bg)}>
                <Icon className={cn('h-4 w-4', metric.color)} />
              </div>
              <p className={cn('text-lg font-bold num-font leading-none', metric.color)}>{metric.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wide">{metric.label}</p>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <div className="-mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="w-full justify-start overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="submissions">
              Submissions
              {!isSubmissionsLoading && (
                <Badge variant="secondary" className="ml-1.5 h-5 min-w-5 px-1.5 text-[10px] num-font">{submissions.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="earnings">Earnings & Badges</TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Suspense fallback={<SectionSkeleton />}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-start">
              <CreatorOverviewSection creator={creator} />
              <CreatorKycSection
                creator={creator}
                isUpdatingKyc={isUpdatingKyc}
                isSuperAdmin={session?.role === 'super_admin'}
                onVerifyKyc={handleVerifyKyc}
                onRejectKyc={handleRejectKyc}
              />
            </div>
          </Suspense>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions">
          <Suspense fallback={<SectionSkeleton />}>
            <CreatorSubmissionsSection
              submissions={submissions}
              isLoading={isSubmissionsLoading}
            />
          </Suspense>
        </TabsContent>

        {/* Earnings & Badges Tab */}
        <TabsContent value="earnings">
          <div className="space-y-6">

            {/* Earnings breakdown */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Earnings Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Wallet Balance', value: formatCurrency(creator.walletBalance), icon: Wallet, color: 'text-primary', bg: 'bg-orange-50' },
                  { label: 'Locked (72h)', value: formatCurrency(creator.lockedEarnings), icon: Lock, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Weekly Earnings', value: formatCurrency(creator.weeklyEarnings), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Lifetime', value: formatCurrency(creator.lifetimeEarnings), icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map(e => {
                  const Icon = e.icon
                  return (
                    <div key={e.label} className="admin-card p-4">
                      <div className={cn('inline-flex p-1.5 rounded-lg mb-2', e.bg)}>
                        <Icon className={cn('h-3.5 w-3.5', e.color)} />
                      </div>
                      <p className={cn('text-lg font-bold num-font leading-none', e.color)}>{e.value}</p>
                      <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wide">{e.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Submissions overview */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Submissions Overview</h3>
              <div className="admin-card p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold num-font text-foreground">{totalSubmissions}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold num-font text-emerald-600">{approvedSubmissions}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">Approved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold num-font text-red-600">{submissions.filter(s => s.status === 'REJECTED').length}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">Rejected</p>
                  </div>
                </div>
                {/* Approval rate bar */}
                <div className="mt-4 pt-3 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Approval Rate</span>
                    <span className={cn(
                      'font-bold num-font',
                      approvalRate >= 70 ? 'text-emerald-600' : approvalRate >= 40 ? 'text-amber-600' : 'text-red-600'
                    )}>{approvalRate}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        approvalRate >= 70
                          ? 'bg-linear-to-r from-emerald-500 to-emerald-400'
                          : approvalRate >= 40
                            ? 'bg-linear-to-r from-amber-500 to-amber-400'
                            : 'bg-linear-to-r from-red-500 to-red-400'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${approvalRate}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Milestone Badges */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Milestone Badges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(creator.milestoneBadges ?? []).map(badge => {
                  const Icon = BADGE_ICONS[badge.id] ?? Star
                  return (
                    <motion.div
                      key={badge.id}
                      whileHover={badge.isUnlocked ? { y: -2 } : undefined}
                      transition={{ duration: 0.15 }}
                    >
                      <div className={cn(
                        'admin-card p-4 flex items-center gap-4 transition-all',
                        badge.isUnlocked
                          ? 'hover:shadow-md'
                          : 'opacity-50 grayscale'
                      )}>
                        <div className={cn(
                          'h-11 w-11 rounded-xl flex items-center justify-center shrink-0',
                          badge.isUnlocked
                            ? 'bg-linear-to-br from-amber-50 to-orange-50 ring-1 ring-amber-200'
                            : 'bg-slate-100'
                        )}>
                          <Icon className={cn('h-5 w-5', badge.isUnlocked ? 'text-amber-500' : 'text-slate-400')} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm">{badge.name}</p>
                          {badge.isUnlocked && badge.earnedAt ? (
                            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
                              <CheckCircle className="h-3 w-3" />
                              Earned {new Date(badge.earnedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground mt-0.5">Not yet unlocked</p>
                          )}
                        </div>
                        {badge.isUnlocked && (
                          <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
