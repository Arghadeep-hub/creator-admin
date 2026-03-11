import { useState } from 'react'
import { Loader2, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ForgotPasswordFormProps {
  initialEmail?: string
  onSwitchToLogin: () => void
}

export function ForgotPasswordForm({ initialEmail, onSwitchToLogin }: ForgotPasswordFormProps) {
  const { requestPasswordReset } = useAuth()
  const { success, error: showError, info } = useToast()

  const [forgotEmail, setForgotEmail] = useState(initialEmail ?? '')
  const [recoverySent, setRecoverySent] = useState(false)
  const [recoveryNotice, setRecoveryNotice] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const normalizedEmail = forgotEmail.trim().toLowerCase()

    if (!normalizedEmail) {
      showError('Reset failed', 'Please enter your work email to continue.')
      return
    }

    setLoading(true)
    const result = await requestPasswordReset(normalizedEmail)
    setLoading(false)

    if (!result.success) {
      const failureMessage = result.error ?? 'Unable to process password reset request.'
      const isUnavailableEndpoint = /404|not found|cannot post/i.test(failureMessage)

      if (isUnavailableEndpoint) {
        const fallbackMessage = 'Self-serve reset is unavailable right now. Contact super-admin to reset your password.'
        setRecoverySent(true)
        setRecoveryNotice(fallbackMessage)
        info('Password reset help', fallbackMessage)
        return
      }

      showError('Reset failed', result.error)
      return
    }

    const successMessage = result.message ?? 'If the account exists, a password reset link has been sent to your email.'
    setRecoverySent(true)
    setRecoveryNotice(successMessage)
    success('Reset link sent', successMessage)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs leading-5 text-blue-800">
        We will email a password reset link valid for a short duration. For security, this flow does not
        confirm whether an account exists.
      </div>

      <div className="space-y-2">
        <Label htmlFor="forgot-email" className="text-[13px] font-semibold text-slate-700">
          Work email
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="forgot-email"
            type="email"
            value={forgotEmail}
            onChange={e => {
              setForgotEmail(e.target.value)
              setRecoverySent(false)
              setRecoveryNotice('')
            }}
            placeholder="admin@trythemenu.com"
            autoComplete="email"
            required
            className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10"
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full rounded-xl font-semibold" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending reset link...
          </>
        ) : (
          'Send password reset link'
        )}
      </Button>

      {recoverySent && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-700">
          {recoveryNotice}
        </p>
      )}

      <p className="text-center text-xs leading-5 text-slate-500">
        Remembered your password?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-primary transition hover:text-primary-hover"
        >
          Back to login
        </button>
      </p>
    </form>
  )
}
