import { lazy, Suspense, useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Check, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/contexts/ToastContext'
import {
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
} from '@/store/api/campaignsApi'
import { useGetPoolBalanceQuery } from '@/store/api/payoutsApi'
import type { CreateCampaignRequest } from '@/store/api/campaignsApi'
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

const DEFAULT_FORM: FormState = {
  name:                   '',
  restaurantName:         '',
  cuisine:                'Restaurant',
  city:                   '',
  address:                '',
  description:            '',
  isActive:               true,
  deadline:               '',
  payoutBase:             1000,
  payoutMin:              500,
  payoutMax:              3000,
  requiredViews:          5000,
  bonusPerThousandViews:  100,
  totalSpots:             50,
  difficulty:             'Medium',
  estimatedVisitTimeMins: 60,
  checkInRadiusMeters:    200,
  latitude:               0,
  longitude:              0,
}

const DEFAULT_HASHTAGS = ['#Ad', '#Collab', '#TryTheMenu']
const DEFAULT_RULES = [
  'Visit the store and make a purchase',
  'Post a reel within 48 hours of your visit',
  'Tag the business and use all required hashtags',
  'Keep the post live for at least 30 days',
]

export function CampaignFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success, error } = useToast()
  const isEdit = !!id

  // Fetch existing campaign when editing
  const { data: existing, isLoading: isLoadingCampaign } = useGetCampaignQuery(id ?? '', {
    skip: !isEdit,
  })

  const { data: poolSummary } = useGetPoolBalanceQuery()
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation()
  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation()
  const isSaving = isCreating || isUpdating

  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [businessLogo, setBusinessLogo] = useState('')
  const [hashtags, setHashtags] = useState<string[]>(DEFAULT_HASHTAGS)
  const [rules, setRules] = useState<string[]>(DEFAULT_RULES)
  const [isDirty, setIsDirty] = useState(false)
  const initialFormRef = useRef<string>('')

  // Populate form when existing campaign data loads
  useEffect(() => {
    if (existing) {
      setForm({
        name:                   existing.restaurantName,
        restaurantName:         existing.restaurantName,
        cuisine:                existing.cuisine ?? 'Restaurant',
        city:                   existing.city,
        address:                existing.address,
        description:            existing.description ?? '',
        isActive:               existing.isActive,
        deadline:               existing.deadline ? existing.deadline.slice(0, 10) : '',
        payoutBase:             existing.payoutBase,
        payoutMin:              existing.payoutMin,
        payoutMax:              existing.payoutMax,
        requiredViews:          existing.requiredViews,
        bonusPerThousandViews:  existing.bonusPerThousandViews,
        totalSpots:             existing.totalSpots,
        difficulty:             existing.difficulty,
        estimatedVisitTimeMins: existing.estimatedVisitTimeMins,
        checkInRadiusMeters:    existing.checkInRadiusMeters,
        latitude:               existing.latitude ?? 0,
        longitude:              existing.longitude ?? 0,
      })
      setBusinessLogo(existing.restaurantLogo ?? '')
      setHashtags(existing.requiredHashtags ?? DEFAULT_HASHTAGS)
      setRules(existing.rules ?? DEFAULT_RULES)
      setIsDirty(false)
    }
  }, [existing])

  // Track initial form state for dirty detection
  useEffect(() => {
    if (!initialFormRef.current) {
      initialFormRef.current = JSON.stringify(form)
    }
  }, [form])

  const set = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm(f => ({ ...f, [key]: value }))
      setIsDirty(true)
    },
    [],
  )

  const handleSave = useCallback(async () => {
    // Validate required fields
    const missing: string[] = []
    if (!form.name.trim() && !form.restaurantName.trim()) missing.push('Campaign Name')
    if (!form.restaurantName.trim()) missing.push('Restaurant / Business Name')
    if (!form.city.trim()) missing.push('City')
    if (missing.length > 0) {
      error(`Required fields missing: ${missing.join(', ')}`)
      return
    }

    const payload: CreateCampaignRequest = {
      businessName:           form.restaurantName,
      businessLogo:           businessLogo || undefined,
      category:               form.cuisine,
      name:                   form.name || form.restaurantName,
      city:                   form.city,
      address:                form.address,
      latitude:               form.latitude,
      longitude:              form.longitude,
      description:            form.description || undefined,
      payoutBase:             form.payoutBase,
      payoutMin:              form.payoutMin,
      payoutMax:              form.payoutMax,
      requiredViews:          form.requiredViews,
      bonusPerThousandViews:  form.bonusPerThousandViews,
      requiredHashtags:       hashtags,
      rules:                  rules,
      difficulty:             form.difficulty as CreateCampaignRequest['difficulty'],
      totalSpots:             form.totalSpots,
      deadline:               form.deadline,
      estimatedVisitTimeMins: form.estimatedVisitTimeMins,
      checkInRadiusMeters:    form.checkInRadiusMeters,
      isActive:               form.isActive,
    }

    try {
      if (isEdit && id) {
        await updateCampaign({ id, body: payload }).unwrap()
        success('Campaign updated', form.restaurantName)
      } else {
        await createCampaign(payload).unwrap()
        success('Campaign created', form.restaurantName)
      }
      navigate('/campaigns')
    } catch {
      error(
        isEdit ? 'Failed to update campaign' : 'Failed to create campaign',
        form.restaurantName,
      )
    }
  }, [isEdit, id, form, businessLogo, hashtags, rules, createCampaign, updateCampaign, success, error, navigate])

  if (isEdit && isLoadingCampaign) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="space-y-4 sm:space-y-5">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    )
  }

  const actions = (
    <div className="hidden sm:flex items-center gap-3">
      <Button variant="outline" onClick={() => navigate(-1)} disabled={isSaving}>Cancel</Button>
      <Button onClick={handleSave} disabled={isSaving}>
        <Save className="h-4 w-4" />
        {isSaving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Campaign'}
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
            {isEdit ? `Edit: ${existing?.restaurantName ?? ''}` : 'New Campaign'}
          </h1>
          <div className="hidden sm:flex items-center gap-2 mt-0.5">
            <p className="text-sm text-slate-500">
              {isEdit ? 'Update the campaign details below' : 'Fill in the details to launch a new campaign'}
            </p>
            {isDirty && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                <Circle className="h-1.5 w-1.5 fill-amber-500 text-amber-500" />
                Unsaved changes
              </span>
            )}
          </div>
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
              businessName={form.restaurantName}
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
              <PayoutPreviewCard form={form} poolBalance={poolSummary?.balance} />
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
            <PayoutPreviewCard form={form} poolBalance={poolSummary?.balance} />
          </div>
        </div>
      </Suspense>

      {/* Desktop bottom bar */}
      <div className="hidden sm:flex justify-end gap-3 border-t border-slate-200 pt-5">
        <Button variant="outline" onClick={() => navigate(-1)} disabled={isSaving}>Cancel</Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Campaign'}
        </Button>
      </div>

      {/* Mobile sticky bottom bar — uses floating-mobile-cta for safe-area + nav offset */}
      <div className="floating-mobile-cta flex gap-3 rounded-t-2xl border-t border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-5 py-3.5 sm:hidden">
        <Button variant="outline" className="flex-1 h-12 text-sm font-medium rounded-xl" onClick={() => navigate(-1)} disabled={isSaving}>Cancel</Button>
        <Button className="flex-1 h-12 text-sm font-medium rounded-xl shadow-md" onClick={handleSave} disabled={isSaving}>
          <Check className="h-4 w-4" />
          {isSaving ? 'Saving…' : isEdit ? 'Save' : 'Create'}
        </Button>
      </div>
    </div>
  )
}
