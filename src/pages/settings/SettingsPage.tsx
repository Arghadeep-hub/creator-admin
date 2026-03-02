import { useState } from 'react'
import { Save, Shield } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { DEFAULT_SETTINGS } from '@/data/settings'
import { MOCK_BADGES } from '@/data/badges'
import { MOCK_FRAUD_RULES } from '@/data/fraud-rules'

export function SettingsPage() {
  const { session } = useAuth()
  const { success } = useToast()
  const [tab, setTab] = useState('general')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

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

  function saveTab() {
    success('Settings saved', `${tab.replace(/_/g, ' ')} settings updated`)
  }

  function updateGeneral(field: string, value: string) {
    setSettings(s => ({ ...s, general: { ...s.general, [field]: value } }))
  }

  function updateVerification(field: string, value: string | number) {
    setSettings(s => ({ ...s, verification: { ...s.verification, [field]: value } }))
  }

  function updatePayout(field: string, value: number | boolean) {
    setSettings(s => ({ ...s, payout: { ...s.payout, [field]: value } }))
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Platform Settings" subtitle="Configure platform-wide behavior and defaults">
        <Button onClick={saveTab}>
          <Save className="h-4 w-4" />Save Changes
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
                      onChange={e => setSettings(s => ({ ...s, campaignDefaults: { ...s.campaignDefaults, [row.field]: +e.target.value } }))}
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
                  onCheckedChange={v => setSettings(s => ({ ...s, campaignDefaults: { ...s.campaignDefaults, autoExpireAfterDeadline: v } }))}
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
              <p className="text-xs text-muted-foreground mt-1">
                Weights must sum to 100%: KYC {settings.trustScore.kycWeight}% + Approval Rate {settings.trustScore.approvalRateWeight}% + Integrity {settings.trustScore.integrityWeight}% + Leaderboard {settings.trustScore.leaderboardWeight}% = {settings.trustScore.kycWeight + settings.trustScore.approvalRateWeight + settings.trustScore.integrityWeight + settings.trustScore.leaderboardWeight}%
              </p>
            </CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              {[
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
                    onChange={e => setSettings(s => ({ ...s, trustScore: { ...s.trustScore, [row.field]: +e.target.value } }))}
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
                    onCheckedChange={v => setSettings(s => ({ ...s, notifications: { ...s.notifications, [row.field]: v } }))}
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
                      onCheckedChange={v => setSettings(s => ({
                        ...s,
                        notifications: { ...s.notifications, events: { ...s.notifications.events, [key]: v } }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Fraud Rules ── */}
        <TabsContent value="fraud">
          <div className="space-y-3">
            {MOCK_FRAUD_RULES.map(rule => (
              <Card key={rule.id}>
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{rule.name}</p>
                      <Badge variant={rule.severity === 'auto_reject' ? 'error' : rule.severity === 'critical' ? 'error' : 'warning'} className="text-xs">
                        {rule.severity}
                      </Badge>
                      <Badge variant="gray" className="text-xs">{rule.penaltyPercent}% penalty</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{rule.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Triggered {rule.timesTriggered} times
                      {rule.lastTriggeredAt && ` · Last: ${new Date(rule.lastTriggeredAt).toLocaleDateString('en-IN')}`}
                    </p>
                  </div>
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => success(`Fraud rule ${rule.isActive ? 'disabled' : 'enabled'}`, rule.name)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Badges ── */}
        <TabsContent value="badges">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_BADGES.map(badge => (
              <Card key={badge.id}>
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{badge.name}</p>
                      <Badge variant="warning" className="text-xs">{badge.totalEarned} earned</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      <span>Criteria: {badge.unlockCriteria.replace(/_/g, ' ')}</span>
                      <span>Threshold: {badge.thresholdValue}</span>
                      {badge.rewardMultiplier && <span>+{((badge.rewardMultiplier - 1) * 100).toFixed(0)}% bonus</span>}
                    </div>
                  </div>
                  <Switch
                    checked={badge.isActive}
                    onCheckedChange={() => success(`Badge ${badge.isActive ? 'disabled' : 'enabled'}`, badge.name)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
