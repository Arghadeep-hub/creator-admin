import { lazy, Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, AlertTriangle, Eye, Heart, MessageCircle,
  ChevronRight, ExternalLink, Play,
} from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { PageLoader } from '@/components/ui/PageLoader'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useGetSubmissionQuery } from '@/store/api/submissionsApi'
import { useGetCreatorQuery } from '@/store/api/creatorsApi'
import type { SubmissionAdmin } from '@/types'

// ── Lazy-loaded sections (each = separate JS chunk) ───────────────────────────
const VerificationTimeline = lazy(() => import('./_sections/VerificationTimeline'))
const TrustSignals         = lazy(() => import('./_sections/TrustSignals'))
const CaptionHashtags      = lazy(() => import('./_sections/CaptionHashtags'))
const GpsVerification      = lazy(() => import('./_sections/GpsVerification'))
const AdminNotes           = lazy(() => import('./_sections/AdminNotes'))
const RightColumn          = lazy(() => import('./_sections/RightColumn'))

function SectionSkeleton() {
  return (
    <div className="admin-card p-4 animate-pulse">
      <div className="h-4 w-32 bg-slate-200 rounded mb-3" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-4/6" />
      </div>
    </div>
  )
}

function CreatorLoader({ creatorId, sub }: { creatorId: string; sub: SubmissionAdmin }) {
  const { data: creator = null } = useGetCreatorQuery(creatorId, { skip: !creatorId })
  return <RightColumn sub={sub} creator={creator} />
}

export function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: sub, isLoading, isError } = useGetSubmissionQuery(id ?? '', { skip: !id })

  if (isLoading) return <PageLoader />
  if (isError || !sub) {
    return (
      <EmptyState
        title="Submission not found"
        actionLabel="Back to Submissions"
        onAction={() => navigate('/submissions')}
      />
    )
  }

  return (
    <div className="space-y-4">

      {/* ── Breadcrumb nav ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Back button — always visible */}
        <button
          onClick={() => navigate('/submissions')}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground active:scale-95 transition-all shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Submissions</span>
        </button>

        {/* Separator + ID — desktop only */}
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 hidden sm:block" />
        <span className="text-sm font-semibold text-foreground truncate min-w-0 hidden sm:block">
          {sub.id.toUpperCase()}
        </span>

        {/* Badges — pushed to the right, always visible */}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <StatusBadge status={sub.status} />
          {sub.fraudFlags.length > 0 && (
            <Badge variant="error" className="gap-1">
              <AlertTriangle className="h-3 w-3" />{sub.fraudFlags.length}
            </Badge>
          )}
        </div>
      </div>

      {/* ── Creator hero card (eagerly rendered) ────────────────────────── */}
      <div className="admin-card overflow-hidden">
        <div className="h-1 bg-linear-to-r from-orange-300 via-primary to-orange-300" />
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Avatar name={sub.creator?.name ?? 'Unknown'} size="lg" className="shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base leading-tight">{sub.creator?.name}</p>
              <p className="text-sm text-muted-foreground">{sub.creator?.instagramHandle}</p>
              <p className="text-xs text-muted-foreground mt-1 truncate">{sub.campaign?.restaurantName}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-primary num-font">{formatCurrency(sub.projectedPayout)}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">projected</p>
            </div>
          </div>

          {/* Metric chips */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/60 flex-wrap">
            {(() => {
              const latest = sub.submissionMetrics?.[sub.submissionMetrics.length - 1]
              return [
                { icon: Eye,           val: formatNumber(latest?.views ?? 0),    label: 'views' },
                { icon: Heart,         val: formatNumber(latest?.likes ?? 0),    label: 'likes' },
                { icon: MessageCircle, val: formatNumber(latest?.comments ?? 0), label: 'comments' },
              ] as const
            })().map(({ icon: Icon, val, label }) => (
              <span key={label} className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 rounded-full px-2.5 py-1">
                <Icon className="h-3 w-3 text-slate-400" />{val}
              </span>
            ))}
            <a
              href={sub.reelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />Instagram
            </a>
          </div>
        </div>
      </div>

      {/* ── Two-column grid ──────────────────────────────────────────────── */}
      {/* On mobile: right col (order-1) = Decision Panel first, then left col (order-2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-start">

        {/* Right column — appears first on mobile so Decision Panel is immediately actionable */}
        <div className="order-1 lg:order-2">
          <Suspense fallback={<div className="space-y-3"><SectionSkeleton /><SectionSkeleton /></div>}>
            <CreatorLoader creatorId={sub.creatorId} sub={sub} />
          </Suspense>
        </div>

        {/* Left column — detail sections */}
        <div className="order-2 lg:order-1 lg:col-span-2 space-y-3">

          {/* Reel Preview — Instagram-style gradient placeholder */}
          <div className="admin-card overflow-hidden">
            <div className="relative bg-linear-to-br from-[#405DE6] via-[#C13584] to-[#F77737]">
              <div className="aspect-video flex items-center justify-center">
                <div className="absolute inset-0 bg-black/25" />
                {/* Top bar */}
                <div className="absolute top-3 left-3 right-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 shrink-0" />
                  <span className="text-xs text-white font-semibold truncate">{sub.creator?.instagramHandle}</span>
                  <span className="ml-auto text-[10px] text-white/70 uppercase tracking-widest font-medium shrink-0">Reel</span>
                </div>
                {/* Play CTA */}
                <a
                  href={sub.reelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex flex-col items-center gap-3 group"
                >
                  <div className="h-14 w-14 rounded-full bg-white/20 group-hover:bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/30 transition-all group-hover:scale-105 active:scale-95">
                    <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-white font-medium bg-white/20 group-hover:bg-white/30 backdrop-blur-sm rounded-full px-4 py-1.5 transition-colors">
                    <ExternalLink className="h-3 w-3" />View on Instagram
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Lazy sections */}
          <Suspense fallback={<SectionSkeleton />}>
            <VerificationTimeline sub={sub} />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <TrustSignals sub={sub} />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <CaptionHashtags sub={sub} />
          </Suspense>

          {(sub.gpsLatitude !== null && sub.gpsLatitude !== undefined) && (
            <Suspense fallback={<SectionSkeleton />}>
              <GpsVerification sub={sub} />
            </Suspense>
          )}

          <Suspense fallback={<SectionSkeleton />}>
            <AdminNotes sub={sub} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
