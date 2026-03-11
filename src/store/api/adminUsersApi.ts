import { baseApi } from './baseApi'
import type { AdminUser } from '../../types'

// ─── Shared Types ──────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// ─── Request / Response Types ──────────────────────────────────────────────

export interface GetAdminUsersParams {
  page?: number
  limit?: number
  role?: 'SUPERADMIN' | 'ADMIN'
  isActive?: boolean
  city?: string
}

export interface CreateAdminUserRequest {
  name: string
  email: string
  password: string
  role: 'SUPERADMIN' | 'ADMIN'
  phone?: string
  department?: string
  managedCities?: string[]
  avatar?: string
}

export interface UpdateAdminUserRequest {
  name?: string
  role?: 'SUPERADMIN' | 'ADMIN'
  phone?: string
  department?: string
  managedCities?: string[]
  avatar?: string
}

export interface ResetAdminPasswordRequest {
  newPassword: string
}

export interface UpdateAdminStatusRequest {
  isActive: boolean
}

// ─── Admin Users API ───────────────────────────────────────────────────────

export const adminUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<PaginatedResponse<AdminUser>, GetAdminUsersParams>({
      query: (params) => ({
        url: '/admin-users',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'AdminUsers' as const, id })),
              { type: 'AdminUsers', id: 'LIST' },
            ]
          : [{ type: 'AdminUsers', id: 'LIST' }],
    }),

    createAdminUser: builder.mutation<AdminUser, CreateAdminUserRequest>({
      query: (body) => ({
        url: '/admin-users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AdminUsers', id: 'LIST' }],
    }),

    updateAdminUser: builder.mutation<AdminUser, { id: string; body: UpdateAdminUserRequest }>({
      query: ({ id, body }) => ({
        url: `/admin-users/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'AdminUsers', id },
        { type: 'AdminUsers', id: 'LIST' },
      ],
    }),

    resetAdminPassword: builder.mutation<void, { id: string; body: ResetAdminPasswordRequest }>({
      query: ({ id, body }) => ({
        url: `/admin-users/${id}/password`,
        method: 'PATCH',
        body,
      }),
    }),

    updateAdminStatus: builder.mutation<AdminUser, { id: string; body: UpdateAdminStatusRequest }>({
      query: ({ id, body }) => ({
        url: `/admin-users/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'AdminUsers', id },
        { type: 'AdminUsers', id: 'LIST' },
      ],
    }),

    deleteAdminUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin-users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'AdminUsers', id },
        { type: 'AdminUsers', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useResetAdminPasswordMutation,
  useUpdateAdminStatusMutation,
  useDeleteAdminUserMutation,
} = adminUsersApi
