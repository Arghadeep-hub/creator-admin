import { lazy, Suspense, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle,
  Edit,
  MapPin,
  Pause,
  Play,
  Target,
  Wallet,
  XCircle,
} from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { EmptyState } from '@/components/shared/EmptyState'
import { useToast } from '@/contexts/ToastContext'
import { cn, formatCurrency } from '@/lib/utils'
import { MOCK_CAMPAIGNS } from '@/data/campaigns'
import { MOCK_SUBMISSIONS } from '@/data/submissions'

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

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success } = useToast()
  const [tab, setTab] = useState('overview')
  const [imgFailed, setImgFailed] = useState(false)
  const [campaignStatus, setCampaignStatus] = useState<'draft' | 'active' | 'paused' | 'expired' | null>(null)

  const campaign = MOCK_CAMPAIGNS.find(c => c.id === id)
  const submissions = useMemo(
    () => MOCK_SUBMISSIONS.filter(s => s.campaignId === id),
    [id],
  )

  if (!campaign) {
    return (
      <EmptyState
        title="Campaign not found"
        description="The campaign you're looking for doesn't exist."
        actionLabel="Back to Campaigns"
        onAction={() => navigate('/campaigns')}
      />
    )
  }

  const effectiveStatus = campaignStatus ?? campaign.status

  const approved = useMemo(
    () => submissions.filter(s => s.status === 'approved' || s.status === 'paid').length,
    [submissions],
  )
  const rejected = useMemo(
    () => submissions.filter(s => s.status === 'rejected').length,
    [submissions],
  )
  const pending = useMemo(
    () => submissions.filter(s => s.status === 'pending').length,
    [submissions],
  )
  const approvalRate = submissions.length > 0
    ? Math.round((approved / submissions.length) * 100)
    : 0

  const canToggle = effectiveStatus === 'active' || effectiveStatus === 'paused' || effectiveStatus === 'draft'

  function handleStatusToggle() {
    if (effectiveStatus === 'active') {
      setCampaignStatus('paused')
      success('Campaign paused', campaign?.name ?? '')
    } else if (effectiveStatus === 'paused' || effectiveStatus === 'draft') {
      setCampaignStatus('active')
      success('Campaign activated', campaign?.name ?? '')
    }
  }

  return (
    <div className="space-y-4">

      {/* ── Hero image — full-bleed on mobile, rounded on sm+ ── */}
      <div className="relative -mx-4 -mt-4 h-52 overflow-hidden sm:mx-0 sm:mt-0 sm:h-48 sm:rounded-2xl">
        {!imgFailed && campaign.businessLogo ? (
          <img
            src={campaign.businessLogo}
            alt={campaign.businessName}
            className="h-full w-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-orange-100 via-amber-50 to-slate-200" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-900/30 to-transparent" />

        {/* Back button — glass pill */}
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
                ? <><Pause className="h-3.5 w-3.5" />Pause</>
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

        {/* Bottom overlay: status + name + location */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={effectiveStatus} />
          </div>
          <h1 className="text-xl font-bold text-white leading-tight">{campaign.name}</h1>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-white/70">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {campaign.businessName} · {campaign.city}
          </p>
        </div>
      </div>

      {/* ── KPI strip — horizontal scroll on mobile, grid on sm+ ── */}
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 py-0.5 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 sm:py-0">
        {[
          {
            label: 'Submissions',
            value: campaign.totalSubmissions,
            icon: Target,
            iconClass: 'text-slate-500',
            cardClass: 'bg-white',
          },
          {
            label: 'Approved',
            value: approved,
            icon: CheckCircle,
            iconClass: 'text-emerald-500',
            cardClass: 'bg-emerald-50 border-emerald-200',
            sub: `${approvalRate}% rate`,
          },
          {
            label: 'Rejected',
            value: rejected,
            icon: XCircle,
            iconClass: 'text-red-500',
            cardClass: 'bg-red-50 border-red-200',
            sub: `${pending} pending`,
          },
          {
            label: 'Paid Out',
            value: formatCurrency(campaign.totalPaidOut),
            icon: Wallet,
            iconClass: 'text-primary',
            cardClass: 'bg-orange-50 border-orange-200',
            sub: `Avg ${formatCurrency(campaign.averageEarning)}`,
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

      {/* ── Tabs — scrollable underline strip on mobile, pill on sm+ ── */}
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
                  // Mobile: underline style
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

      {/* ── Sticky bottom action bar — mobile only ── */}
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
                  ? <><Pause className="h-4 w-4" />Pause Campaign</>
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
