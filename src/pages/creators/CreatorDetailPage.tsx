import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Instagram, MapPin, Phone, Mail, Wallet, CheckCircle, XCircle, Shield, Star, Zap, Trophy } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { TrustScoreGauge } from '@/components/shared/TrustScoreGauge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/contexts/ToastContext'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { MOCK_CREATORS } from '@/data/creators'
import { MOCK_SUBMISSIONS } from '@/data/submissions'

const BADGE_ICONS: Record<string, typeof Star> = {
  'badge-001': Star,
  'badge-002': Zap,
  'badge-003': Shield,
  'badge-004': Trophy,
}

export function CreatorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [tab, setTab] = useState('overview')

  const creator = MOCK_CREATORS.find(c => c.id === id)
  const submissions = MOCK_SUBMISSIONS.filter(s => s.creatorId === id)

  if (!creator) {
    return <EmptyState title="Creator not found" actionLabel="Back to Creators" onAction={() => navigate('/creators')} />
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate('/creators')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader title={creator.name} subtitle={creator.instagramHandle} className="mb-0 flex-1">
          <StatusBadge status={creator.accountStatus} />
          {creator.accountStatus !== 'flagged' ? (
            <Button variant="destructive" size="sm" onClick={() => error('Creator flagged', creator.name)}>Flag Creator</Button>
          ) : (
            <Button variant="success" size="sm" onClick={() => success('Creator unflagged', creator.name)}>Unflag</Button>
          )}
        </PageHeader>
      </div>

      {/* Summary Strip — key metrics at a glance, no duplication */}
      <div className="admin-card p-5 flex flex-col sm:flex-row gap-5 items-start">
        <Avatar name={creator.name} size="xl" />
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Wallet Balance</p>
            <p className="text-xl font-bold num-font text-primary">{formatCurrency(creator.walletBalance)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">+{formatCurrency(creator.lockedEarnings)} locked</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Lifetime Earnings</p>
            <p className="text-xl font-bold num-font">{formatCurrency(creator.lifetimeEarnings)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{formatCurrency(creator.weeklyEarnings)} this week</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Submissions</p>
            <p className="text-xl font-bold num-font">{creator.totalSubmissions}</p>
            <p className="text-xs text-emerald-600">{creator.approvedSubmissions} approved · {creator.rejectedSubmissions} rejected</p>
          </div>
          <div className="flex flex-col items-center">
            <TrustScoreGauge score={creator.trustScore} size="md" />
          </div>
        </div>
      </div>

      {/* Consolidated Tabs: Overview, Submissions, Earnings & Badges */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
          <TabsTrigger value="earnings">Earnings & Badges</TabsTrigger>
        </TabsList>

        {/* ── Overview: Contact + KYC + Instagram + Activation + Account ── */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Contact + Instagram — merged into one card */}
            <Card>
              <CardHeader><CardTitle>Contact & Social</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  { icon: Mail, label: 'Email', value: creator.email },
                  { icon: Phone, label: 'Phone', value: creator.phone },
                  { icon: MapPin, label: 'City', value: creator.city },
                  { icon: Wallet, label: 'UPI ID', value: creator.upiId },
                ].map(row => {
                  const Icon = row.icon
                  return (
                    <div key={row.label} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{row.label}</p>
                        <p className="font-medium">{row.value}</p>
                      </div>
                    </div>
                  )
                })}

                {/* Instagram inline */}
                <div className="border-t border-slate-100 pt-3 mt-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Instagram className="h-4 w-4 text-pink-500" />
                    <span className="font-semibold text-sm">Instagram</span>
                    {creator.instagramConnected
                      ? <Badge variant="success">Connected</Badge>
                      : <Badge variant="gray">Not Connected</Badge>
                    }
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Handle</p>
                      <p className="font-medium">{creator.instagramHandle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Followers</p>
                      <p className="font-medium num-font">{formatNumber(creator.instagramFollowers)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg. Reach</p>
                      <p className="font-medium num-font">{formatNumber(creator.instagramMetrics.avgReach)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg. Engagement</p>
                      <p className="font-medium">{creator.instagramMetrics.avgEngagement}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KYC + Account Status — merged into one card */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    KYC Verification
                    <StatusBadge status={creator.kycStatus} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">PAN Number</p>
                      <p className="font-mono font-medium mt-0.5">{creator.kycDocuments.panNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Aadhaar (last 4)</p>
                      <p className="font-mono font-medium mt-0.5">XXXX-XXXX-{creator.kycDocuments.aadhaarLast4}</p>
                    </div>
                  </div>
                  {creator.kycStatus === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1" onClick={() => success('KYC verified', creator.name)}>Verify KYC</Button>
                      <Button variant="destructive" className="flex-1" onClick={() => error('KYC rejected', creator.name)}>Reject</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Account Status</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Joined</span>
                    <span className="font-medium">{new Date(creator.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Active</span>
                    <span className="font-medium">{new Date(creator.lastActiveAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  {creator.flagReason && (
                    <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                      <p className="text-xs font-semibold text-red-700">Flag Reason</p>
                      <p className="text-xs text-red-600 mt-0.5">{creator.flagReason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Activation Progress — full width */}
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Activation Progress</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">{creator.activationProgress}% complete</span>
                  <Badge variant={creator.activationProgress === 100 ? 'success' : 'warning'}>
                    {creator.activationProgress === 100 ? 'Fully Activated' : 'Incomplete'}
                  </Badge>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${creator.activationProgress}%` }} />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {Object.entries(creator.activationStepsCompleted).map(([step, done]) => (
                    <div key={step} className="flex items-center gap-2 text-sm">
                      {done
                        ? <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        : <XCircle className="h-4 w-4 text-slate-300 shrink-0" />
                      }
                      <span className={done ? 'text-foreground' : 'text-muted-foreground'}>
                        {step.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Submissions ── */}
        <TabsContent value="submissions">
          {submissions.length === 0 ? (
            <EmptyState title="No submissions yet" />
          ) : (
            <div className="space-y-2">
              {submissions.map(sub => (
                <div
                  key={sub.id}
                  className="admin-card p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/submissions/${sub.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{sub.campaignName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(sub.submittedAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold num-font text-primary">{formatCurrency(sub.projectedPayout)}</p>
                    <p className="text-xs text-muted-foreground">{formatNumber(sub.metricsCurrent.views)} views</p>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Earnings & Badges (merged) ── */}
        <TabsContent value="earnings">
          <div className="space-y-6">
            {/* Earnings breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Wallet Balance', value: formatCurrency(creator.walletBalance), color: 'text-primary' },
                { label: 'Locked (72h)', value: formatCurrency(creator.lockedEarnings), color: 'text-amber-600' },
                { label: 'Weekly Earnings', value: formatCurrency(creator.weeklyEarnings), color: 'text-blue-600' },
                { label: 'Lifetime Earnings', value: formatCurrency(creator.lifetimeEarnings), color: 'text-slate-700' },
              ].map(e => (
                <div key={e.label} className="admin-card p-4">
                  <p className="text-xs text-muted-foreground">{e.label}</p>
                  <p className={`text-xl font-bold num-font mt-1 ${e.color}`}>{e.value}</p>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Milestone Badges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {creator.milestoneBadges.map(badge => {
                  const Icon = BADGE_ICONS[badge.id] ?? Star
                  return (
                    <div key={badge.id} className={`admin-card p-4 flex items-center gap-4 ${!badge.isUnlocked ? 'opacity-50 grayscale' : ''}`}>
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${badge.isUnlocked ? 'bg-amber-50' : 'bg-slate-100'}`}>
                        <Icon className={`h-5 w-5 ${badge.isUnlocked ? 'text-amber-500' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{badge.name}</p>
                        {badge.isUnlocked && badge.earnedAt && (
                          <p className="text-xs text-emerald-600">
                            Earned {new Date(badge.earnedAt).toLocaleDateString('en-IN')}
                          </p>
                        )}
                        {!badge.isUnlocked && (
                          <p className="text-xs text-muted-foreground">Not yet unlocked</p>
                        )}
                      </div>
                    </div>
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
