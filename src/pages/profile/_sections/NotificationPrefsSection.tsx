import { useState } from 'react'
import { Save, Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/contexts/ToastContext'

// ── Config ────────────────────────────────────────────────────────────────────

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

function SectionIcon({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${bg}`}>
      {children}
    </span>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NotificationPrefsSection() {
  const { success } = useToast()

  const [notifs, setNotifs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_ITEMS.map(n => [n.key, true]))
  )

  return (
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
  )
}
