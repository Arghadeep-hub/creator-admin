import { baseApi } from './baseApi'
import type { CreatorAdmin, CreatorSubmissionItem, PayoutTransaction } from '../../types'
import type { PaginatedResponse } from './adminUsersApi'

// ─── Request / Response Types ──────────────────────────────────────────────

export interface GetCreatorsParams {
  page?: number
  limit?: number
  city?: string
  kycStatus?: 'pending' | 'verified' | 'rejected'
  accountStatus?: 'active' | 'inactive' | 'flagged'
  search?: string
  instagramConnected?: boolean
  minTrustScore?: number
  maxTrustScore?: number
}

export interface UpdateCreatorRequest {
  name?: string
  email?: string
  phone?: string
  city?: string
  upiId?: string
  assignedAdmin?: string
}

export interface UpdateCreatorKycRequest {
  kycStatus: 'pending' | 'verified' | 'rejected'
  reason?: string
}

export interface FlagCreatorRequest {
  accountStatus: 'active' | 'inactive' | 'flagged'
  flagReason?: string
}

export interface GetCreatorSubmissionsParams {
  page?: number
  limit?: number
  status?: 'pending' | 'approved' | 'rejected' | 'paid'
}

export interface GetCreatorTransactionsParams {
  page?: number
  limit?: number
  status?: 'locked' | 'processing' | 'paid' | 'failed'
}

// ─── Creators API ─────────────────────────────────────────────────────────

export const creatorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCreators: builder.query<PaginatedResponse<CreatorAdmin>, GetCreatorsParams>({
      query: (params) => ({
        url: '/creators',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Creators' as const, id })),
              { type: 'Creators', id: 'LIST' },
            ]
          : [{ type: 'Creators', id: 'LIST' }],
    }),

    getCreator: builder.query<CreatorAdmin, string>({
      query: (id) => `/creators/${id}`,
      transformResponse: (raw: { creator: CreatorAdmin }) => ({
        ...raw.creator,
        // Backend lowercases kycStatus; normalize to uppercase for consistency
        kycStatus: raw.creator.kycStatus.toUpperCase() as CreatorAdmin['kycStatus'],
      }),
      providesTags: (_result, _error, id) => [{ type: 'Creator', id }],
    }),

    updateCreator: builder.mutation<CreatorAdmin, { id: string; body: UpdateCreatorRequest }>({
      query: ({ id, body }) => ({
        url: `/creators/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Creators', id },
        { type: 'Creator', id },
        { type: 'Creators', id: 'LIST' },
      ],
    }),

    updateCreatorKyc: builder.mutation<CreatorAdmin, { id: string; body: UpdateCreatorKycRequest }>({
      query: ({ id, body }) => ({
        url: `/creators/${id}/kyc`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Creators', id },
        { type: 'Creator', id },
        { type: 'Creators', id: 'LIST' },
        'Dashboard',
      ],
    }),

    flagCreator: builder.mutation<CreatorAdmin, { id: string; body: FlagCreatorRequest }>({
      query: ({ id, body }) => ({
        url: `/creators/${id}/flag`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Creators', id },
        { type: 'Creator', id },
        { type: 'Creators', id: 'LIST' },
        'Dashboard',
      ],
    }),

    getCreatorSubmissions: builder.query<
      PaginatedResponse<CreatorSubmissionItem>,
      { id: string; params?: GetCreatorSubmissionsParams }
    >({
      query: ({ id, params }) => ({
        url: `/creators/${id}/submissions`,
        params,
      }),
      providesTags: (_result, _error, { id }) => [
        { type: 'Submissions', id: `creator-${id}` },
      ],
    }),

    getCreatorTransactions: builder.query<
      PaginatedResponse<PayoutTransaction>,
      { id: string; params?: GetCreatorTransactionsParams }
    >({
      query: ({ id, params }) => ({
        url: `/creators/${id}/transactions`,
        params,
      }),
      providesTags: (_result, _error, { id }) => [
        { type: 'Payouts', id: `creator-${id}` },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetCreatorsQuery,
  useGetCreatorQuery,
  useUpdateCreatorMutation,
  useUpdateCreatorKycMutation,
  useFlagCreatorMutation,
  useGetCreatorSubmissionsQuery,
  useGetCreatorTransactionsQuery,
} = creatorsApi
