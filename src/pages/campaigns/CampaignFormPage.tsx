import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { useToast } from '@/contexts/ToastContext'
import { MOCK_CAMPAIGNS } from '@/data/campaigns'
import { ImageUploadCard }     from './_sections/ImageUploadCard'
import { BasicInfoCard }       from './_sections/BasicInfoCard'
import { PublishingCard }      from './_sections/PublishingCard'
import { PayoutStructureCard } from './_sections/PayoutStructureCard'
import { HashtagsCard }        from './_sections/HashtagsCard'
import { RulesCard }           from './_sections/RulesCard'
import { LogisticsCard }       from './_sections/LogisticsCard'
import { PayoutPreviewCard }   from './_sections/PayoutPreviewCard'
import type { FormState } from './_sections/types'

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
  const [hashtags, setHashtags] = useState<string[]>(existing?.requiredHashtags ?? ['#TryTheMenu'])
  const [rules,    setRules]    = useState<string[]>(existing?.rules ?? ['Visit and make a purchase'])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(f => ({ ...f, [key]: value }))

  function handleSave() {
    success(isEdit ? 'Campaign updated' : 'Campaign created', form.name)
    navigate('/campaigns')
  }

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
      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={isEdit ? `Edit: ${existing?.name}` : 'New Campaign'}
          subtitle={isEdit ? 'Update the campaign details below' : 'Fill in the details to launch a new campaign'}
          className="mb-0 flex-1 min-w-0"
        >
          {actions}
        </PageHeader>
      </div>

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
          <PublishingCard form={form} set={set} />
          <PayoutStructureCard form={form} set={set} />
          <HashtagsCard hashtags={hashtags} setHashtags={setHashtags} />
          <RulesCard rules={rules} setRules={setRules} />
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-4 sm:space-y-5">
          <LogisticsCard form={form} set={set} />
          <PayoutPreviewCard form={form} />
        </div>
      </div>

      {/* Desktop bottom bar */}
      <div className="hidden sm:flex justify-end gap-3 border-t border-slate-200 pt-5">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4" />
          {isEdit ? 'Save Changes' : 'Create Campaign'}
        </Button>
      </div>

      {/* Mobile sticky bottom bar — uses floating-mobile-cta for safe-area + nav offset */}
      <div className="floating-mobile-cta flex gap-3 border-t border-slate-200 bg-white/90 backdrop-blur-lg px-4 py-3 sm:hidden">
        <Button variant="outline" className="flex-1 h-11 text-sm" onClick={() => navigate(-1)}>Cancel</Button>
        <Button className="flex-1 h-11 text-sm" onClick={handleSave}>
          <Save className="h-4 w-4" />
          {isEdit ? 'Save' : 'Create'}
        </Button>
      </div>
    </div>
  )
}
