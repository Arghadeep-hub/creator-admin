import { baseApi } from './baseApi'
import type { AdminNotification } from '../../types'
import type { PaginatedResponse } from './adminUsersApi'

// ─── Request / Response Types ──────────────────────────────────────────────

export interface GetNotificationsParams {
  page?: number
  limit?: number
  read?: boolean
  type?: AdminNotification['type']
  severity?: AdminNotification['severity']
}

// ─── Notifications API ────────────────────────────────────────────────────

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<PaginatedResponse<AdminNotification>, GetNotificationsParams>({
      query: (params) => ({
        url: '/notifications',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Notifications' as const, id })),
              { type: 'Notifications', id: 'LIST' },
            ]
          : [{ type: 'Notifications', id: 'LIST' }],
    }),

    markNotificationRead: builder.mutation<AdminNotification, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notifications', id },
        { type: 'Notifications', id: 'LIST' },
      ],
    }),

    markAllNotificationsRead: builder.mutation<{ updated: number }, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Notifications', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi
