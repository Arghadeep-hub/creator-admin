import React, { createContext, useContext, useState, useCallback } from 'react'
import type { AdminSession } from '@/types'
import { MOCK_ADMINS } from '@/data/admins'

interface BusinessOwnerSignupInput {
  fullName: string
  businessName: string
  email: string
  phone: string
  password: string
}

interface BusinessOwnerSignupRecord extends BusinessOwnerSignupInput {
  id: string
  status: 'active'
  createdAt: string
}

interface AuthContextType {
  session: AdminSession | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signupBusinessOwner: (payload: BusinessOwnerSignupInput) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  signupBusinessOwner: async () => ({ success: false }),
  logout: () => {},
})

const SESSION_KEY = 'ttm_admin_session'
const BUSINESS_OWNER_SIGNUP_KEY = 'ttm_business_owner_signups'

function loadSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AdminSession) : null
  } catch {
    return null
  }
}

function loadBusinessOwnerSignups(): BusinessOwnerSignupRecord[] {
  try {
    const raw = localStorage.getItem(BUSINESS_OWNER_SIGNUP_KEY)
    return raw ? (JSON.parse(raw) as BusinessOwnerSignupRecord[]) : []
  } catch {
    return []
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(loadSession)

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 600))

    const admin = MOCK_ADMINS.find(a => a.email === email && a.password === password)
    if (!admin) return { success: false, error: 'Invalid email or password.' }
    if (!admin.isActive) return { success: false, error: 'Account is deactivated. Contact a Super Admin.' }

    const newSession: AdminSession = {
      userId: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
      loginAt: new Date().toISOString(),
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession))
    setSession(newSession)
    return { success: true }
  }, [])

  const signupBusinessOwner = useCallback(
    async ({
      fullName,
      businessName,
      email,
      phone,
      password,
    }: BusinessOwnerSignupInput): Promise<{ success: boolean; error?: string }> => {
      await new Promise(r => setTimeout(r, 600))

      const normalizedEmail = email.trim().toLowerCase()
      const adminExists = MOCK_ADMINS.some(admin => admin.email.toLowerCase() === normalizedEmail)
      if (adminExists) {
        return { success: false, error: 'This email already has an admin account. Use login instead.' }
      }

      const existingSignups = loadBusinessOwnerSignups()
      const alreadyRequested = existingSignups.some(owner => owner.email.toLowerCase() === normalizedEmail)
      if (alreadyRequested) {
        return { success: false, error: 'A signup request already exists for this email.' }
      }

      const signupRecord: BusinessOwnerSignupRecord = {
        id: `bo-${Date.now()}`,
        fullName: fullName.trim(),
        businessName: businessName.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        password,
        status: 'active',
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem(BUSINESS_OWNER_SIGNUP_KEY, JSON.stringify([...existingSignups, signupRecord]))
      return { success: true }
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setSession(null)
  }, [])

  return (
    <AuthContext.Provider value={{ session, isAuthenticated: !!session, login, signupBusinessOwner, logout }}>
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
