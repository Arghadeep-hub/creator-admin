import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { AdminSession } from '@/types'
import {
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useSignupBusinessOwnerMutation,
  useForgotPasswordMutation,
} from '@/store/api/authApi'
import type { SignupBusinessOwnerRequest } from '@/store/api/authApi'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const TOKEN_KEY = 'admin_token'
const REFRESH_TOKEN_KEY = 'admin_refresh_token'
/** Persistent sessions last 7 days; "session only" cookies have no expiry date. */
const REMEMBER_DAYS = 7

interface AuthContextType {
  session: AdminSession | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, rememberDevice?: boolean) => Promise<{ success: boolean; error?: string }>
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>
  logout: () => void
  signupBusinessOwner: (data: SignupBusinessOwnerRequest) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  requestPasswordReset: async () => ({ success: false }),
  logout: () => {},
  signupBusinessOwner: async () => ({ success: false }),
})

function normalizeRole(role: string): 'super_admin' | 'admin' {
  return role.toUpperCase() === 'SUPERADMIN' ? 'super_admin' : 'admin'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [hasToken, setHasToken] = useState(() => !!getCookie(TOKEN_KEY))

  const [loginMutation] = useLoginMutation()
  const [logoutMutation] = useLogoutMutation()
  const [signupBusinessOwnerMutation] = useSignupBusinessOwnerMutation()
  const [forgotPasswordMutation] = useForgotPasswordMutation()

  // Restore session on mount if a valid token cookie exists
  const { data: meData, isSuccess: meSuccess, isError: meError, isLoading: meLoading } = useGetMeQuery(undefined, {
    skip: !hasToken,
  })

  // True only while the initial token verification is in-flight
  const isLoading = hasToken && meLoading

  useEffect(() => {
    if (meSuccess && meData) {
      setSession(meData)
    }
    if (meError) {
      // Token is invalid or expired — clear cookies and session
      removeCookie(TOKEN_KEY)
      removeCookie(REFRESH_TOKEN_KEY)
      setSession(null)
      setHasToken(false)
    }
  }, [meSuccess, meData, meError])

  const login = useCallback(
    async (email: string, password: string, rememberDevice = true): Promise<{ success: boolean; error?: string }> => {
      try {
        const result = await loginMutation({ email, password }).unwrap()
        const days = rememberDevice ? REMEMBER_DAYS : undefined
        setCookie(TOKEN_KEY, result.token, days)
        setCookie(REFRESH_TOKEN_KEY, result.refreshToken, days)
        setSession({ ...result.user, role: normalizeRole(result.user.role) })
        setHasToken(true)
        return { success: true }
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'data' in err
            ? (err as { data?: { message?: string } }).data?.message ?? 'Invalid email or password.'
            : 'Invalid email or password.'
        return { success: false, error: message }
      }
    },
    [loginMutation],
  )

  const signupBusinessOwner = useCallback(
    async (data: SignupBusinessOwnerRequest): Promise<{ success: boolean; error?: string }> => {
      try {
        await signupBusinessOwnerMutation(data).unwrap()
        return { success: true }
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'data' in err
            ? (err as { data?: { message?: string } }).data?.message ?? 'Signup failed. Please try again.'
            : 'Signup failed. Please try again.'
        return { success: false, error: message }
      }
    },
    [signupBusinessOwnerMutation],
  )

  const requestPasswordReset = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string; message?: string }> => {
      try {
        const result = await forgotPasswordMutation({ email }).unwrap()
        return { success: true, message: result.message }
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'data' in err
            ? (err as { data?: { message?: string } }).data?.message ?? 'Unable to process password reset request.'
            : 'Unable to process password reset request.'
        return { success: false, error: message }
      }
    },
    [forgotPasswordMutation],
  )

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap()
    } catch {
      // ignore logout errors — clear regardless
    }
    removeCookie(TOKEN_KEY)
    removeCookie(REFRESH_TOKEN_KEY)
    setSession(null)
    setHasToken(false)
  }, [logoutMutation])

  return (
    <AuthContext.Provider value={{ session, isAuthenticated: !!session, isLoading, login, requestPasswordReset, logout, signupBusinessOwner }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export function useSuperAdminOnly() {
  const { session } = useAuth()
  return session?.role === 'super_admin'
}
