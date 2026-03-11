import { baseApi } from './baseApi'
import type { AdminSession } from '../../types'

// ─── Request / Response Types ──────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: AdminSession
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
}

// ─── Auth API ─────────────────────────────────────────────────────────────

export interface SignupBusinessOwnerRequest {
  fullName: string
  businessName: string
  email: string
  phone: string
  password: string
}

export interface SignupBusinessOwnerResponse {
  message: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  success?: boolean
  message?: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signupBusinessOwner: builder.mutation<SignupBusinessOwnerResponse, SignupBusinessOwnerRequest>({
      query: (body) => ({
        url: '/auth/signup-business-owner',
        method: 'POST',
        body,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    getMe: builder.query<AdminSession, void>({
      query: () => '/auth/me',
      transformResponse: (raw: { data: { id?: string; userId?: string; name: string; email: string; role: string; avatar: string | null; loginAt?: string; lastLoginAt?: string } }) => {
        const d = raw.data
        return {
          userId: d.id ?? d.userId ?? '',
          name: d.name,
          email: d.email,
          role: d.role.toUpperCase() === 'SUPERADMIN' ? 'super_admin' : 'admin',
          avatar: d.avatar ?? '',
          loginAt: d.loginAt ?? d.lastLoginAt ?? '',
        } satisfies AdminSession
      },
      providesTags: ['Auth'],
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  useSignupBusinessOwnerMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useLogoutMutation,
  useGetMeQuery,
  useRefreshTokenMutation,
} = authApi
