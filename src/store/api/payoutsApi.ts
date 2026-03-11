import { baseApi } from './baseApi'
import type { PayoutTransaction, PoolTransaction, PoolSummary } from '../../types'
import type { PaginatedResponse } from './adminUsersApi'

// Queue item shape returned by backend (simpler than full PayoutTransaction)
interface QueueItem {
  id: string
  creatorId?: string
  creatorName: string
  upiId: string
  amount: number
  unlockAt?: string | null
  createdAt?: string
}
interface QueueStats {
  totalLocked: number; lockedAmount: number
  totalProcessing: number; processingAmount: number
  totalFailed: number; failedAmount: number
}
interface QueueRaw {
  locked: QueueItem[]
  processing: QueueItem[]
  failed: QueueItem[]
  stats: QueueStats
}

// ─── Request / Response Types ──────────────────────────────────────────────

export interface GetPoolTransactionsParams {
  page?: number
  limit?: number
  type?: 'deposit' | 'payout'
  dateFrom?: string
  dateTo?: string
}

export interface DepositToPoolRequest {
  amount: number
  description: string
}

export interface DepositResponse {
  transaction: PoolTransaction
  newBalance: number
}

export interface CreateDepositOrderRequest {
  amount: number
  description: string
}

export interface CreateDepositOrderResponse {
  orderId: string
  amount: number
  amountInPaise: number
  currency: string
  keyId: string
  prefill: {
    name: string
    email: string
  }
}

export interface VerifyDepositPaymentRequest {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}

export interface VerifyDepositPaymentResponse {
  message: string
  balance: number
  deposited: number
  paymentId: string
}

export interface GetPayoutTransactionsParams {
  page?: number
  limit?: number
  status?: 'locked' | 'processing' | 'paid' | 'failed'
  creatorId?: string
  campaignId?: string
  dateFrom?: string
  dateTo?: string
}

export interface GetPayoutQueueParams {
  page?: number
  limit?: number
}

export interface ReleasePayoutsRequest {
  transactionIds?: string[]
  releaseAll?: boolean
}

export interface ReleasePayoutsResponse {
  released: number
  totalAmount: number
  transactions: PayoutTransaction[]
}

// ─── Payouts API ──────────────────────────────────────────────────────────

export const payoutsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPoolBalance: builder.query<PoolSummary, void>({
      query: () => '/payouts/pool',
      transformResponse: (raw: { pool: PoolSummary }) => raw.pool,
      providesTags: ['PoolBalance' as const],
    }),

    getPoolTransactions: builder.query<PaginatedResponse<PoolTransaction>, GetPoolTransactionsParams>({
      query: (params) => ({
        url: '/payouts/pool/transactions',
        params,
      }),
      providesTags: ['Payouts'],
    }),

    depositToPool: builder.mutation<DepositResponse, DepositToPoolRequest>({
      query: (body) => ({
        url: '/payouts/pool/deposit',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PoolBalance', 'Payouts', 'Dashboard'],
    }),

    createDepositOrder: builder.mutation<CreateDepositOrderResponse, CreateDepositOrderRequest>({
      query: (body) => ({
        url: '/payouts/pool/create-order',
        method: 'POST',
        body,
      }),
    }),

    verifyDepositPayment: builder.mutation<VerifyDepositPaymentResponse, VerifyDepositPaymentRequest>({
      query: (body) => ({
        url: '/payouts/pool/verify-payment',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PoolBalance', 'Payouts', 'Dashboard'],
    }),

    getPayoutTransactions: builder.query<PaginatedResponse<PayoutTransaction>, GetPayoutTransactionsParams>({
      query: (params) => ({
        url: '/payouts/transactions',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Payouts' as const, id })),
              { type: 'Payouts', id: 'LIST' },
            ]
          : [{ type: 'Payouts', id: 'LIST' }],
    }),

    getPayoutQueue: builder.query<PaginatedResponse<PayoutTransaction>, GetPayoutQueueParams>({
      query: () => '/payouts/queue',
      transformResponse: (raw: QueueRaw) => {
        const toTxn = (item: QueueItem, status: PayoutTransaction['status']): PayoutTransaction => ({
          id: item.id,
          creatorId: item.creatorId ?? '',
          creatorName: item.creatorName,
          upiId: item.upiId,
          amount: item.amount,
          status,
          unlockAt: item.unlockAt ?? undefined,
          createdAt: item.createdAt ?? new Date().toISOString(),
          submissionId: null,
          type: 'payout',
          updatedAt: item.createdAt ?? new Date().toISOString(),
        })
        const all: PayoutTransaction[] = [
          ...(raw.locked ?? []).map(i => toTxn(i, 'locked')),
          ...(raw.processing ?? []).map(i => toTxn(i, 'processing')),
          ...(raw.failed ?? []).map(i => toTxn(i, 'failed')),
        ]
        return { data: all, total: all.length, page: 1, limit: all.length, totalPages: 1, hasNext: false, hasPrev: false }
      },
      providesTags: [{ type: 'Payouts', id: 'QUEUE' }],
    }),

    releasePayouts: builder.mutation<ReleasePayoutsResponse, ReleasePayoutsRequest>({
      query: (body) => ({
        url: '/payouts/release',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        'PoolBalance',
        { type: 'Payouts', id: 'LIST' },
        { type: 'Payouts', id: 'QUEUE' },
        'Dashboard',
      ],
    }),

    retryPayout: builder.mutation<PayoutTransaction, string>({
      query: (id) => ({
        url: `/payouts/${id}/retry`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Payouts', id },
        { type: 'Payouts', id: 'LIST' },
        'PoolBalance',
        'Dashboard',
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetPoolBalanceQuery,
  useGetPoolTransactionsQuery,
  useDepositToPoolMutation,
  useCreateDepositOrderMutation,
  useVerifyDepositPaymentMutation,
  useGetPayoutTransactionsQuery,
  useGetPayoutQueueQuery,
  useReleasePayoutsMutation,
  useRetryPayoutMutation,
} = payoutsApi
