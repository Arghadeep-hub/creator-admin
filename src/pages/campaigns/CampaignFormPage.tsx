import { lazy, Suspense, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/contexts/ToastContext'
import { MOCK_CAMPAIGNS } from '@/data/campaigns'
import type { FormState } from './_sections/types'

const ImageUploadCard     = lazy(() => import('./_sections/ImageUploadCard').then(m => ({ default: m.ImageUploadCard })))
const BasicInfoCard       = lazy(() => import('./_sections/BasicInfoCard').then(m => ({ default: m.BasicInfoCard })))
const PublishingCard      = lazy(() => import('./_sections/PublishingCard').then(m => ({ default: m.PublishingCard })))
const PayoutStructureCard = lazy(() => import('./_sections/PayoutStructureCard').then(m => ({ default: m.PayoutStructureCard })))
const HashtagsCard        = lazy(() => import('./_sections/HashtagsCard').then(m => ({ default: m.HashtagsCard })))
const RulesCard           = lazy(() => import('./_sections/RulesCard').then(m => ({ default: m.RulesCard })))
const LogisticsCard       = lazy(() => import('./_sections/LogisticsCard').then(m => ({ default: m.LogisticsCard })))
const PayoutPreviewCard   = lazy(() => import('./_sections/PayoutPreviewCard').then(m => ({ default: m.PayoutPreviewCard })))

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 animate-pulse">
      <div className="h-5 w-1/3 rounded bg-slate-200 mb-4" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-2/3 rounded bg-slate-100" />
      </div>
    </div>
  )
}

export function CampaignFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success } = useToast()
  const isEdit = !!id

  const existing = isEdit ? MOCK_CAMPAIGNS.find(c => c.id === id) : null

  const [form, setForm] = useState<FormState>({
    name:                    existing?.name ?? '',
    businessName:            existing?.businessName ?? '',
    category:                existing?.category ?? 'Restaurant',
    city:                    existing?.city ?? '',
    address:                 existing?.address ?? '',
    description:             existing?.description ?? '',
    status:                  existing?.status ?? 'draft',
    deadline:                existing?.deadline ? existing.deadline.slice(0, 10) : '',
    payoutBase:              existing?.payoutBase ?? 1000,
    payoutMin:               existing?.payoutMin ?? 500,
    payoutMax:               existing?.payoutMax ?? 3000,
    requiredViews:           existing?.requiredViews ?? 5000,
    bonusPerThousandViews:   existing?.bonusPerThousandViews ?? 100,
    totalSpots:              existing?.totalSpots ?? 50,
    difficulty:              existing?.difficulty ?? 'Medium',
    estimatedVisitTimeMins:  existing?.estimatedVisitTimeMins ?? 60,
    checkInRadiusMeters:     existing?.checkInRadiusMeters ?? 200,
    autoCalculateMetrics:    existing?.autoCalculateMetrics ?? true,
  })
  const [businessLogo, setBusinessLogo] = useState(existing?.businessLogo ?? '')
  const [hashtags, setHashtags] = useState<string[]>(existing?.requiredHashtags ?? [
    '#Ad', '#Collab', '#TryTheMenu',
  ])
  const [rules, setRules] = useState<string[]>(existing?.rules ?? [
    'Visit the store and make a purchase',
    'Post a reel within 48 hours of your visit',
    'Tag the business and use all required hashtags',
    'Keep the post live for at least 30 days',
  ])

  const set = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) =>
      setForm(f => ({ ...f, [key]: value })),
    [],
  )

  const handleSave = useCallback(() => {
    success(isEdit ? 'Campaign updated' : 'Campaign created', form.name)
    navigate('/campaigns')
  }, [isEdit, form.name, success, navigate])

  const actions = (
    <div className="hidden sm:flex items-center gap-3">
      <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
      <Button onClick={handleSave}>
        <Save className="h-4 w-4" />
        {isEdit ? 'Save Changes' : 'Create Campaign'}
      </Button>
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-5 w-full pb-32 sm:pb-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-xl sm:rounded-lg bg-slate-100 sm:bg-transparent sm:hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 sm:h-4 sm:w-4 text-slate-600" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-slate-900 font-display truncate">
            {isEdit ? `Edit: ${existing?.name}` : 'New Campaign'}
          </h1>
          <p className="hidden sm:block text-sm text-slate-500 mt-0.5">
            {isEdit ? 'Update the campaign details below' : 'Fill in the details to launch a new campaign'}
          </p>
        </div>
        {actions}
      </div>

      <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5"><div className="lg:col-span-2 space-y-4 sm:space-y-5"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div><div className="space-y-4 sm:space-y-5"><CardSkeleton /><CardSkeleton /></div></div>}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            <ImageUploadCard
              businessLogo={businessLogo}
              setBusinessLogo={setBusinessLogo}
              name={form.name}
              businessName={form.businessName}
              city={form.city}
            />
            <BasicInfoCard form={form} set={set} />

            {/* Mobile section divider */}
            <div className="flex items-center gap-3 pt-1 lg:hidden" aria-hidden>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Publishing & Pricing</span>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 to-transparent" />
            </div>

            <PublishingCard form={form} set={set} />
            <PayoutStructureCard form={form} set={set} />

            {/* Mobile: show payout preview inline after payout structure */}
            <div className="lg:hidden">
              <PayoutPreviewCard form={form} />
            </div>

            {/* Mobile section divider */}
            <div className="flex items-center gap-3 pt-1 lg:hidden" aria-hidden>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Requirements</span>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 to-transparent" />
            </div>

            <HashtagsCard hashtags={hashtags} setHashtags={setHashtags} />
            <RulesCard rules={rules} setRules={setRules} />

            {/* Mobile: show logistics inline after rules */}
            <div className="lg:hidden">
              <LogisticsCard form={form} set={set} />
            </div>
          </div>

          {/* ── Right sidebar (desktop only) ── */}
          <div className="hidden lg:block space-y-5">
            <LogisticsCard form={form} set={set} />
            <PayoutPreviewCard form={form} />
          </div>
        </div>
      </Suspense>

      {/* Desktop bottom bar */}
      <div className="hidden sm:flex justify-end gap-3 border-t border-slate-200 pt-5">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4" />
          {isEdit ? 'Save Changes' : 'Create Campaign'}
        </Button>
      </div>

      {/* Mobile sticky bottom bar — uses floating-mobile-cta for safe-area + nav offset */}
      <div className="floating-mobile-cta flex gap-3 rounded-t-2xl border-t border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-5 py-3.5 sm:hidden">
        <Button variant="outline" className="flex-1 h-12 text-sm font-medium rounded-xl" onClick={() => navigate(-1)}>Cancel</Button>
        <Button className="flex-1 h-12 text-sm font-medium rounded-xl shadow-md" onClick={handleSave}>
          <Check className="h-4 w-4" />
          {isEdit ? 'Save' : 'Create'}
        </Button>
      </div>
    </div>
  )
}
