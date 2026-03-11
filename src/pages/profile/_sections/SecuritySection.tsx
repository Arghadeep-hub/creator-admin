import { Shield, LogOut, Monitor, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

function SectionIcon({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${bg}`}>
      {children}
    </span>
  )
}

interface Props {
  lastLogin: string
  onLogout: () => void
}

export function SecuritySection({ lastLogin, onLogout }: Props) {
  return (
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
          <Button variant="destructive" size="sm" onClick={onLogout} className="shrink-0 h-9 text-xs px-3.5">
            <LogOut className="h-3.5 w-3.5" />Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
