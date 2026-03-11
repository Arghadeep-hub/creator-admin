import { baseApi } from './baseApi'
import type { SubmissionAdmin } from '../../types'
import type { PaginatedResponse } from './adminUsersApi'

// ─── Request / Response Types ──────────────────────────────────────────────

export interface GetSubmissionsParams {
  page?: number
  limit?: number
  status?: 'pending' | 'approved' | 'rejected' | 'paid'
  verificationStage?: 't0' | 'h24' | 'h72' | 'completed'
  campaignId?: string
  creatorId?: string
  city?: string
  search?: string
  hasFraudFlags?: boolean
  dateFrom?: string
  dateTo?: string
}

export interface ReviewSubmissionRequest {
  action: 'approve' | 'reject'
  rejectionReason?: string
  note?: string
}

export interface AddSubmissionNoteRequest {
  note: string
}

export interface OverrideSubmissionPayoutRequest {
  amount: number
  reason: string
}

export interface AdvanceSubmissionStageRequest {
  stage: 't0' | 'h24' | 'h72' | 'completed'
}

// ─── Submissions API ───────────────────────────────────────────────────────

export const submissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubmissions: builder.query<PaginatedResponse<SubmissionAdmin>, GetSubmissionsParams>({
      query: (params) => ({
        url: '/submissions',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Submissions' as const, id })),
              { type: 'Submissions', id: 'LIST' },
            ]
          : [{ type: 'Submissions', id: 'LIST' }],
    }),

    getSubmission: builder.query<SubmissionAdmin, string>({
      query: (id) => `/submissions/${id}`,
      transformResponse: (raw: { data: SubmissionAdmin }) => raw.data,
      providesTags: (_result, _error, id) => [{ type: 'Submission', id }],
    }),

    reviewSubmission: builder.mutation<SubmissionAdmin, { id: string; body: ReviewSubmissionRequest }>({
      query: ({ id, body }) => ({
        url: `/submissions/${id}/review`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Submissions', id },
        { type: 'Submission', id },
        { type: 'Submissions', id: 'LIST' },
        'Dashboard',
        'Payouts',
      ],
    }),

    addSubmissionNote: builder.mutation<SubmissionAdmin, { id: string; body: AddSubmissionNoteRequest }>({
      query: ({ id, body }) => ({
        url: `/submissions/${id}/notes`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Submissions', id },
        { type: 'Submission', id },
      ],
    }),

    overrideSubmissionPayout: builder.mutation<
      SubmissionAdmin,
      { id: string; body: OverrideSubmissionPayoutRequest }
    >({
      query: ({ id, body }) => ({
        url: `/submissions/${id}/payout-override`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Submissions', id },
        { type: 'Submission', id },
        'Payouts',
        'PoolBalance',
      ],
    }),

    advanceSubmissionStage: builder.mutation<
      SubmissionAdmin,
      { id: string; body: AdvanceSubmissionStageRequest }
    >({
      query: ({ id, body }) => ({
        url: `/submissions/${id}/stage`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Submissions', id },
        { type: 'Submission', id },
        { type: 'Submissions', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetSubmissionsQuery,
  useGetSubmissionQuery,
  useReviewSubmissionMutation,
  useAddSubmissionNoteMutation,
  useOverrideSubmissionPayoutMutation,
  useAdvanceSubmissionStageMutation,
} = submissionsApi
