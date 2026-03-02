export type FormState = {
  name: string
  businessName: string
  category: string
  city: string
  address: string
  description: string
  status: string
  deadline: string
  payoutBase: number
  payoutMin: number
  payoutMax: number
  requiredViews: number
  bonusPerThousandViews: number
  totalSpots: number
  difficulty: string
  estimatedVisitTimeMins: number
  checkInRadiusMeters: number
  autoCalculateMetrics: boolean
}

export type SetField = <K extends keyof FormState>(key: K, value: FormState[K]) => void

export const CATEGORIES = [
  { value: 'Restaurant', label: 'Restaurant' },
  { value: 'Fitness',    label: 'Fitness' },
  { value: 'Beauty',     label: 'Beauty' },
  { value: 'Fashion',    label: 'Fashion' },
  { value: 'Travel',     label: 'Travel' },
  { value: 'Education',  label: 'Education' },
  { value: 'Other',      label: 'Other' },
]

export const DIFFICULTIES = [
  { value: 'Easy',   label: 'Easy — Quick visit, low effort' },
  { value: 'Medium', label: 'Medium — Standard campaign' },
  { value: 'Hard',   label: 'Hard — Detailed content required' },
]

export const STATUSES = [
  { value: 'draft',  label: 'Draft — Not visible to creators' },
  { value: 'active', label: 'Active — Live and accepting sign-ups' },
  { value: 'paused', label: 'Paused — Temporarily hidden' },
]

export const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})
