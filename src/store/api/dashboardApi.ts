import { baseApi } from './baseApi'
import type { DashboardStats, ActivityFeedEntry } from '../../types'

// ─── Response Types ────────────────────────────────────────────────────────

export interface CreatorGrowthDataPoint {
  week: string
  creators: number
}

export interface SubmissionVolumeDataPoint {
  week: string
  submissions: number
  approved: number
  rejected: number
}

export interface TopCampaign {
  id: string
  name: string
  successRate: number
  totalSubmissions: number
  totalPaidOut: number
}

export interface ActivationFunnel {
  registered: number
  instagramConnected: number
  kycSubmitted: number
  kycVerified: number
  firstSubmission: number
}

export interface OperationalHealth {
  poolBalance: number
  failedPayoutsLast24h: number
  pendingKycCount: number
  fraudFlaggedToday: number
  avgSubmissionReviewHours: number
}

// ─── Query Params ──────────────────────────────────────────────────────────

export interface PeriodParam {
  period?: '7d' | '30d' | '90d'
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Unwrap `{ data: T }` envelope returned by every backend endpoint. */
function unwrap<T>(raw: { data: T }): T {
  return raw.data
}

/** Unwrap and guarantee an array even if the API returns null/undefined. */
function unwrapArray<T>(raw: { data: T[] } | null | undefined): T[] {
  return raw?.data ?? []
}

// ─── Dashboard API ─────────────────────────────────────────────────────────

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, PeriodParam>({
      query: (params) => ({ url: '/dashboard/stats', params }),
      transformResponse: (raw: { data: DashboardStats }) => unwrap(raw),
      providesTags: ['Dashboard'],
    }),

    getCreatorGrowth: builder.query<CreatorGrowthDataPoint[], PeriodParam>({
      query: (params) => ({ url: '/dashboard/creator-growth', params }),
      transformResponse: (raw: { data: CreatorGrowthDataPoint[] }) => unwrapArray(raw),
      providesTags: ['Dashboard'],
    }),

    getSubmissionVolume: builder.query<SubmissionVolumeDataPoint[], PeriodParam>({
      query: (params) => ({ url: '/dashboard/submission-volume', params }),
      transformResponse: (raw: { data: SubmissionVolumeDataPoint[] }) => unwrapArray(raw),
      providesTags: ['Dashboard'],
    }),

    getTopCampaigns: builder.query<TopCampaign[], { limit?: number }>({
      query: (params) => ({ url: '/dashboard/top-campaigns', params }),
      transformResponse: (raw: { data: TopCampaign[] }) => unwrapArray(raw),
      providesTags: ['Dashboard'],
    }),

    getActivationFunnel: builder.query<ActivationFunnel, void>({
      query: () => '/dashboard/activation-funnel',
      transformResponse: (raw: { data: ActivationFunnel }) => unwrap(raw),
      providesTags: ['Dashboard'],
    }),

    getActivityFeed: builder.query<ActivityFeedEntry[], { limit?: number }>({
      query: (params) => ({ url: '/dashboard/activity-feed', params }),
      transformResponse: (raw: { data: ActivityFeedEntry[] }) => unwrapArray(raw),
      providesTags: ['Dashboard'],
    }),

    getOperationalHealth: builder.query<OperationalHealth, void>({
      query: () => '/dashboard/operational-health',
      transformResponse: (raw: { data: OperationalHealth }) => unwrap(raw),
      providesTags: ['Dashboard'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetDashboardStatsQuery,
  useGetCreatorGrowthQuery,
  useGetSubmissionVolumeQuery,
  useGetTopCampaignsQuery,
  useGetActivationFunnelQuery,
  useGetActivityFeedQuery,
  useGetOperationalHealthQuery,
} = dashboardApi
