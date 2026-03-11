import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL as string,
  prepareHeaders: (headers) => {
    const token = getCookie('admin_token')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    headers.set('Content-Type', 'application/json')
    // Bypass the ngrok browser interstitial page in development
    headers.set('ngrok-skip-browser-warning', 'true')
    return headers
  },
})

/**
 * Wrapper around fetchBaseQuery that automatically refreshes the access token
 * on 401 responses using the stored refresh token cookie.
 */
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refreshToken = getCookie('admin_refresh_token')
    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        { url: '/auth/refresh', method: 'POST', body: { refreshToken } },
        api,
        extraOptions,
      )

      if (refreshResult.data) {
        const data = refreshResult.data as { token: string; refreshToken: string }
        setCookie('admin_token', data.token, 7)
        setCookie('admin_refresh_token', data.refreshToken, 7)
        // Retry the original request with the new token
        result = await rawBaseQuery(args, api, extraOptions)
      } else {
        // Refresh failed — clear cookies so AuthContext redirects to login
        removeCookie('admin_token')
        removeCookie('admin_refresh_token')
      }
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'AdminUsers',
    'Dashboard',
    'Campaigns',
    'Campaign',
    'Creators',
    'Creator',
    'Submissions',
    'Submission',
    'Payouts',
    'PoolBalance',
    'Leaderboard',
    'Reports',
    'Settings',
    'FraudRules',
    'Badges',
    'Locations',
    'AuditLog',
    'Notifications',
  ],
  endpoints: () => ({}),
})
