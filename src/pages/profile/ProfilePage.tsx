import { lazy, Suspense, useState } from 'react'
import {
  Save, AlertCircle, CheckCircle2,
  Phone, Pencil, Key, BadgeCheck,
} from 'lucide-react'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'

// ── Lazy-loaded sections ──────────────────────────────────────────────────────
const PasswordSection = lazy(() =>
  import('./_sections/PasswordSection').then(m => ({ default: m.PasswordSection }))
)
const NotificationPrefsSection = lazy(() =>
  import('./_sections/NotificationPrefsSection').then(m => ({ default: m.NotificationPrefsSection }))
)
const SecuritySection = lazy(() =>
  import('./_sections/SecuritySection').then(m => ({ default: m.SecuritySection }))
)

function SectionSkeleton() {
  return <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />
}

// ── Section header icon ───────────────────────────────────────────────────────
function SectionIcon({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${bg}`}>
      {children}
    </span>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export function ProfilePage() {
  const { session, logout } = useAuth()
  const { success }         = useToast()

  // Profile state
  const initial = {
    name:       session?.name  ?? '',
    email:      session?.email ?? '',
    phone:      '',
    department: '',
  }
  const [profile,       setProfile]       = useState(initial)
  const [savingProfile, setSavingProfile] = useState(false)
  const isDirty = JSON.stringify(profile) !== JSON.stringify(initial)

  function handleProfileSave() {
    setSavingProfile(true)
    setTimeout(() => { setSavingProfile(false); success('Profile updated', 'Your changes have been saved.') }, 600)
  }

  const joinedDate = session?.loginAt
    ? new Date(session.loginAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : null

  const lastLogin = session?.loginAt
    ? new Date(session.loginAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'just now'

  return (
    <div className="w-full space-y-4 pb-10">

      {/* ══════════════════════════════════════════════════════
          HERO CARD
         ══════════════════════════════════════════════════════ */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">

        {/* ── Cover banner ── */}
        <div className="h-28 sm:h-36 bg-linear-to-br from-slate-800 via-slate-700 to-indigo-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.15),transparent_55%)]" />
        </div>

        {/* ── Profile info ── */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-5">

          {/* Avatar row */}
          <div className="flex justify-center sm:justify-start -mt-12 sm:-mt-14 mb-3 sm:mb-0">
            <div className="relative">
              <Avatar
                name={session?.name ?? ''}
                className="h-24 w-24 sm:h-28 sm:w-28 text-2xl sm:text-3xl ring-4 ring-white shadow-lg shrink-0"
              />
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-[2.5px] ring-white" />
            </div>
          </div>

          {/* Identity + actions */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 sm:-mt-8 sm:ml-32">

            {/* Left: identity */}
            <div className="text-center sm:text-left min-w-0 sm:pt-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight leading-tight">{session?.name}</h2>
                <RoleBadge role={session?.role ?? 'admin'} />
              </div>

              {profile.department && (
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  {profile.department} at <span className="font-medium text-foreground">TryTheMenu</span>
                </p>
              )}

              <div className="flex items-center justify-center sm:justify-start gap-x-3 gap-y-1 flex-wrap mt-2 text-xs text-muted-foreground">
                {profile.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3 shrink-0" />
                    {profile.phone}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1.5">
                <a href={`mailto:${session?.email}`} className="text-xs text-indigo-600 hover:underline">
                  {session?.email}
                </a>
                <BadgeCheck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              </div>

              <p className="text-[11px] text-muted-foreground mt-1.5">
                {joinedDate && <>Joined {joinedDate} · </>}
                Last active {lastLogin}
              </p>
            </div>

            {/* Right: actions */}
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

        {/* Change Password — lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <PasswordSection />
        </Suspense>
      </div>

      {/* ══════════════════════════════════════════════════════
          ROW 2: Notifications + Security
         ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Notifications — lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <NotificationPrefsSection />
        </Suspense>

        {/* Security — lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <SecuritySection lastLogin={lastLogin} onLogout={logout} />
        </Suspense>
      </div>
    </div>
  )
}
