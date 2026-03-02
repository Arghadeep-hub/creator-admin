import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  Edit,
  MapPin,
  Pause,
  Play,
  Tag,
  Target,
  TrendingUp,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/EmptyState'
import { useToast } from '@/contexts/ToastContext'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { MOCK_CAMPAIGNS } from '@/data/campaigns'
import { MOCK_SUBMISSIONS } from '@/data/submissions'

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success } = useToast()
  const [tab, setTab] = useState('overview')
  const [campaignStatus, setCampaignStatus] = useState<'draft' | 'active' | 'paused' | 'expired' | null>(null)

  const campaign = MOCK_CAMPAIGNS.find(c => c.id === id)
  const submissions = MOCK_SUBMISSIONS.filter(s => s.campaignId === id)

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

  const approved = submissions.filter(s => s.status === 'approved' || s.status === 'paid').length
  const rejected = submissions.filter(s => s.status === 'rejected').length
  const pending = submissions.filter(s => s.status === 'pending').length

  function handleStatusToggle() {
    if (effectiveStatus === 'active') {
      setCampaignStatus('paused')
      success('Campaign paused', campaign?.name ?? '')
    } else if (effectiveStatus === 'paused' || effectiveStatus === 'draft') {
      setCampaignStatus('active')
      success('Campaign activated', campaign?.name ?? '')
    }
  }

  const approvalRate =
    submissions.length > 0 ? Math.round((approved / submissions.length) * 100) : 0

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate('/campaigns')} className="mt-1 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold font-display truncate">{campaign.name}</h1>
                <StatusBadge status={effectiveStatus} />
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{campaign.businessName} · {campaign.city}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {(effectiveStatus === 'active' || effectiveStatus === 'paused' || effectiveStatus === 'draft') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStatusToggle}
                  className={effectiveStatus === 'active' ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}
                >
                  {effectiveStatus === 'active' ? (
                    <><Pause className="h-3.5 w-3.5" />Pause</>
                  ) : (
                    <><Play className="h-3.5 w-3.5" />Activate</>
                  )}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => navigate(`/campaigns/${id}/edit`)}>
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Total Submissions',
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
            label: 'Total Paid Out',
            value: formatCurrency(campaign.totalPaidOut),
            icon: Wallet,
            iconClass: 'text-primary',
            cardClass: 'bg-orange-50 border-orange-200',
            sub: `Avg ${formatCurrency(campaign.averageEarning)}`,
          },
        ].map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className={`admin-card p-4 flex items-center gap-3 ${kpi.cardClass}`}>
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

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">
            Submissions ({submissions.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader><CardTitle>Campaign Details</CardTitle></CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    {[
                      { label: 'Category', value: campaign.category },
                      { label: 'Difficulty', value: campaign.difficulty },
                      { label: 'City', value: campaign.city, icon: MapPin },
                      { label: 'Address', value: campaign.address || '—' },
                      {
                        label: 'Deadline',
                        value: new Date(campaign.deadline).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }),
                        icon: Calendar,
                      },
                      { label: 'Est. Visit Time', value: `${campaign.estimatedVisitTimeMins} mins`, icon: Clock },
                      { label: 'GPS Radius', value: `${campaign.checkInRadiusMeters}m` },
                      { label: 'Success Rate', value: `${campaign.successRate}%`, icon: TrendingUp },
                    ].map(row => (
                      <div key={row.label}>
                        <dt className="text-xs text-muted-foreground mb-0.5">{row.label}</dt>
                        <dd className="font-medium">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>

              {campaign.description && (
                <Card>
                  <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{campaign.description}</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader><CardTitle>Campaign Rules</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {campaign.rules.map((rule, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-slate-700">{rule}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Payout Structure</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: 'Base Payout', value: formatCurrency(campaign.payoutBase), className: 'font-semibold text-primary num-font' },
                    { label: 'Minimum', value: formatCurrency(campaign.payoutMin), className: 'font-medium num-font' },
                    { label: 'Maximum', value: formatCurrency(campaign.payoutMax), className: 'font-medium num-font' },
                    { label: 'Bonus / 1K Views', value: `+${formatCurrency(campaign.bonusPerThousandViews)}`, className: 'font-medium num-font text-emerald-600' },
                    { label: 'Required Views', value: formatNumber(campaign.requiredViews), className: 'font-medium num-font' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className={row.className}>{row.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-sm border-t pt-3 mt-1">
                    <span className="text-muted-foreground">Avg. Earning</span>
                    <span className="font-bold num-font text-primary">{formatCurrency(campaign.averageEarning)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Required Hashtags</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {campaign.requiredHashtags.map(tag => (
                    <Badge key={tag} variant="orange" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />{tag}
                    </Badge>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Spots</CardTitle>
                    <span className="text-sm font-semibold text-slate-700">
                      {campaign.spotsLeft} left
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {campaign.totalSpots - campaign.spotsLeft} / {campaign.totalSpots} filled
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-orange-500 to-amber-500 transition-all"
                      style={{
                        width: `${((campaign.totalSpots - campaign.spotsLeft) / campaign.totalSpots) * 100}%`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ── Submissions ── */}
        <TabsContent value="submissions">
          {submissions.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No submissions yet"
              description="Submissions will appear here once creators start participating."
            />
          ) : (
            <div className="space-y-3">
              {/* Status summary */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Approved', count: approved, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                  { label: 'Pending', count: pending, color: 'text-amber-700 bg-amber-50 border-amber-200' },
                  { label: 'Rejected', count: rejected, color: 'text-red-700 bg-red-50 border-red-200' },
                ].map(s => (
                  <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
                    <p className="text-2xl font-bold num-font">{s.count}</p>
                    <p className="text-xs font-medium mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Submission list */}
              <div className="space-y-2">
                {submissions.map(sub => (
                  <div
                    key={sub.id}
                    className="admin-card p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/submissions/${sub.id}`)}
                  >
                    <Avatar name={sub.creatorName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{sub.creatorName}</p>
                      <p className="text-xs text-muted-foreground">
                        @{sub.creatorHandle} · {new Date(sub.submittedAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold num-font text-primary">
                        {formatCurrency(sub.projectedPayout)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(sub.metricsCurrent.views)} views
                      </p>
                    </div>
                    <StatusBadge status={sub.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Analytics ── */}
        <TabsContent value="analytics">
          <div className="space-y-4">
            {/* Top metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Approval Rate', value: `${approvalRate}%`, sub: `${approved} of ${submissions.length}` },
                { label: 'Total Paid Out', value: formatCurrency(campaign.totalPaidOut), sub: 'Lifetime' },
                { label: 'Avg. Earning', value: formatCurrency(campaign.averageEarning), sub: 'Per creator' },
                { label: 'Pending Review', value: pending, sub: 'Awaiting action' },
              ].map(m => (
                <div key={m.label} className="admin-card p-4">
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-2xl font-bold num-font mt-1">{m.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
                </div>
              ))}
            </div>

            {/* Payout breakdown */}
            <Card>
              <CardHeader><CardTitle>Payout Health</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Min → Base → Max</p>
                    <p className="num-font font-semibold text-slate-800">
                      {formatCurrency(campaign.payoutMin)} → {formatCurrency(campaign.payoutBase)} → {formatCurrency(campaign.payoutMax)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Payout range per creator</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Bonus Structure</p>
                    <p className="num-font font-semibold text-emerald-700">
                      +{formatCurrency(campaign.bonusPerThousandViews)} / 1K views
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Threshold: {formatNumber(campaign.requiredViews)} views</p>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Capacity</p>
                    <p className="num-font font-semibold text-orange-700">
                      {campaign.totalSpots - campaign.spotsLeft} / {campaign.totalSpots} spots
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{campaign.spotsLeft} spots remaining</p>
                  </div>
                </div>

                {/* Success rate bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Campaign Success Rate
                    </span>
                    <span className="font-bold num-font">{campaign.successRate}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-emerald-500 to-lime-500 transition-all"
                      style={{ width: `${campaign.successRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Based on {campaign.totalSubmissions} total submissions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
