import type { PayoutTransaction } from '@/types'

export type PayoutTab = 'queue' | 'transactions' | 'ledger'

export const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'locked', label: 'Locked' },
  { value: 'processing', label: 'Processing' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
]

export const STATUS_ACCENT: Record<string, string> = {
  failed: 'from-red-400 to-rose-500',
  processing: 'from-blue-400 to-indigo-500',
  locked: 'from-amber-400 to-orange-500',
}

export const PAYOUT_TONES = {
  paid: { bg: 'bg-emerald-50', icon: 'text-emerald-600', gradient: 'from-emerald-500 to-emerald-600', border: 'border-emerald-200' },
  processing: { bg: 'bg-blue-50', icon: 'text-blue-600', gradient: 'from-blue-500 to-blue-600', border: 'border-blue-200' },
  locked: { bg: 'bg-amber-50', icon: 'text-amber-600', gradient: 'from-amber-500 to-amber-600', border: 'border-amber-200' },
  failed: { bg: 'bg-red-50', icon: 'text-red-600', gradient: 'from-red-500 to-red-600', border: 'border-red-200' },
} as const

export interface PayoutStats {
  lockedCount: number; lockedAmount: number
  processingCount: number; processingAmount: number
  paidCount: number; paidAmount: number
  failedCount: number; failedAmount: number
}

export interface QueueItems {
  failed: PayoutTransaction[]
  processing: PayoutTransaction[]
  locked: PayoutTransaction[]
}
