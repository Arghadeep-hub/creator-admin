import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { BrandLogo } from '@/components/BrandLogo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const operationStats = [
  { icon: Users, value: '2,437', label: 'Active creators monitored' },
  { icon: Wallet, value: '₹12.8L', label: 'Monthly payouts processed' },
  { icon: Zap, value: '48', label: 'Live campaigns tracked' },
]

const operationHighlights = [
  'Review creator submissions and trust flags in one queue.',
  'Approve payouts with full audit history and role checks.',
  'Track campaign health with daily and city-wise reporting.',
]

const securityPills = [
  'Role-based access controls',
  'Session-level login monitoring',
  'Payout approval audit trail',
]

const demoCredentials = [
  { role: 'Super Admin', email: 'rahul@trythemenu.com', pass: 'superadmin123' },
  { role: 'Admin', email: 'vikram@trythemenu.com', pass: 'admin123' },
]

export function LoginPage() {
  const { login, signupBusinessOwner, isAuthenticated } = useAuth()
  const { success, error: showError } = useToast()
  const navigate = useNavigate()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('rahul@trythemenu.com')
  const [password, setPassword] = useState('superadmin123')
  const [showPass, setShowPass] = useState(false)

  const [signupFullName, setSignupFullName] = useState('')
  const [signupBusinessName, setSignupBusinessName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  const [showSignupPass, setShowSignupPass] = useState(false)

  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      success('Login successful', 'Welcome back!')
      navigate('/dashboard', { replace: true })
    } else {
      showError('Login failed', result.error)
    }
  }

  async function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (signupPassword.length < 8) {
      showError('Signup failed', 'Password must be at least 8 characters.')
      return
    }

    if (signupPassword !== signupConfirmPassword) {
      showError('Signup failed', 'Passwords do not match.')
      return
    }

    setLoading(true)
    const result = await signupBusinessOwner({
      fullName: signupFullName,
      businessName: signupBusinessName,
      email: signupEmail,
      phone: signupPhone,
      password: signupPassword,
    })
    setLoading(false)

    if (!result.success) {
      showError('Signup failed', result.error)
      return
    }

    success('Signup successful', 'Your Business Owner account is created successfully.')
    setMode('login')
    setEmail(signupEmail.trim().toLowerCase())
    setPassword('')
    setSignupFullName('')
    setSignupBusinessName('')
    setSignupEmail('')
    setSignupPhone('')
    setSignupPassword('')
    setSignupConfirmPassword('')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_10%,#fed7aa_0%,#fff7ed_28%,#f8fafc_65%)]">
      <div className="pointer-events-none absolute -left-20 top-4 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-8 h-80 w-80 rounded-full bg-sky-200/35 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-rose-100/25 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-start px-4 py-7 sm:px-6 sm:py-12 lg:items-center lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          <section className="space-y-7 lg:space-y-8 lg:pr-4">
            <div className="flex items-center gap-3">
              <div>
                <BrandLogo className="h-10 w-auto" alt="TryTheMenu" />
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Creator Admin Workspace</p>
              </div>
            </div>

            <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-orange-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Platform Control Room
            </p>

            <div>
              <h1 className="font-display text-3xl leading-[1.12] tracking-[-0.01em] text-slate-900 sm:text-4xl lg:text-[3.25rem]">
                Operate creator campaigns, fraud checks, and payouts from one secure dashboard.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-7">
                Sign in to manage campaign velocity, maintain payout integrity, and keep every admin action auditable across the platform.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {operationStats.map(stat => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur"
                >
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <p className="num-font text-xl font-bold tabular-nums text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {securityPills.map(pill => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {pill}
                </span>
              ))}
            </div>

            <ul className="hidden space-y-2.5 sm:block">
              {operationHighlights.map(point => (
                <li
                  key={point}
                  className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/60 px-3.5 py-3 text-sm leading-6 text-slate-700 backdrop-blur"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <Card className="rounded-2xl border-slate-200/80 bg-white/90 shadow-2xl shadow-orange-100/60 backdrop-blur">
              <CardHeader className="space-y-5 pb-6">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  <Lock className="h-3.5 w-3.5" />
                  Encrypted and monitored access
                </div>

                <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className={`rounded-md px-3 py-2.5 text-xs font-semibold transition ${
                      mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Admin Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className={`rounded-md px-3 py-2.5 text-xs font-semibold transition ${
                      mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Business Signup
                  </button>
                </div>

                <div>
                  <CardTitle className="font-display text-2xl leading-tight text-slate-900">
                    {mode === 'login' ? 'Welcome back' : 'Create Business Owner account'}
                  </CardTitle>
                  <CardDescription className="mt-2.5 text-sm leading-6">
                    {mode === 'login'
                      ? 'Sign in to review creators, approve campaigns, and release payouts with full audit visibility.'
                      : 'Business owners can self-serve account creation here. Admin and super-admin access remains invite-only.'}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 sm:space-y-7">
                {mode === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[13px] font-semibold text-slate-700">
                        Email address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="admin@trythemenu.com"
                        required
                        autoComplete="email"
                        className="h-11 bg-white/90"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-[13px] font-semibold text-slate-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPass ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          autoComplete="current-password"
                          className="h-11 bg-white/90 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          aria-label={showPass ? 'Hide password' : 'Show password'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                        >
                          {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-xs">
                      <p className="inline-flex items-center gap-1.5 leading-5 text-slate-500">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        Session events are protected and audited
                      </p>
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="font-medium text-primary hover:text-primary-hover"
                      >
                        New business? Sign up
                      </button>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Access dashboard'
                      )}
                    </Button>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Quick demo access</p>
                      <div className="mt-3 grid gap-2">
                        {demoCredentials.map(c => (
                          <button
                            key={c.email}
                            type="button"
                            onClick={() => {
                              setEmail(c.email)
                              setPassword(c.pass)
                            }}
                            className="group flex w-full items-center justify-between rounded-xl border border-transparent bg-white p-3.5 text-left transition hover:border-orange-200 hover:shadow-sm"
                          >
                            <div>
                              <p className="text-xs font-semibold text-slate-700">{c.role}</p>
                              <p className="text-xs text-slate-500">{c.email}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-orange-500" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-center text-xs leading-5 text-slate-500">
                      Admin access is invite-only. Contact super-admin for new admin accounts.
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleSignupSubmit} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="signup-full-name" className="text-[13px] font-semibold text-slate-700">
                          Full name
                        </Label>
                        <Input
                          id="signup-full-name"
                          value={signupFullName}
                          onChange={e => setSignupFullName(e.target.value)}
                          placeholder="Rahul Mehta"
                          required
                          autoComplete="name"
                          className="h-11 bg-white/90"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-phone" className="text-[13px] font-semibold text-slate-700">
                          Phone number
                        </Label>
                        <Input
                          id="signup-phone"
                          type="tel"
                          value={signupPhone}
                          onChange={e => setSignupPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          required
                          autoComplete="tel"
                          className="h-11 bg-white/90"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-business" className="text-[13px] font-semibold text-slate-700">
                        Business name
                      </Label>
                      <Input
                        id="signup-business"
                        value={signupBusinessName}
                        onChange={e => setSignupBusinessName(e.target.value)}
                        placeholder="TryTheMenu Cafe"
                        required
                        autoComplete="organization"
                        className="h-11 bg-white/90"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-[13px] font-semibold text-slate-700">
                        Work email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={e => setSignupEmail(e.target.value)}
                        placeholder="owner@business.com"
                        required
                        autoComplete="email"
                        className="h-11 bg-white/90"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-[13px] font-semibold text-slate-700">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showSignupPass ? 'text' : 'password'}
                            value={signupPassword}
                            onChange={e => setSignupPassword(e.target.value)}
                            placeholder="Minimum 8 chars"
                            required
                            autoComplete="new-password"
                            className="h-11 bg-white/90 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignupPass(!showSignupPass)}
                            aria-label={showSignupPass ? 'Hide password' : 'Show password'}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                          >
                            {showSignupPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password" className="text-[13px] font-semibold text-slate-700">
                          Confirm password
                        </Label>
                        <Input
                          id="signup-confirm-password"
                          type={showSignupPass ? 'text' : 'password'}
                          value={signupConfirmPassword}
                          onChange={e => setSignupConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          required
                          autoComplete="new-password"
                          className="h-11 bg-white/90"
                        />
                      </div>
                    </div>

                    <p className="text-xs leading-5 text-slate-500">
                      Business Owner accounts are created instantly. Admin and super-admin access is provisioned manually.
                    </p>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Business Owner account'
                      )}
                    </Button>

                    <p className="text-center text-xs leading-5 text-slate-500">
                      Already have admin credentials?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="font-medium text-primary hover:text-primary-hover"
                      >
                        Switch to login
                      </button>
                    </p>
                  </form>
                )}

                <p className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs leading-5 text-slate-500">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    Security notice
                  </span>{' '}
                  Login events are tracked with IP, role, and timestamp metadata to support compliance and fraud prevention.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
