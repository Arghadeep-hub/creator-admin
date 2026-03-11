import { lazy, Suspense, useState } from 'react'
import { Save, Shield } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { PageLoader } from '@/components/ui/PageLoader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetFraudRulesQuery,
  useUpdateFraudRuleMutation,
  useGetBadgesQuery,
  useUpdateBadgeMutation,
} from '@/store/api/settingsApi'
import type { PlatformSettings } from '@/types'

const FraudRuleEditor  = lazy(() => import('./_sections/FraudRuleEditor'))
const BadgeEditor      = lazy(() => import('./_sections/BadgeEditor'))
const LocationManager  = lazy(() => import('./_sections/LocationManager'))

const TAB_FALLBACK = <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />

export function SettingsPage() {
  const { session } = useAuth()
  const { success, error } = useToast()
  const [tab, setTab] = useState('general')

  const { data: remoteSettings, isLoading: isSettingsLoading } = useGetSettingsQuery()
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation()

  const { data: fraudRules = [], isLoading: isFraudLoading } = useGetFraudRulesQuery()
  const [updateFraudRule] = useUpdateFraudRuleMutation()

  const { data: badges = [], isLoading: isBadgesLoading } = useGetBadgesQuery()
  const [updateBadge] = useUpdateBadgeMutation()

  // Local draft of settings — synced from server on load
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  if (remoteSettings && !settings) {
    setSettings({
      general: remoteSettings.general ?? { platformName: '', supportEmail: '', supportPhone: '', timezone: '', currencyFormat: '' },
      campaignDefaults: remoteSettings.campaignDefaults ?? { defaultPayoutMin: 0, defaultPayoutMax: 0, defaultRequiredViews: 0, defaultCheckInRadius: 0, defaultDeadlineDays: 0, autoExpireAfterDeadline: false },
      verification: remoteSettings.verification ?? { windowHours: 0, autoApproveThreshold: 0, fraudSensitivity: 'medium', postDeletionPenaltyPercent: 0, captionEditPenaltyPercent: 0 },
      payout: remoteSettings.payout ?? { minWithdrawalAmount: 0, processingDelayHours: 0, dailyTransactionLimit: 0, autoRetryFailed: false, maxRetries: 0 },
      trustScore: remoteSettings.trustScore,
      notifications: remoteSettings.notifications,
    })
  }

  if (session?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-600">Super Admin access required</p>
        </div>
      </div>
    )
  }

  if (isSettingsLoading || isFraudLoading || isBadgesLoading) return <PageLoader />
  if (!settings) return null

  async function saveTab() {
    if (!settings) return
    try {
      await updateSettings(settings).unwrap()
      success('Settings saved', `${tab.replace(/_/g, ' ')} settings updated`)
    } catch {
      error('Failed to save settings')
    }
  }

  function updateGeneral(field: string, value: string) {
    setSettings(s => s ? ({ ...s, general: { ...s.general, [field]: value } }) : s)
  }

  function updateVerification(field: string, value: string | number) {
    setSettings(s => s ? ({ ...s, verification: { ...s.verification, [field]: value } }) : s)
  }

  function updatePayout(field: string, value: number | boolean) {
    setSettings(s => s ? ({ ...s, payout: { ...s.payout, [field]: value } }) : s)
  }

  async function toggleFraudRule(id: string, currentActive: boolean) {
    try {
      await updateFraudRule({ id, body: { isActive: !currentActive } }).unwrap()
      success(`Fraud rule ${currentActive ? 'disabled' : 'enabled'}`)
    } catch {
      error('Failed to update fraud rule')
    }
  }

  async function toggleBadge(id: string, currentActive: boolean) {
    try {
      await updateBadge({ id, body: { isActive: !currentActive } }).unwrap()
      success(`Badge ${currentActive ? 'disabled' : 'enabled'}`)
    } catch {
      error('Failed to update badge')
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Platform Settings" subtitle="Configure platform-wide behavior and defaults">
        <Button onClick={saveTab} disabled={isSaving}>
          <Save className="h-4 w-4" />{isSaving ? 'Saving…' : 'Save Changes'}
        </Button>
      </PageHeader>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="campaign">Campaign Defaults</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="trust">Trust Score</TabsTrigger>
          <TabsTrigger value="payout">Payout</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Rules</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        {/* ── General ── */}
        <TabsContent value="general">
          <Card>
            <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              {[
                { label: 'Platform Name', field: 'platformName', type: 'text' },
                { label: 'Support Email', field: 'supportEmail', type: 'email' },
                { label: 'Support Phone', field: 'supportPhone', type: 'tel' },
                { label: 'Timezone', field: 'timezone', type: 'text' },
                { label: 'Currency Format', field: 'currencyFormat', type: 'text' },
              ].map(row => (
                <div key={row.field} className="space-y-1.5">
                  <Label>{row.label}</Label>
                  <Input
                    type={row.type}
                    value={(settings.general as Record<string, string>)[row.field]}
                    onChange={e => updateGeneral(row.field, e.target.value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Campaign Defaults ── */}
        <TabsContent value="campaign">
          <Card>
            <CardHeader><CardTitle>Campaign Defaults</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Min Payout (₹)', field: 'defaultPayoutMin' },
                  { label: 'Max Payout (₹)', field: 'defaultPayoutMax' },
                  { label: 'Required Views', field: 'defaultRequiredViews' },
                  { label: 'GPS Radius (m)', field: 'defaultCheckInRadius' },
                  { label: 'Deadline (days)', field: 'defaultDeadlineDays' },
                ].map(row => (
                  <div key={row.field} className="space-y-1.5">
                    <Label>{row.label}</Label>
                    <Input
                      type="number"
                      value={(settings.campaignDefaults as unknown as Record<string, number>)[row.field]}
                      onChange={e => setSettings(s => s ? ({ ...s, campaignDefaults: { ...s.campaignDefaults, [row.field]: +e.target.value } }) : s)}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <p className="text-sm font-medium">Auto-expire campaigns after deadline</p>
                  <p className="text-xs text-muted-foreground">Automatically set status to 'expired' after deadline</p>
                </div>
                <Switch
                  checked={settings.campaignDefaults.autoExpireAfterDeadline}
                  onCheckedChange={v => setSettings(s => s ? ({ ...s, campaignDefaults: { ...s.campaignDefaults, autoExpireAfterDeadline: v } }) : s)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Verification ── */}
        <TabsContent value="verification">
          <Card>
            <CardHeader><CardTitle>Verification Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Verification Window (h)', field: 'windowHours' },
                  { label: 'Auto-Approve Threshold', field: 'autoApproveThreshold' },
                  { label: 'Post Deletion Penalty (%)', field: 'postDeletionPenaltyPercent' },
                  { label: 'Caption Edit Penalty (%)', field: 'captionEditPenaltyPercent' },
                ].map(row => (
                  <div key={row.field} className="space-y-1.5">
                    <Label>{row.label}</Label>
                    <Input
                      type="number"
                      value={(settings.verification as Record<string, number | string>)[row.field] as number}
                      onChange={e => updateVerification(row.field, +e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <Label>Fraud Sensitivity</Label>
                <Select
                  value={settings.verification.fraudSensitivity}
                  onValueChange={v => updateVerification('fraudSensitivity', v)}
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Trust Score ── */}
        <TabsContent value="trust">
          <Card>
            <CardHeader>
              <CardTitle>Trust Score Formula</CardTitle>
              {settings.trustScore && (
                <p className="text-xs text-muted-foreground mt-1">
                  Weights must sum to 100%: KYC {settings.trustScore.kycWeight}% + Approval Rate {settings.trustScore.approvalRateWeight}% + Integrity {settings.trustScore.integrityWeight}% + Leaderboard {settings.trustScore.leaderboardWeight}% = {settings.trustScore.kycWeight + settings.trustScore.approvalRateWeight + settings.trustScore.integrityWeight + settings.trustScore.leaderboardWeight}%
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              {!settings.trustScore ? (
                <p className="text-sm text-muted-foreground">Trust score settings not configured.</p>
              ) : [
                { label: 'KYC Weight (%)', field: 'kycWeight' },
                { label: 'Approval Rate Weight (%)', field: 'approvalRateWeight' },
                { label: 'Integrity Weight (%)', field: 'integrityWeight' },
                { label: 'Leaderboard Weight (%)', field: 'leaderboardWeight' },
                { label: 'Premium Campaign Min Score', field: 'premiumCampaignMinScore' },
              ].map(row => (
                <div key={row.field} className="space-y-1.5">
                  <Label>{row.label}</Label>
                  <Input
                    type="number"
                    value={(settings.trustScore as Record<string, number>)[row.field]}
                    onChange={e => setSettings(s => s ? ({ ...s, trustScore: { ...s.trustScore!, [row.field]: +e.target.value } }) : s)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Payout ── */}
        <TabsContent value="payout">
          <Card>
            <CardHeader><CardTitle>Payout Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Min Withdrawal (₹)', field: 'minWithdrawalAmount' },
                  { label: 'Processing Delay (h)', field: 'processingDelayHours' },
                  { label: 'Daily Transaction Limit', field: 'dailyTransactionLimit' },
                  { label: 'Max Retries', field: 'maxRetries' },
                ].map(row => (
                  <div key={row.field} className="space-y-1.5">
                    <Label>{row.label}</Label>
                    <Input
                      type="number"
                      value={(settings.payout as Record<string, number | boolean>)[row.field] as number}
                      onChange={e => updatePayout(row.field, +e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <p className="text-sm font-medium">Auto-retry failed payouts</p>
                  <p className="text-xs text-muted-foreground">Automatically retry failed transactions</p>
                </div>
                <Switch
                  checked={settings.payout.autoRetryFailed}
                  onCheckedChange={v => updatePayout('autoRetryFailed', v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notifications ── */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              {!settings.notifications ? (
                <p className="text-sm text-muted-foreground">Notification settings not configured.</p>
              ) : <>
                {[
                  { label: 'Email Notifications', field: 'emailEnabled', desc: 'Send email alerts for important events' },
                  { label: 'Push Notifications', field: 'pushEnabled', desc: 'Browser push notifications' },
                ].map(row => (
                  <div key={row.field} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="text-sm font-medium">{row.label}</p>
                      <p className="text-xs text-muted-foreground">{row.desc}</p>
                    </div>
                    <Switch
                      checked={(settings.notifications as unknown as Record<string, boolean>)[row.field]}
                      onCheckedChange={v => setSettings(s => s ? ({ ...s, notifications: { ...s.notifications!, [row.field]: v } }) : s)}
                    />
                  </div>
                ))}
                <div className="space-y-2 mt-2">
                  <p className="text-sm font-semibold">Notification Events</p>
                  {Object.entries(settings.notifications.events).map(([key, enabled]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="capitalize">{key.replace(/_/g, ' ')}</Label>
                      <Switch
                        checked={enabled}
                        onCheckedChange={v => setSettings(s => s ? ({
                          ...s,
                          notifications: { ...s.notifications!, events: { ...s.notifications!.events, [key]: v } }
                        }) : s)}
                      />
                    </div>
                  ))}
                </div>
              </>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Fraud Rules — lazy ── */}
        <TabsContent value="fraud">
          <Suspense fallback={TAB_FALLBACK}>
            <FraudRuleEditor fraudRules={fraudRules} onToggle={toggleFraudRule} />
          </Suspense>
        </TabsContent>

        {/* ── Badges — lazy ── */}
        <TabsContent value="badges">
          <Suspense fallback={TAB_FALLBACK}>
            <BadgeEditor badges={badges} onToggle={toggleBadge} />
          </Suspense>
        </TabsContent>

        {/* ── Locations — lazy ── */}
        <TabsContent value="locations">
          <Suspense fallback={TAB_FALLBACK}>
            <LocationManager />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
