import { useState } from 'react'
import {
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  UserCircle2,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SignupFormProps {
  onSwitchToLogin: () => void
  onSignupSuccess: (email: string) => void
}

export function SignupForm({ onSwitchToLogin, onSignupSuccess }: SignupFormProps) {
  const { signupBusinessOwner } = useAuth()
  const { success, error: showError } = useToast()

  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password.length < 8) {
      showError('Signup failed', 'Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      showError('Signup failed', 'Passwords do not match.')
      return
    }

    setLoading(true)
    const result = await signupBusinessOwner({
      fullName,
      businessName,
      email,
      phone,
      password,
    })
    setLoading(false)

    if (!result.success) {
      showError('Signup failed', result.error)
      return
    }

    success('Signup successful', 'Your Business Owner account is created successfully.')
    onSignupSuccess(email.trim().toLowerCase())
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="signup-full-name" className="text-[13px] font-semibold text-slate-700">
            Full name
          </Label>
          <div className="relative">
            <UserCircle2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="signup-full-name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Rahul Mehta"
              required
              autoComplete="name"
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-phone" className="text-[13px] font-semibold text-slate-700">
            Phone number
          </Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="signup-phone"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
              autoComplete="tel"
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-business" className="text-[13px] font-semibold text-slate-700">
          Business name
        </Label>
        <div className="relative">
          <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="signup-business"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            placeholder="TryTheMenu Cafe"
            required
            autoComplete="organization"
            className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-[13px] font-semibold text-slate-700">
          Work email
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="signup-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="owner@business.com"
            required
            autoComplete="email"
            className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="signup-password" className="text-[13px] font-semibold text-slate-700">
            Password
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="signup-password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 8 chars"
              required
              autoComplete="new-password"
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-slate-600"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-confirm-password" className="text-[13px] font-semibold text-slate-700">
            Confirm password
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="signup-confirm-password"
              type={showPass ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              required
              autoComplete="new-password"
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10"
            />
          </div>
        </div>
      </div>

      <p className="text-xs leading-5 text-slate-500">
        Business Owner accounts are created instantly. Admin and super-admin access is provisioned manually.
      </p>

      <Button type="submit" size="lg" className="w-full rounded-xl font-semibold" disabled={loading}>
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
          onClick={onSwitchToLogin}
          className="font-semibold text-primary transition hover:text-primary-hover"
        >
          Switch to login
        </button>
      </p>
    </form>
  )
}
