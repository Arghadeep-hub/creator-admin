import { useState } from 'react'
import {
  Save, Key, Bell, Shield, Eye, EyeOff,
  CheckCircle2, AlertCircle, LogOut, Monitor, Globe,
  MapPin, Phone, Building2, CalendarDays,
} from 'lucide-react'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { MOCK_ADMINS } from '@/data/admins'

// ── Password strength ───────────────────────────────────────────────────────
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

// ── Show/hide password input ────────────────────────────────────────────────
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
        className="pr-10"
      />
      <button
        type="button" tabIndex={-1}
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

// ── Notification config ─────────────────────────────────────────────────────
const NOTIF_ITEMS = [
  { key: 'payouts',     label: 'Failed Payouts',    desc: 'Critical alerts for payment failures',      priority: 'critical' },
  { key: 'fraud',       label: 'Fraud Flags',        desc: 'Immediate alerts for suspicious activity',  priority: 'critical' },
  { key: 'submissions', label: 'New Submissions',    desc: 'When creators submit new reels',            priority: 'high'     },
  { key: 'kyc',         label: 'KYC Applications',   desc: 'New identity verification requests',        priority: 'high'     },
  { key: 'campaigns',   label: 'Campaign Expiring',  desc: 'Reminders 48h before expiry',              priority: 'normal'   },
] as const

const PRIORITY = {
  critical: { label: 'Critical', variant: 'error'     as const },
  high:     { label: 'High',     variant: 'warning'   as const },
  normal:   { label: 'Normal',   variant: 'secondary' as const },
}

// ── Page ────────────────────────────────────────────────────────────────────
export function ProfilePage() {
  const { session, logout } = useAuth()
  const { success, error }  = useToast()

  const adminData = MOCK_ADMINS.find(a => a.id === session?.userId)

  // Profile state
  const initial = {
    name:       session?.name         ?? '',
    email:      session?.email        ?? '',
    phone:      adminData?.phone      ?? '',
    department: adminData?.department ?? '',
  }
  const [profile,       setProfile]       = useState(initial)
  const [savingProfile, setSavingProfile] = useState(false)
  const isDirty = JSON.stringify(profile) !== JSON.stringify(initial)

  // Password state
  const [curPwd,  setCurPwd]  = useState('')
  const [newPwd,  setNewPwd]  = useState('')
  const [confPwd, setConfPwd] = useState('')
  const strength      = getPasswordStrength(newPwd)
  const passwordsMatch = !!confPwd && newPwd === confPwd

  // Notification state
  const [notifs, setNotifs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_ITEMS.map(n => [n.key, true]))
  )

  function handleProfileSave() {
    setSavingProfile(true)
    setTimeout(() => { setSavingProfile(false); success('Profile updated', 'Your changes have been saved.') }, 600)
  }

  function handlePasswordChange() {
    if (!passwordsMatch) { error('Passwords do not match', 'Make sure both fields are identical.'); return }
    if (strength.score < 2) { error('Password too weak', 'Please choose a stronger password.'); return }
    success('Password updated', 'Your password has been changed successfully.')
    setCurPwd(''); setNewPwd(''); setConfPwd('')
  }

  const joinedDate = adminData?.createdAt
    ? new Date(adminData.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : null

  const lastLogin = adminData?.lastLoginAt
    ? new Date(adminData.lastLoginAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'just now'

  return (
    <div className="w-full space-y-4 pb-8">

      {/* ══════════════════════════════════════════════════════
          HERO CARD — Compact cover + avatar + meta
         ══════════════════════════════════════════════════════ */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
        {/* Slim cover gradient */}
        <div className="h-20 sm:h-24 bg-linear-to-br from-orange-400 via-rose-400 to-pink-500 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        </div>

        <div className="px-5 pb-5">
          {/* Avatar row — bleeds over cover */}
          <div className="flex items-end gap-4 -mt-8">
            <Avatar
              name={session?.name ?? ''}
              className="h-16 w-16 sm:h-20 sm:w-20 text-xl ring-[3px] ring-white shadow-md shrink-0"
            />
            <div className="flex-1 min-w-0 pb-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold tracking-tight truncate">{session?.name}</h2>
                <RoleBadge role={session?.role ?? 'admin'} />
              </div>
              <p className="text-sm text-muted-foreground truncate">{session?.email}</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 hidden sm:inline-flex" onClick={() => document.getElementById('prof-name')?.focus()}>
              Edit Profile
            </Button>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 pt-3 border-t border-slate-100">
            {profile.department && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building2 className="h-3 w-3 text-slate-400" />
                {profile.department}
              </span>
            )}
            {profile.phone && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="h-3 w-3 text-slate-400" />
                {profile.phone}
              </span>
            )}
            {adminData?.managedCities && adminData.managedCities.length > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 text-slate-400" />
                {adminData.managedCities.slice(0, 2).join(', ')}
                {adminData.managedCities.length > 2 && ` +${adminData.managedCities.length - 2}`}
              </span>
            )}
            {joinedDate && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3 text-slate-400" />
                Joined {joinedDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          ROW 1: Edit Profile + Change Password (side by side)
         ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Edit Profile */}
        <Card id="section-profile">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-50">
                <svg className="h-3.5 w-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </span>
              Edit Profile
            </CardTitle>
            <CardDescription className="text-xs">Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prof-name" className="text-xs">Full Name</Label>
                <Input
                  id="prof-name"
                  value={profile.name}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="prof-email" className="text-xs">Email</Label>
                  <span className="text-[10px] text-muted-foreground">Read-only</span>
                </div>
                <Input
                  id="prof-email"
                  value={profile.email}
                  readOnly
                  className="h-9 text-sm bg-slate-50 text-muted-foreground cursor-not-allowed select-none"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="prof-phone" className="text-xs">Phone Number</Label>
                <Input
                  id="prof-phone"
                  value={profile.phone}
                  onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="prof-dept" className="text-xs">Department</Label>
                <Input
                  id="prof-dept"
                  value={profile.department}
                  onChange={e => setProfile(p => ({ ...p, department: e.target.value }))}
                  placeholder="e.g. Campaign Ops"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {isDirty ? (
                <p className="text-[11px] text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />Unsaved changes
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />Saved
                </p>
              )}
              <Button onClick={handleProfileSave} disabled={!isDirty || savingProfile} size="sm" className="h-8 text-xs">
                {savingProfile ? 'Saving…' : <><Save className="h-3 w-3" />Save</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card id="section-security">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50">
                <Key className="h-3.5 w-3.5 text-blue-500" />
              </span>
              Change Password
            </CardTitle>
            <CardDescription className="text-xs">Use a strong, unique password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="cur-pwd" className="text-xs">Current Password</Label>
              <PasswordInput id="cur-pwd" value={curPwd} onChange={setCurPwd} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new-pwd" className="text-xs">New Password</Label>
              <PasswordInput id="new-pwd" value={newPwd} onChange={setNewPwd} />
              {newPwd && (
                <div className="space-y-0.5 mt-1">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Strength: <span className="font-medium">{strength.label}</span>
                    {strength.score < 3 && ' · Add uppercase, numbers or symbols'}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="conf-pwd" className="text-xs">Confirm Password</Label>
              <PasswordInput id="conf-pwd" value={confPwd} onChange={setConfPwd} />
              {confPwd && (
                <p className={`text-[10px] flex items-center gap-1 mt-0.5 ${passwordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                  {passwordsMatch
                    ? <><CheckCircle2 className="h-3 w-3" />Passwords match</>
                    : <><AlertCircle  className="h-3 w-3" />Passwords do not match</>
                  }
                </p>
              )}
            </div>
            <Button
              onClick={handlePasswordChange}
              disabled={!curPwd || !newPwd || !confPwd || !passwordsMatch}
              className="w-full h-9 text-sm"
            >
              <Key className="h-3.5 w-3.5" />Update Password
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════
          ROW 2: Notifications + Security (side by side)
         ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Notifications */}
        <Card id="section-notifications">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50">
                <Bell className="h-3.5 w-3.5 text-amber-500" />
              </span>
              Notifications
            </CardTitle>
            <CardDescription className="text-xs">Choose which events trigger alerts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {NOTIF_ITEMS.map(item => {
                const p = PRIORITY[item.priority]
                return (
                  <div key={item.key} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                    <div className="pr-3 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold truncate">{item.label}</p>
                        <Badge variant={p.variant} className="text-[9px] px-1.5 py-0 shrink-0">{p.label}</Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifs[item.key]}
                      onCheckedChange={v => setNotifs(s => ({ ...s, [item.key]: v }))}
                    />
                  </div>
                )
              })}
            </div>
            <div className="pt-3">
              <Button size="sm" className="h-8 text-xs" onClick={() => success('Preferences saved', 'Your notification settings have been updated.')}>
                <Save className="h-3 w-3" />Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Session + Sign Out */}
        <Card id="section-sessions">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50">
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
              </span>
              Security
            </CardTitle>
            <CardDescription className="text-xs">Session info and account actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Current session */}
            <div className="flex items-start gap-2.5 p-3 border border-emerald-200 bg-emerald-50/40 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 animate-pulse" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-xs text-emerald-800">Current Session</p>
                  <Badge variant="success" className="text-[9px] px-1.5 py-0">Active</Badge>
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5">Logged in {lastLogin}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Monitor className="h-3 w-3" />Chrome on macOS
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3" />192.168.1.42
                  </span>
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-red-100 bg-red-50/30">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-red-700">Sign out everywhere</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Revokes all device sessions.</p>
              </div>
              <Button variant="destructive" size="sm" onClick={logout} className="shrink-0 h-8 text-xs">
                <LogOut className="h-3 w-3" />Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
