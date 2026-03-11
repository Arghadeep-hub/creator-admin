import { lazy, Suspense, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Edit,
  MapPin,
  Pause,
  Play,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { EmptyState } from '@/components/shared/EmptyState'
import { useToast } from '@/contexts/ToastContext'
import { cn, formatCurrency } from '@/lib/utils'
import {
  useGetCampaignQuery,
  useGetCampaignSubmissionsQuery,
  useGetCampaignAnalyticsQuery,
  useToggleCampaignStatusMutation,
} from '@/store/api/campaignsApi'
import { getCampaignDisplayStatus, getDeadlineCountdown, getFillPercent } from './campaigns.utils'

const OverviewTab    = lazy(() => import('./_tabs/OverviewTab'))
const SubmissionsTab = lazy(() => import('./_tabs/SubmissionsTab'))
const AnalyticsTab   = lazy(() => import('./_tabs/AnalyticsTab'))

function TabSkeleton() {
  return (
    <div className="mt-4 animate-pulse space-y-3">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="space-y-3 rounded-xl border bg-white p-5">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-2.5 w-20 rounded bg-slate-200" />
                  <div className="h-3.5 w-28 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2 rounded-xl border bg-white p-5">
            <div className="h-4 w-28 rounded bg-slate-200" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-3 rounded bg-slate-200" />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border bg-white p-5">
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-200" />
              <div className="h-3 w-3/4 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* -- Campaign lifecycle progress bar -- */
function CampaignProgressBar({ campaign, effectiveStatus }: { campaign: { totalSpots: number; spotsLeft: number; deadline: string; createdAt: string; isActive: boolean }; effectiveStatus: string }) {
  const fillPercent = getFillPercent(campaign as Parameters<typeof getFillPercent>[0])
  const isExpired = effectiveStatus === 'expired'
  const isCompleted = isExpired || fillPercent >= 100

  // Determine current stage
  const stages = [
    { label: 'Created', done: true },
    { label: 'Active', done: effectiveStatus === 'active' || isCompleted },
    { label: `${fillPercent}% filled`, done: fillPercent > 0 },
    { label: isCompleted ? 'Completed' : 'In Progress', done: isCompleted },
  ]

  // Progress percentage (0-100)
  const stagesDone = stages.filter(s => s.done).length
  const progressPct = Math.round((stagesDone / stages.length) * 100)

  return (
    <div className="space-y-2">
      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/60">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700',
            isCompleted
              ? 'bg-linear-to-r from-emerald-500 to-emerald-400'
              : 'bg-linear-to-r from-orange-500 to-amber-400',
          )}
          style={{ width: `${progressPct}%` }}
        />
      </div>
      {/* Stage labels */}
      <div className="hidden sm:flex items-center justify-between">
        {stages.map((stage, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={cn(
              'h-1.5 w-1.5 rounded-full',
              stage.done ? 'bg-emerald-500' : 'bg-slate-300',
            )} />
            <span className={cn(
              'text-[10px] font-medium',
              stage.done ? 'text-slate-700' : 'text-slate-400',
            )}>
              {stage.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [tab, setTab] = useState('overview')
  const [imgFailed, setImgFailed] = useState(false)
  const [subPage] = useState(1)
  const subLimit = 50

  // RTK Query hooks
  const { data: campaign, isLoading, isError } = useGetCampaignQuery(id ?? '', { skip: !id })
  const { data: submissionsData } = useGetCampaignSubmissionsQuery(
    { id: id ?? '', params: { page: subPage, limit: subLimit } },
    { skip: !id },
  )
  useGetCampaignAnalyticsQuery(id ?? '', { skip: !id })
  const [toggleStatus] = useToggleCampaignStatusMutation()

  const submissions = submissionsData?.data ?? []

  if (isLoading) {
    return <TabSkeleton />
  }

  if (isError || !campaign) {
    return (
      <EmptyState
        title="Campaign not found"
        description="The campaign you're looking for doesn't exist."
        actionLabel="Back to Campaigns"
        onAction={() => navigate('/campaigns')}
      />
    )
  }

  const effectiveStatus = getCampaignDisplayStatus(campaign)
  const canToggle = effectiveStatus !== 'expired'
  const deadlineCountdown = getDeadlineCountdown(campaign.deadline)

  const approved = useMemo(
    () => submissions.filter(s => s.status === 'APPROVED' || s.status === 'PAID').length,
    [submissions],
  )
  const rejected = useMemo(
    () => submissions.filter(s => s.status === 'REJECTED').length,
    [submissions],
  )
  const pending = useMemo(
    () => submissions.filter(s => s.status === 'PENDING').length,
    [submissions],
  )
  const approvalRate = submissions.length > 0
    ? Math.round((approved / submissions.length) * 100)
    : 0

  async function handleStatusToggle() {
    if (!id || !campaign) return
    const newIsActive = !campaign.isActive
    try {
      await toggleStatus({ id, body: { isActive: newIsActive } }).unwrap()
      success(
        newIsActive ? 'Campaign activated' : 'Campaign deactivated',
        campaign.restaurantName,
      )
    } catch (err: unknown) {
      const data = (err as { data?: { error?: string; message?: string } })?.data
      if (data?.error === 'insufficient_pool') {
        error(data.message ?? 'Insufficient pool balance to activate campaign', campaign.restaurantName)
      } else {
        error('Failed to update campaign status', campaign.restaurantName)
      }
    }
  }

  return (
    <div className="space-y-4">

      {/* -- Hero image -- full-bleed on mobile (shorter), rounded on sm+ -- */}
      <div className="relative -mx-4 -mt-4 h-44 overflow-hidden sm:mx-0 sm:mt-0 sm:h-48 sm:rounded-2xl">
        {!imgFailed && campaign.restaurantLogo ? (
          <img
            src={campaign.restaurantLogo}
            alt={campaign.restaurantName}
            className="h-full w-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-orange-100 via-amber-50 to-slate-200" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-900/30 to-transparent" />

        {/* Back button -- glass pill */}
        <button
          onClick={() => navigate('/campaigns')}
          className="absolute left-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        {/* Desktop action buttons top-right */}
        <div className="absolute right-4 top-4 hidden sm:flex items-center gap-2">
          {canToggle && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleStatusToggle}
              className={cn(
                'bg-white/90 backdrop-blur-sm border',
                effectiveStatus === 'active'
                  ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
                  : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50',
              )}
            >
              {effectiveStatus === 'active'
                ? <><Pause className="h-3.5 w-3.5" />Deactivate</>
                : <><Play className="h-3.5 w-3.5" />Activate</>}
            </Button>
          )}
          <Button
            size="sm"
            className="bg-white/90 backdrop-blur-sm text-slate-800 hover:bg-white border border-white/60"
            variant="outline"
            onClick={() => navigate(`/campaigns/${id}/edit`)}
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>
        </div>

        {/* Bottom overlay: status + countdown + name + location */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={effectiveStatus} />
            {/* Time remaining countdown badge */}
            {effectiveStatus !== 'expired' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                <Clock className="h-3 w-3" />
                {deadlineCountdown}
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-white leading-tight">{campaign.restaurantName}</h1>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-white/70">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {campaign.city}
          </p>
        </div>
      </div>

      {/* -- Campaign progress bar -- */}
      <CampaignProgressBar campaign={campaign} effectiveStatus={effectiveStatus} />

      {/* -- KPI strip -- horizontal scroll on mobile, grid on sm+ -- */}
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 py-0.5 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 sm:py-0">
        {[
          {
            label: 'Submissions',
            value: campaign.submissionsCount,
            icon: Target,
            iconClass: 'text-slate-500',
            cardClass: 'bg-white',
          },
          {
            label: 'Approved',
            value: approved,
            icon: CheckCircle,
            iconClass: 'text-emerald-500',
            cardClass: 'bg-emerald-50/70 border-emerald-200',
            sub: `${approvalRate}% rate`,
          },
          {
            label: 'Rejected',
            value: rejected,
            icon: XCircle,
            iconClass: 'text-red-500',
            cardClass: 'bg-red-50/70 border-red-200',
            sub: `${pending} pending`,
          },
          {
            label: 'Avg Earning',
            value: formatCurrency(campaign.averageEarning),
            icon: TrendingUp,
            iconClass: 'text-primary',
            cardClass: 'bg-orange-50/70 border-orange-200',
            sub: `${campaign.successRate}% success`,
          },
        ].map(kpi => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className={cn(
                'admin-card flex shrink-0 items-center gap-3 p-4 sm:shrink',
                'w-44 sm:w-auto',
                kpi.cardClass,
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <Icon className={`h-5 w-5 ${kpi.iconClass}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">{kpi.label}</p>
                <p className="text-xl font-bold num-font">{kpi.value}</p>
                {kpi.sub && <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>}
              </div>
            </div>
          )
        })}
      </div>

      {/* -- Tabs -- scrollable underline strip on mobile, pill on sm+ -- */}
      <Tabs value={tab} onValueChange={setTab}>
        <div className="-mx-4 overflow-x-auto sm:mx-0">
          <TabsList className="flex h-auto min-w-max flex-nowrap gap-0 rounded-none border-b border-slate-200 bg-transparent px-4 pb-0 pt-0 sm:inline-flex sm:min-w-0 sm:flex-wrap sm:rounded-lg sm:border-0 sm:bg-slate-100 sm:px-1 sm:py-1">
            {[
              { value: 'overview',    label: 'Overview' },
              { value: 'submissions', label: `Submissions (${submissions.length})` },
              { value: 'analytics',   label: 'Analytics' },
            ].map(t => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className={cn(
                  'rounded-none border-b-2 px-4 pb-3 pt-2.5 text-sm font-medium transition-colors sm:rounded-md sm:border-0 sm:px-3 sm:py-1.5',
                  tab === t.value
                    ? 'border-primary text-foreground sm:border-0 sm:bg-white sm:shadow-sm'
                    : 'border-transparent text-muted-foreground hover:text-foreground sm:border-0 sm:bg-transparent sm:shadow-none',
                )}
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview">
          <Suspense fallback={<TabSkeleton />}>
            <OverviewTab campaign={campaign} />
          </Suspense>
        </TabsContent>

        <TabsContent value="submissions">
          <Suspense fallback={<TabSkeleton />}>
            <SubmissionsTab
              submissions={submissions}
              approved={approved}
              rejected={rejected}
              pending={pending}
              onNavigate={subId => navigate(`/submissions/${subId}`)}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics">
          <Suspense fallback={<TabSkeleton />}>
            <AnalyticsTab
              campaign={campaign}
              approvalRate={approvalRate}
              approved={approved}
              pending={pending}
              totalSubmissions={submissions.length}
            />
          </Suspense>
        </TabsContent>
      </Tabs>

      {/* Spacer for sticky action bar on mobile */}
      <div className="h-16 sm:hidden" />

      {/* -- Sticky bottom action bar -- mobile only -- */}
      {canToggle && (
        <div className="fixed inset-x-0 bottom-(--mobile-nav-height) z-20 sm:hidden">
          <div className="border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-xl">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className={cn(
                  'flex-1',
                  effectiveStatus === 'active'
                    ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
                    : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50',
                )}
                onClick={handleStatusToggle}
              >
                {effectiveStatus === 'active'
                  ? <><Pause className="h-4 w-4" />Deactivate Campaign</>
                  : <><Play className="h-4 w-4" />Activate Campaign</>}
              </Button>
              <Button className="flex-1" onClick={() => navigate(`/campaigns/${id}/edit`)}>
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
