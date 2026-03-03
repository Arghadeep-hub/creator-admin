import { useState } from 'react'
import {
  Save, Key, Bell, Shield, Eye, EyeOff,
  CheckCircle2, AlertCircle, LogOut, Monitor, Globe,
  MapPin, Phone, Pencil, BadgeCheck,
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

// ── Section header ───────────────────────────────────────────────────────────
function SectionIcon({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${bg}`}>
      {children}
    </span>
  )
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
    <div className="w-full space-y-4 pb-10">

      {/* ══════════════════════════════════════════════════════
          HERO CARD
         ══════════════════════════════════════════════════════ */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">

        {/* ── Cover banner — muted, professional ── */}
        <div className="h-28 sm:h-36 bg-linear-to-br from-slate-800 via-slate-700 to-indigo-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.15),transparent_55%)]" />
        </div>

        {/* ── Profile info ── */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-5">

          {/* Avatar row — overlaps banner */}
          <div className="flex justify-center sm:justify-start -mt-12 sm:-mt-14 mb-3 sm:mb-0">
            <div className="relative">
              <Avatar
                name={session?.name ?? ''}
                className="h-24 w-24 sm:h-28 sm:w-28 text-2xl sm:text-3xl ring-4 ring-white shadow-lg shrink-0"
              />
              {/* Online indicator */}
              {adminData?.isActive && (
                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-[2.5px] ring-white" />
              )}
            </div>
          </div>

          {/* Identity + actions — stacked mobile, side-by-side desktop */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 sm:-mt-8 sm:ml-32">

            {/* Left: identity */}
            <div className="text-center sm:text-left min-w-0 sm:pt-1">
              {/* Name + role */}
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight leading-tight">{session?.name}</h2>
                <RoleBadge role={session?.role ?? 'admin'} />
              </div>

              {/* Headline — department at company */}
              {profile.department && (
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  {profile.department} at <span className="font-medium text-foreground">TryTheMenu</span>
                </p>
              )}

              {/* Location + contact */}
              <div className="flex items-center justify-center sm:justify-start gap-x-3 gap-y-1 flex-wrap mt-2 text-xs text-muted-foreground">
                {adminData?.managedCities && adminData.managedCities.length > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {adminData.managedCities.join(', ')}
                  </span>
                )}
                {profile.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3 shrink-0" />
                    {profile.phone}
                  </span>
                )}
              </div>

              {/* Email — verified indicator */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1.5">
                <a href={`mailto:${session?.email}`} className="text-xs text-indigo-600 hover:underline">
                  {session?.email}
                </a>
                <BadgeCheck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              </div>

              {/* Last active — security signal */}
              <p className="text-[11px] text-muted-foreground mt-1.5">
                {joinedDate && <>Joined {joinedDate} · </>}
                Last active {lastLogin}
              </p>
            </div>

            {/* Right: actions — labelled, functional */}
            <div className="flex items-center gap-2 justify-center sm:justify-end shrink-0 pt-0 sm:pt-1">
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs px-4 flex-1 sm:flex-initial"
                onClick={() => document.getElementById('prof-name')?.focus()}
              >
                <Pencil className="h-3 w-3" />Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs px-4 flex-1 sm:flex-initial"
                onClick={() => document.getElementById('section-security')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Key className="h-3 w-3" />Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          ROW 1: Edit Profile + Change Password
         ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Edit Profile */}
        <Card id="section-profile">
          <CardHeader className="px-4 sm:px-6 pb-3 pt-4 sm:pt-6">
            <CardTitle className="flex items-center gap-2.5 text-sm font-semibold">
              <SectionIcon bg="bg-orange-50">
                <svg className="h-3.5 w-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </SectionIcon>
              Edit Profile
            </CardTitle>
            <CardDescription className="text-xs">Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3">
            {/* Stack on mobile, 2-col on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prof-name" className="text-xs font-medium">Full Name</Label>
                <Input
                  id="prof-name"
                  value={profile.name}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="prof-email" className="text-xs font-medium">Email</Label>
                  <span className="text-[10px] text-muted-foreground bg-slate-100 px-1.5 py-0.5 rounded">Read-only</span>
                </div>
                <Input
                  id="prof-email"
                  value={profile.email}
                  readOnly
                  className="h-10 text-sm bg-slate-50 text-muted-foreground cursor-not-allowed select-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prof-phone" className="text-xs font-medium">Phone Number</Label>
                <Input
                  id="prof-phone"
                  value={profile.phone}
                  onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prof-dept" className="text-xs font-medium">Department</Label>
                <Input
                  id="prof-dept"
                  value={profile.department}
                  onChange={e => setProfile(p => ({ ...p, department: e.target.value }))}
                  placeholder="e.g. Campaign Ops"
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {isDirty ? (
                <p className="text-[11px] text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />Unsaved changes
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />Saved
                </p>
              )}
              <Button onClick={handleProfileSave} disabled={!isDirty || savingProfile} size="sm" className="h-9 text-xs px-4">
                {savingProfile ? 'Saving…' : <><Save className="h-3.5 w-3.5" />Save</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
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
      </div>

      {/* ══════════════════════════════════════════════════════
          ROW 2: Notifications + Security
         ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Notifications */}
        <Card id="section-notifications">
          <CardHeader className="px-4 sm:px-6 pb-3 pt-4 sm:pt-6">
            <CardTitle className="flex items-center gap-2.5 text-sm font-semibold">
              <SectionIcon bg="bg-amber-50">
                <Bell className="h-3.5 w-3.5 text-amber-500" />
              </SectionIcon>
              Notifications
            </CardTitle>
            <CardDescription className="text-xs">Choose which events trigger alerts.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-0 -mx-1">
              {NOTIF_ITEMS.map(item => {
                const p = PRIORITY[item.priority]
                return (
                  <div key={item.key} className="flex items-center justify-between px-1 py-3 border-b border-slate-50 last:border-0">
                    <div className="pr-4 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-xs font-semibold">{item.label}</p>
                        <Badge variant={p.variant} className="text-[9px] px-1.5 py-0 shrink-0 leading-4">{p.label}</Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifs[item.key]}
                      onCheckedChange={v => setNotifs(s => ({ ...s, [item.key]: v }))}
                      className="shrink-0"
                    />
                  </div>
                )
              })}
            </div>
            <div className="pt-3">
              <Button size="sm" className="h-9 text-xs" onClick={() => success('Preferences saved', 'Your notification settings have been updated.')}>
                <Save className="h-3.5 w-3.5" />Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Session + Sign Out */}
        <Card id="section-sessions">
          <CardHeader className="px-4 sm:px-6 pb-3 pt-4 sm:pt-6">
            <CardTitle className="flex items-center gap-2.5 text-sm font-semibold">
              <SectionIcon bg="bg-emerald-50">
                <Shield className="h-3.5 w-3.5 text-emerald-600" />
              </SectionIcon>
              Security
            </CardTitle>
            <CardDescription className="text-xs">Session info and account actions.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3">
            {/* Current session */}
            <div className="flex items-start gap-3 p-3.5 border border-emerald-200 bg-emerald-50/40 rounded-xl">
              <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 animate-pulse" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-semibold text-xs text-emerald-800">Current Session</p>
                  <Badge variant="success" className="text-[9px] px-1.5 py-0 leading-4">Active</Badge>
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">Logged in {lastLogin}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Monitor className="h-3 w-3 shrink-0" />Chrome on macOS
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3 shrink-0" />192.168.1.42
                  </span>
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-red-100 bg-red-50/30">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-red-700">Sign out everywhere</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Revokes all device sessions.</p>
              </div>
              <Button variant="destructive" size="sm" onClick={logout} className="shrink-0 h-9 text-xs px-3.5">
                <LogOut className="h-3.5 w-3.5" />Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
