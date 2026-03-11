import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LoginFormProps {
  onSwitchToSignup: () => void
  onSwitchToForgot: (email: string) => void
  initialEmail?: string
}

export function LoginForm({ onSwitchToSignup, onSwitchToForgot, initialEmail }: LoginFormProps) {
  const { login } = useAuth()
  const { success, error: showError } = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState(initialEmail ?? '')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(true)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await login(email.trim().toLowerCase(), password, rememberDevice)
    setLoading(false)

    if (result.success) {
      success('Login successful', 'Welcome back!')
      navigate('/dashboard', { replace: true })
    } else {
      showError('Login failed', result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[13px] font-semibold text-slate-700">
          Email address
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@trythemenu.com"
            required
            autoComplete="email"
            className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-[13px] font-semibold text-slate-700">
          Password
        </Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="password"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
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

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <label className="inline-flex cursor-pointer items-center gap-2 text-slate-600">
          <Checkbox checked={rememberDevice} onCheckedChange={setRememberDevice} />
          <span>Keep this browser trusted for 7 days</span>
        </label>

        <button
          type="button"
          onClick={() => onSwitchToForgot(email)}
          className="font-semibold text-primary transition hover:text-primary-hover"
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" size="lg" className="w-full rounded-xl font-semibold" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Access dashboard'
        )}
      </Button>

      <p className="text-center text-xs leading-5 text-slate-500">
        New business owner?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-semibold text-primary transition hover:text-primary-hover"
        >
          Create an account
        </button>
      </p>

      <p className="text-center text-xs leading-5 text-slate-500">
        Admin access is invite-only. Contact super-admin for new admin accounts.
      </p>
    </form>
  )
}
