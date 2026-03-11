import { baseApi } from './baseApi'
import type { PlatformSettings, FraudRule, MilestoneBadge, ManagedLocation } from '../../types'

// ─── Request / Response Types ──────────────────────────────────────────────

export type UpdateSettingsRequest = Partial<PlatformSettings>

export interface CreateFraudRuleRequest {
  name: string
  description: string
  condition: FraudRule['condition']
  threshold?: number
  severity: FraudRule['severity']
  penaltyPercent: number
  isActive?: boolean
}

export type UpdateFraudRuleRequest = Partial<CreateFraudRuleRequest>

export interface CreateBadgeRequest {
  label: string
  description: string
  icon?: string
  unlockCriteria?: string
  thresholdValue?: number
  rewardMultiplier?: number
  trustScoreBonus?: number
  isActive?: boolean
}

export interface UpdateBadgeRequest {
  label?: string
  description?: string
  icon?: string
  unlockCriteria?: string
  thresholdValue?: number
  rewardMultiplier?: number
  trustScoreBonus?: number
  isActive?: boolean
}

export interface AddLocationRequest {
  city: string
  areaName: string
  latitude: number
  longitude: number
  isActive?: boolean
}

export interface UpdateLocationRequest {
  city?: string
  areaName?: string
  latitude?: number
  longitude?: number
  isActive?: boolean
}

// ─── Settings API ─────────────────────────────────────────────────────────

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<PlatformSettings, void>({
      query: () => '/settings',
      transformResponse: (raw: { settings: PlatformSettings }) => raw.settings,
      providesTags: ['Settings'],
    }),

    updateSettings: builder.mutation<PlatformSettings, UpdateSettingsRequest>({
      query: (body) => ({
        url: '/settings',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),

    getFraudRules: builder.query<FraudRule[], void>({
      query: () => '/settings/fraud-rules',
      transformResponse: (raw: { rules: FraudRule[] }) => raw.rules,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'FraudRules' as const, id })),
              { type: 'FraudRules', id: 'LIST' },
            ]
          : [{ type: 'FraudRules', id: 'LIST' }],
    }),

    createFraudRule: builder.mutation<FraudRule, CreateFraudRuleRequest>({
      query: (body) => ({
        url: '/settings/fraud-rules',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'FraudRules', id: 'LIST' }],
    }),

    updateFraudRule: builder.mutation<FraudRule, { id: string; body: UpdateFraudRuleRequest }>({
      query: ({ id, body }) => ({
        url: `/settings/fraud-rules/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'FraudRules', id },
        { type: 'FraudRules', id: 'LIST' },
      ],
    }),

    deleteFraudRule: builder.mutation<void, string>({
      query: (id) => ({
        url: `/settings/fraud-rules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'FraudRules', id },
        { type: 'FraudRules', id: 'LIST' },
      ],
    }),

    getBadges: builder.query<MilestoneBadge[], void>({
      query: () => '/settings/badges',
      transformResponse: (raw: { badges: MilestoneBadge[] }) => raw.badges,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Badges' as const, id })),
              { type: 'Badges', id: 'LIST' },
            ]
          : [{ type: 'Badges', id: 'LIST' }],
    }),

    createBadge: builder.mutation<MilestoneBadge, CreateBadgeRequest>({
      query: (body) => ({
        url: '/settings/badges',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Badges', id: 'LIST' }],
    }),

    updateBadge: builder.mutation<MilestoneBadge, { id: string; body: UpdateBadgeRequest }>({
      query: ({ id, body }) => ({
        url: `/settings/badges/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Badges', id },
        { type: 'Badges', id: 'LIST' },
      ],
    }),

    getLocations: builder.query<ManagedLocation[], void>({
      query: () => '/settings/locations',
      transformResponse: (raw: { locations: ManagedLocation[] }) => raw.locations,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Locations' as const, id })),
              { type: 'Locations', id: 'LIST' },
            ]
          : [{ type: 'Locations', id: 'LIST' }],
    }),

    addLocation: builder.mutation<ManagedLocation, AddLocationRequest>({
      query: (body) => ({
        url: '/settings/locations',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Locations', id: 'LIST' }],
    }),

    updateLocation: builder.mutation<ManagedLocation, { id: string; body: UpdateLocationRequest }>({
      query: ({ id, body }) => ({
        url: `/settings/locations/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Locations', id },
        { type: 'Locations', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetFraudRulesQuery,
  useCreateFraudRuleMutation,
  useUpdateFraudRuleMutation,
  useDeleteFraudRuleMutation,
  useGetBadgesQuery,
  useCreateBadgeMutation,
  useUpdateBadgeMutation,
  useGetLocationsQuery,
  useAddLocationMutation,
  useUpdateLocationMutation,
} = settingsApi
