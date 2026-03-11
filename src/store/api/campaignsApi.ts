import { baseApi } from './baseApi'
import type { CampaignAdmin, SubmissionAdmin } from '../../types'
import type { PaginatedResponse } from './adminUsersApi'

// ─── Request / Response Types ──────────────────────────────────────────────

export interface GetCampaignsParams {
  page?: number
  limit?: number
  isActive?: boolean
  city?: string
  search?: string
  sortBy?: 'createdAt' | 'deadline' | 'successRate' | 'totalSpots'
  sortOrder?: 'asc' | 'desc'
}

export interface CreateCampaignRequest {
  businessName: string
  businessLogo?: string
  category?: string
  name: string
  city: string
  address: string
  latitude: number
  longitude: number
  description?: string
  payoutBase: number
  payoutMin: number
  payoutMax: number
  requiredViews: number
  bonusPerThousandViews: number
  requiredHashtags: string[]
  rules: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  totalSpots: number
  deadline: string
  estimatedVisitTimeMins?: number
  checkInRadiusMeters: number
  isActive?: boolean
}

export type UpdateCampaignRequest = Partial<CreateCampaignRequest>

export interface ToggleCampaignStatusRequest {
  isActive: boolean
}

export interface GetCampaignSubmissionsParams {
  page?: number
  limit?: number
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID'
  stage?: 'T0' | 'H24' | 'H72' | 'COMPLETED'
}

export interface CampaignAnalytics {
  campaignId: string
  campaignName: string
  totalSubmissions: number
  submissionTimeline: Array<{ week: string; submissions: number; approved: number; rejected: number }>
  topCreators: Array<{
    id: string
    name: string
    instagramHandle: string | null
    instagramFollowers: number
    submissionsCount: number
  }>
  payoutDistribution: {
    min: number
    max: number
    avg: number
    total: number
    count: number
  }
}

export interface CampaignsListResponse extends PaginatedResponse<CampaignAdmin> {
  summary: {
    active: number
    inactive: number
  }
}

// ─── Campaigns API ─────────────────────────────────────────────────────────

export const campaignsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query<CampaignsListResponse, GetCampaignsParams>({
      query: (params) => ({
        url: '/campaigns',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Campaigns' as const, id })),
              { type: 'Campaigns', id: 'LIST' },
            ]
          : [{ type: 'Campaigns', id: 'LIST' }],
    }),

    getCampaign: builder.query<CampaignAdmin, string>({
      query: (id) => `/campaigns/${id}`,
      transformResponse: (raw: { data: CampaignAdmin }) => raw.data,
      providesTags: (_result, _error, id) => [{ type: 'Campaign', id }],
    }),

    createCampaign: builder.mutation<CampaignAdmin, CreateCampaignRequest>({
      query: (body) => ({
        url: '/campaigns',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Campaigns', id: 'LIST' }, 'Dashboard'],
    }),

    updateCampaign: builder.mutation<CampaignAdmin, { id: string; body: UpdateCampaignRequest }>({
      query: ({ id, body }) => ({
        url: `/campaigns/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Campaigns', id },
        { type: 'Campaign', id },
        { type: 'Campaigns', id: 'LIST' },
      ],
    }),

    deleteCampaign: builder.mutation<void, string>({
      query: (id) => ({
        url: `/campaigns/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Campaigns', id },
        { type: 'Campaign', id },
        { type: 'Campaigns', id: 'LIST' },
        'Dashboard',
      ],
    }),

    toggleCampaignStatus: builder.mutation<CampaignAdmin, { id: string; body: ToggleCampaignStatusRequest }>({
      query: ({ id, body }) => ({
        url: `/campaigns/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Campaigns', id },
        { type: 'Campaign', id },
        { type: 'Campaigns', id: 'LIST' },
        'Dashboard',
      ],
    }),

    getCampaignSubmissions: builder.query<
      PaginatedResponse<SubmissionAdmin>,
      { id: string; params?: GetCampaignSubmissionsParams }
    >({
      query: ({ id, params }) => ({
        url: `/campaigns/${id}/submissions`,
        params,
      }),
      providesTags: (_result, _error, { id }) => [
        { type: 'Submissions', id: `campaign-${id}` },
      ],
    }),

    getCampaignAnalytics: builder.query<CampaignAnalytics, string>({
      query: (id) => `/campaigns/${id}/analytics`,
      transformResponse: (raw: { data: CampaignAnalytics }) => raw.data,
      providesTags: (_result, _error, id) => [{ type: 'Campaign', id: `analytics-${id}` }],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetCampaignsQuery,
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useToggleCampaignStatusMutation,
  useGetCampaignSubmissionsQuery,
  useGetCampaignAnalyticsQuery,
} = campaignsApi
