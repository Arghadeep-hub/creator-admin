import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Instagram, MapPin, Phone, Mail, Wallet, CheckCircle, XCircle,
  Shield, Star, Zap, Trophy, ChevronRight, Eye, Heart, AlertTriangle,
  Calendar, Clock, ExternalLink, Lock, TrendingUp, Video,
} from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { TrustScoreGauge } from '@/components/shared/TrustScoreGauge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/contexts/ToastContext'
import { cn, formatCurrency, formatNumber, getRelativeTime } from '@/lib/utils'
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

  const approvalRate = creator.totalSubmissions > 0
    ? Math.round((creator.approvedSubmissions / creator.totalSubmissions) * 100)
    : 0

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
          <StatusBadge status={creator.accountStatus} />
          <StatusBadge status={creator.kycStatus} />
        </div>
      </div>

      {/* Profile hero card */}
      <div className="admin-card overflow-hidden">
        <div className="h-1 bg-linear-to-r from-orange-300 via-primary to-orange-300" />
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Avatar name={creator.name} size="lg" className="shrink-0" />
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
              <TrendingUp className="h-3 w-3 text-slate-400" />{creator.instagramMetrics.avgEngagement}% eng
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 rounded-full px-2.5 py-1">
              <Video className="h-3 w-3 text-slate-400" />{creator.totalSubmissions} subs
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-1">
              <CheckCircle className="h-3 w-3" />{approvalRate}% approved
            </span>

            {/* Action button — pushed right */}
            <div className="ml-auto">
              {creator.accountStatus !== 'flagged' ? (
                <Button variant="destructive" size="sm" onClick={() => error('Creator flagged', creator.name)} className="h-7 text-xs">
                  Flag
                </Button>
              ) : (
                <Button variant="success" size="sm" onClick={() => success('Creator unflagged', creator.name)} className="h-7 text-xs">
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
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-5 px-1.5 text-[10px] num-font">{submissions.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="earnings">Earnings & Badges</TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-start">

            {/* Left column — 2 cols on desktop */}
            <div className="lg:col-span-2 space-y-4">

              {/* Contact & Social */}
              <div className="admin-card overflow-hidden">
                <div className="px-4 pt-4 pb-2">
                  <h3 className="text-sm font-semibold text-foreground">Contact & Social</h3>
                </div>
                <div className="px-4 pb-4 space-y-3 text-sm">
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
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{row.label}</p>
                          <p className="font-medium truncate">{row.value}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Instagram section */}
                <div className="border-t border-border/60 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-linear-to-br from-[#833AB4] via-[#C13584] to-[#F77737] flex items-center justify-center">
                      <Instagram className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="font-semibold text-sm">{creator.instagramHandle}</span>
                    {creator.instagramConnected
                      ? <Badge variant="success" className="text-[10px]">Connected</Badge>
                      : <Badge variant="gray" className="text-[10px]">Not Connected</Badge>
                    }
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Followers', value: formatNumber(creator.instagramFollowers) },
                      { label: 'Avg. Reach', value: formatNumber(creator.instagramMetrics.avgReach) },
                      { label: 'Engagement', value: `${creator.instagramMetrics.avgEngagement}%` },
                      { label: 'Reels Submitted', value: String(creator.instagramMetrics.totalReelsSubmitted) },
                    ].map(m => (
                      <div key={m.label}>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{m.label}</p>
                        <p className="font-bold num-font text-sm mt-0.5">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activation Progress */}
              <div className="admin-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Activation Progress</h3>
                  <Badge variant={creator.activationProgress === 100 ? 'success' : 'warning'} className="text-[10px]">
                    {creator.activationProgress === 100 ? 'Complete' : `${creator.activationProgress}%`}
                  </Badge>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <motion.div
                    className={cn(
                      'h-full rounded-full',
                      creator.activationProgress === 100
                        ? 'bg-linear-to-r from-emerald-500 to-emerald-400'
                        : 'bg-linear-to-r from-orange-500 to-amber-500'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${creator.activationProgress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(creator.activationStepsCompleted).map(([step, done]) => (
                    <div
                      key={step}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                        done ? 'bg-emerald-50/70' : 'bg-slate-50'
                      )}
                    >
                      {done
                        ? <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        : <XCircle className="h-4 w-4 text-slate-300 shrink-0" />
                      }
                      <span className={done ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                        {step.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">

              {/* Trust Score card */}
              <div className="admin-card p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Trust Score</h3>
                <div className="flex flex-col items-center gap-2">
                  <TrustScoreGauge score={creator.trustScore} size="lg" />
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    {creator.trustScore >= 80 ? 'Excellent — Highly trustworthy' :
                     creator.trustScore >= 60 ? 'Good — Reliable creator' :
                     creator.trustScore >= 40 ? 'Fair — Needs monitoring' :
                     'Poor — Requires review'}
                  </p>
                </div>
              </div>

              {/* KYC Verification */}
              <div className={cn(
                'admin-card overflow-hidden',
                creator.kycStatus === 'pending' && 'ring-1 ring-amber-200',
                creator.kycStatus === 'rejected' && 'ring-1 ring-red-200',
              )}>
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <h3 className="text-sm font-semibold text-foreground">KYC Verification</h3>
                  <StatusBadge status={creator.kycStatus} />
                </div>
                <div className="px-4 pb-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-50 rounded-lg p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">PAN</p>
                      <p className="font-mono font-medium text-xs mt-0.5">{creator.kycDocuments.panNumber}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Aadhaar</p>
                      <p className="font-mono font-medium text-xs mt-0.5">XXXX-{creator.kycDocuments.aadhaarLast4}</p>
                    </div>
                  </div>
                  {creator.kycStatus === 'pending' && (
                    <div className="flex gap-2">
                      <Button className="flex-1 h-9" onClick={() => success('KYC verified', creator.name)}>
                        <CheckCircle className="h-3.5 w-3.5" />
                        Verify
                      </Button>
                      <Button variant="destructive" className="flex-1 h-9" onClick={() => error('KYC rejected', creator.name)}>
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Info */}
              <div className="admin-card p-4 space-y-3 text-sm">
                <h3 className="text-sm font-semibold text-foreground">Account</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Joined', value: new Date(creator.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), icon: Calendar },
                    { label: 'Last Active', value: getRelativeTime(creator.lastActiveAt), icon: Clock },
                    ...(creator.assignedAdmin ? [{ label: 'Assigned Admin', value: creator.assignedAdmin, icon: Shield }] : []),
                  ].map(row => {
                    const Icon = row.icon
                    return (
                      <div key={row.label} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Icon className="h-3.5 w-3.5" />{row.label}
                        </span>
                        <span className="font-medium">{row.value}</span>
                      </div>
                    )
                  })}
                </div>
                {creator.flagReason && (
                  <div className="bg-red-50 rounded-lg p-3 border border-red-100 mt-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                      <p className="text-xs font-semibold text-red-700">Flag Reason</p>
                    </div>
                    <p className="text-xs text-red-600">{creator.flagReason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions">
          {submissions.length === 0 ? (
            <EmptyState
              icon={Video}
              title="No submissions yet"
              description="This creator hasn't submitted any content yet."
            />
          ) : (
            <div className="space-y-2.5">
              {submissions.map(sub => (
                <motion.div
                  key={sub.id}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.1 }}
                >
                  <div
                    onClick={() => navigate(`/submissions/${sub.id}`)}
                    className={cn(
                      'admin-card cursor-pointer transition-all',
                      'hover:shadow-md hover:border-border',
                      sub.fraudFlags.length > 0 && 'border-red-200 bg-red-50/30'
                    )}
                  >
                    <div className="p-4">
                      {/* Campaign name + status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-semibold text-sm leading-tight">{sub.campaignName}</p>
                            {sub.fraudFlags.length > 0 && (
                              <Badge variant="error" className="text-[10px] px-1.5 py-0">
                                <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                                {sub.fraudFlags.length}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Submitted {getRelativeTime(sub.submittedAt)}
                          </p>
                        </div>
                        <StatusBadge status={sub.status} className="shrink-0" />
                      </div>

                      {/* Metric chips */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                          <Eye className="h-3 w-3 text-slate-400" />
                          {formatNumber(sub.metricsCurrent.views)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                          <Heart className="h-3 w-3 text-slate-400" />
                          {formatNumber(sub.metricsCurrent.likes)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium">
                          <Trophy className="h-3 w-3 text-slate-400" />
                          #{sub.ranking}/{sub.totalRankEntries}
                        </span>
                        <span className="inline-flex items-center text-[11px] text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 font-medium uppercase tracking-wide">
                          {sub.verificationStage}
                        </span>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 bg-slate-50/50 rounded-b-xl">
                      <p className="text-base font-bold text-primary num-font">{formatCurrency(sub.projectedPayout)}</p>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <a
                          href={sub.reelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />Reel
                        </a>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
                    <p className="text-2xl font-bold num-font text-foreground">{creator.totalSubmissions}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold num-font text-emerald-600">{creator.approvedSubmissions}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">Approved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold num-font text-red-600">{creator.rejectedSubmissions}</p>
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
                {creator.milestoneBadges.map(badge => {
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
