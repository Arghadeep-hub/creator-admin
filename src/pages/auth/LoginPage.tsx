import { lazy, Suspense, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Check, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BrandingSection } from './_sections/BrandingSection'
import { LoginForm } from './_sections/LoginForm'

const SignupForm = lazy(() => import('./_sections/SignupForm').then(m => ({ default: m.SignupForm })))
const ForgotPasswordForm = lazy(() => import('./_sections/ForgotPasswordForm').then(m => ({ default: m.ForgotPasswordForm })))

type AuthMode = 'login' | 'signup' | 'forgot'

const titles: Record<AuthMode, string> = {
  login: 'Welcome back',
  signup: 'Create Business Owner account',
  forgot: 'Forgot password?',
}

const descriptions: Record<AuthMode, string> = {
  login: 'Sign in to review creators, approve campaigns, and release payouts with complete visibility.',
  signup: 'Business owners can self-serve onboarding here. Admin and super-admin access remains invite-only.',
  forgot: 'Enter your work email and we will send secure password reset instructions.',
}

export function LoginPage() {
  const { isAuthenticated } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [prefillEmail, setPrefillEmail] = useState('')
  const [forgotInitialEmail, setForgotInitialEmail] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const switchToLogin = () => setMode('login')
  const switchToSignup = () => setMode('signup')
  const switchToForgot = (email: string) => {
    setForgotInitialEmail(email)
    setMode('forgot')
  }

  const handleSignupSuccess = (email: string) => {
    setPrefillEmail(email)
    setMode('login')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(249,115,22,0.34),transparent_36%),radial-gradient(circle_at_88%_0%,rgba(56,189,248,0.22),transparent_35%),linear-gradient(160deg,#020617_0%,#0f172a_54%,#111827_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.09)_1px,transparent_1px)] bg-[size:42px_42px] opacity-30" />
      <div className="pointer-events-none absolute -left-24 top-12 h-80 w-80 rounded-full bg-orange-400/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-96 w-96 rounded-full bg-cyan-400/16 blur-3xl" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-7 sm:px-6 sm:py-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:px-8 lg:py-12">
        <BrandingSection />

        <section className="lg:pl-2">
          <Card className="relative overflow-hidden rounded-[26px] border border-slate-200/75 bg-white/95 text-slate-900 shadow-[0_28px_80px_-34px_rgba(15,23,42,0.72)] backdrop-blur">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500" />

            <CardHeader className="space-y-5 pb-5">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <Lock className="h-3.5 w-3.5" />
                Encrypted and monitored authentication
              </div>

              <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-slate-100/85 p-1">
                <button
                  type="button"
                  onClick={switchToLogin}
                  className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  Admin Login
                </button>
                <button
                  type="button"
                  onClick={switchToSignup}
                  className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  Business Signup
                </button>
              </div>

              <div>
                <CardTitle className="font-display text-[1.65rem] leading-tight text-slate-900">
                  {titles[mode]}
                </CardTitle>
                <CardDescription className="mt-2 text-sm leading-6 text-slate-600">
                  {descriptions[mode]}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {mode === 'login' ? (
                <LoginForm
                  onSwitchToSignup={switchToSignup}
                  onSwitchToForgot={switchToForgot}
                  initialEmail={prefillEmail}
                />
              ) : (
                <Suspense fallback={<div className="flex justify-center py-8"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-primary" /></div>}>
                  {mode === 'signup' ? (
                    <SignupForm
                      onSwitchToLogin={switchToLogin}
                      onSignupSuccess={handleSignupSuccess}
                    />
                  ) : (
                    <ForgotPasswordForm
                      initialEmail={forgotInitialEmail}
                      onSwitchToLogin={switchToLogin}
                    />
                  )}
                </Suspense>
              )}

              <p className="rounded-xl border border-slate-200 bg-slate-50/90 p-4 text-xs leading-5 text-slate-500">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Security notice
                </span>{' '}
                Login events are tracked with IP, role, and timestamp metadata for compliance and fraud prevention.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
