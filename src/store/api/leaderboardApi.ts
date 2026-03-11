import { baseApi } from './baseApi'
import type { LeaderboardEntry, LeaderboardConfig } from '../../types'
import type { PaginatedResponse } from './adminUsersApi'

// ─── Request / Response Types ──────────────────────────────────────────────

export interface GetLeaderboardParams {
  page?: number
  limit?: number
  city?: string
  weekStart?: string
}

export interface UpdateLeaderboardConfigRequest {
  tiers?: LeaderboardConfig['tiers']
  resetDay?: LeaderboardConfig['resetDay']
  resetTime?: string
  timezone?: string
}

export interface LeaderboardSnapshot {
  weekStart: string
  weekEnd: string
  totalParticipants: number
  totalEarnings: number
  entries: LeaderboardEntry[]
  createdAt: string
}

export interface GetLeaderboardSnapshotsParams {
  page?: number
  limit?: number
}

export interface TriggerSnapshotResponse {
  snapshot: LeaderboardSnapshot
  message: string
}

// ─── Leaderboard API ──────────────────────────────────────────────────────

export const leaderboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query<PaginatedResponse<LeaderboardEntry>, GetLeaderboardParams>({
      query: (params) => ({
        url: '/leaderboard',
        params,
      }),
      providesTags: ['Leaderboard'],
    }),

    getLeaderboardConfig: builder.query<LeaderboardConfig, void>({
      query: () => '/leaderboard/config',
      transformResponse: (raw: { data: LeaderboardConfig }) => raw.data,
      providesTags: ['Leaderboard'],
    }),

    updateLeaderboardConfig: builder.mutation<LeaderboardConfig, UpdateLeaderboardConfigRequest>({
      query: (body) => ({
        url: '/leaderboard/config',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Leaderboard'],
    }),

    getLeaderboardSnapshots: builder.query<
      PaginatedResponse<LeaderboardSnapshot>,
      GetLeaderboardSnapshotsParams
    >({
      query: (params) => ({
        url: '/leaderboard/snapshots',
        params,
      }),
      providesTags: ['Leaderboard'],
    }),

    getLeaderboardSnapshot: builder.query<LeaderboardSnapshot, string>({
      query: (weekStart) => `/leaderboard/snapshots/${weekStart}`,
      transformResponse: (raw: { data: LeaderboardSnapshot }) => raw.data,
      providesTags: (_result, _error, weekStart) => [
        { type: 'Leaderboard', id: `snapshot-${weekStart}` },
      ],
    }),

    triggerLeaderboardSnapshot: builder.mutation<TriggerSnapshotResponse, void>({
      query: () => ({
        url: '/leaderboard/snapshot',
        method: 'POST',
      }),
      invalidatesTags: ['Leaderboard'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetLeaderboardQuery,
  useGetLeaderboardConfigQuery,
  useUpdateLeaderboardConfigMutation,
  useGetLeaderboardSnapshotsQuery,
  useGetLeaderboardSnapshotQuery,
  useTriggerLeaderboardSnapshotMutation,
} = leaderboardApi
