import { useState } from 'react'
import { Save, Key, Bell, Shield, User } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { MOCK_ADMINS } from '@/data/admins'

export function ProfilePage() {
  const { session, logout } = useAuth()
  const { success, error } = useToast()
  const [tab, setTab] = useState('profile')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const adminData = MOCK_ADMINS.find(a => a.id === session?.userId)

  const [profile, setProfile] = useState({
    name: session?.name ?? '',
    email: session?.email ?? '',
    phone: adminData?.phone ?? '',
    department: adminData?.department ?? '',
  })

  function handlePasswordChange() {
    if (newPassword !== confirmPassword) {
      error('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      error('Password must be at least 8 characters')
      return
    }
    success('Password updated', 'Your password has been changed.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <PageHeader title="Profile & Settings" subtitle="Manage your account" />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="profile"><User className="h-3.5 w-3.5 mr-1" />Profile</TabsTrigger>
          <TabsTrigger value="security"><Key className="h-3.5 w-3.5 mr-1" />Security</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-3.5 w-3.5 mr-1" />Notifications</TabsTrigger>
          <TabsTrigger value="sessions"><Shield className="h-3.5 w-3.5 mr-1" />Sessions</TabsTrigger>
        </TabsList>

        {/* ── Profile ── */}
        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar name={session?.name ?? ''} size="xl" />
                <div>
                  <p className="font-bold text-lg">{session?.name}</p>
                  <p className="text-sm text-muted-foreground">{session?.email}</p>
                  <RoleBadge role={session?.role ?? 'admin'} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                {[
                  { label: 'Full Name', field: 'name' as const },
                  { label: 'Email', field: 'email' as const },
                  { label: 'Phone', field: 'phone' as const },
                  { label: 'Department', field: 'department' as const },
                ].map(row => (
                  <div key={row.field} className="space-y-1.5">
                    <Label>{row.label}</Label>
                    <Input
                      value={profile[row.field]}
                      onChange={e => setProfile(p => ({ ...p, [row.field]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <Button onClick={() => success('Profile updated')}>
                <Save className="h-4 w-4" />Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Security ── */}
        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button onClick={handlePasswordChange} disabled={!currentPassword || !newPassword || !confirmPassword}>
                <Key className="h-4 w-4" />Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notifications ── */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'New Submissions', desc: 'Get notified when creators submit new reels' },
                { label: 'KYC Applications', desc: 'Alerts for new KYC submissions' },
                { label: 'Failed Payouts', desc: 'Critical alerts for payment failures' },
                { label: 'Campaign Expiring', desc: 'Reminders when campaigns are about to expire' },
                { label: 'Fraud Flags', desc: 'Immediate alerts for fraud detection' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
              <Button onClick={() => success('Notification preferences saved')}>
                <Save className="h-4 w-4" />Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Sessions ── */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader><CardTitle>Active Session</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="admin-card p-4 border-2 border-emerald-200 bg-emerald-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-emerald-800">Current Session</p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      Logged in {session?.loginAt ? new Date(session.loginAt).toLocaleString('en-IN') : 'just now'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">192.168.1.42 · Chrome on macOS</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm font-semibold text-red-600 mb-2">Danger Zone</p>
                <Button variant="destructive" onClick={() => { logout() }}>
                  Sign Out of All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
