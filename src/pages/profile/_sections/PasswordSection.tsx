import { useState } from 'react'
import { Key, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/contexts/ToastContext'

// ── Helpers ──────────────────────────────────────────────────────────────────

function getPasswordStrength(pwd: string) {
  if (!pwd) return { score: 0, label: '', color: '' }
  let score = 0
  if (pwd.length >= 8)            score++
  if (pwd.length >= 12)           score++
  if (/[A-Z]/.test(pwd))         score++
  if (/[0-9]/.test(pwd))         score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 1) return { score, label: 'Weak',        color: 'bg-red-500' }
  if (score <= 2) return { score, label: 'Fair',        color: 'bg-orange-400' }
  if (score <= 3) return { score, label: 'Good',        color: 'bg-yellow-400' }
  if (score <= 4) return { score, label: 'Strong',      color: 'bg-emerald-400' }
  return              { score, label: 'Very Strong', color: 'bg-emerald-500' }
}

function PasswordInput({ id, value, onChange, placeholder }: {
  id?: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? '••••••••'}
        className="pr-10 h-10"
      />
      <button
        type="button" tabIndex={-1}
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

function SectionIcon({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${bg}`}>
      {children}
    </span>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PasswordSection() {
  const { success, error } = useToast()

  const [curPwd,  setCurPwd]  = useState('')
  const [newPwd,  setNewPwd]  = useState('')
  const [confPwd, setConfPwd] = useState('')
  const strength       = getPasswordStrength(newPwd)
  const passwordsMatch = !!confPwd && newPwd === confPwd

  function handlePasswordChange() {
    if (!passwordsMatch) { error('Passwords do not match', 'Make sure both fields are identical.'); return }
    if (strength.score < 2) { error('Password too weak', 'Please choose a stronger password.'); return }
    success('Password updated', 'Your password has been changed successfully.')
    setCurPwd(''); setNewPwd(''); setConfPwd('')
  }

  return (
    <Card id="section-security">
      <CardHeader className="px-4 sm:px-6 pb-3 pt-4 sm:pt-6">
        <CardTitle className="flex items-center gap-2.5 text-sm font-semibold">
          <SectionIcon bg="bg-blue-50">
            <Key className="h-3.5 w-3.5 text-blue-500" />
          </SectionIcon>
          Change Password
        </CardTitle>
        <CardDescription className="text-xs">Use a strong, unique password.</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="cur-pwd" className="text-xs font-medium">Current Password</Label>
          <PasswordInput id="cur-pwd" value={curPwd} onChange={setCurPwd} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-pwd" className="text-xs font-medium">New Password</Label>
          <PasswordInput id="new-pwd" value={newPwd} onChange={setNewPwd} />
          {newPwd && (
            <div className="space-y-1 mt-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-slate-200'}`} />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Strength: <span className="font-medium">{strength.label}</span>
                {strength.score < 3 && ' · Add uppercase, numbers or symbols'}
              </p>
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="conf-pwd" className="text-xs font-medium">Confirm Password</Label>
          <PasswordInput id="conf-pwd" value={confPwd} onChange={setConfPwd} />
          {confPwd && (
            <p className={`text-[10px] flex items-center gap-1 mt-1 ${passwordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
              {passwordsMatch
                ? <><CheckCircle2 className="h-3 w-3 shrink-0" />Passwords match</>
                : <><AlertCircle  className="h-3 w-3 shrink-0" />Passwords do not match</>
              }
            </p>
          )}
        </div>
        <Button
          onClick={handlePasswordChange}
          disabled={!curPwd || !newPwd || !confPwd || !passwordsMatch}
          className="w-full h-10 text-sm mt-1"
        >
          <Key className="h-3.5 w-3.5" />Update Password
        </Button>
      </CardContent>
    </Card>
  )
}
