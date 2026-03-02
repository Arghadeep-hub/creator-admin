import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import { cn, getRelativeTime } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { MOCK_NOTIFICATIONS } from '@/data/notifications'
import type { AdminNotification } from '@/types'

/* ── Page metadata for contextual header ── */
const PAGE_META: Record<string, { title: string; sub: string }> = {
  '/dashboard':        { title: 'Dashboard',         sub: 'Overview & analytics' },
  '/campaigns/new':    { title: 'New Campaign',      sub: 'Create a campaign' },
  '/campaigns/':       { title: 'Campaign Details',  sub: 'Campaign management' },
  '/campaigns':        { title: 'Campaigns',         sub: 'Manage all campaigns' },
  '/creators/':        { title: 'Creator Profile',   sub: 'Creator details' },
  '/creators':         { title: 'Creators',          sub: 'Creator management' },
  '/submissions/':     { title: 'Submission Review',  sub: 'Review & approve' },
  '/submissions':      { title: 'Submissions',       sub: 'Review submissions' },
  '/payouts':          { title: 'Payouts',           sub: 'Financial management' },
  '/leaderboard':      { title: 'Leaderboard',       sub: 'Creator rankings' },
  '/admin-management': { title: 'Admin Management',  sub: 'Team access control' },
  '/settings':         { title: 'Settings',          sub: 'Platform configuration' },
  '/audit-log':        { title: 'Audit Log',         sub: 'Activity history' },
  '/reports':          { title: 'Reports',           sub: 'Analytics & insights' },
  '/profile':          { title: 'Profile',           sub: 'Your account settings' },
}

function getPageMeta(pathname: string) {
  // Exact match first
  if (PAGE_META[pathname]) return PAGE_META[pathname]
  // Prefix match — longer prefixes win (e.g. /campaigns/ beats /campaigns)
  const match = Object.keys(PAGE_META)
    .filter(k => k.endsWith('/') && pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0]
  if (match) return PAGE_META[match]
  // Fallback startsWith
  const fallback = Object.keys(PAGE_META)
    .filter(k => pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0]
  return fallback ? PAGE_META[fallback] : { title: 'Dashboard', sub: 'Overview & analytics' }
}

/* ── Notification severity colors ── */
const severityColors: Record<AdminNotification['severity'], string> = {
  info:     'bg-blue-50 border-l-4 border-l-blue-400',
  warning:  'bg-amber-50 border-l-4 border-l-amber-400',
  critical: 'bg-red-50 border-l-4 border-l-red-400',
}

export function TopBar() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length
  const page = getPageMeta(pathname)

  return (
    <>
      <header className="pwa-top-safe sticky top-0 z-30 overflow-x-clip">
        {/* Frosted glass backdrop */}
        <div className="absolute inset-0 bg-linear-to-r from-orange-50/60 via-white/20 to-sky-50/40 backdrop-blur-md" />

        <div className="relative flex h-14 items-center justify-between gap-3 px-4 md:h-[60px] md:px-6">
          {/* ── Left: Page context ── */}
          <div className="min-w-0 flex-1">
            <h1 className="text-[15px] font-bold leading-tight text-slate-900 tracking-[-0.01em] md:text-[17px] truncate">
              {page.title}
            </h1>
            <p className="hidden sm:block mt-[1px] text-[11px] font-medium text-slate-400 leading-none">
              {page.sub}
            </p>
          </div>

          {/* ── Right: Search + Notifications + Avatar ── */}
          <div className="flex shrink-0 items-center gap-1">
            {/* Search — styled as command-palette trigger (md+) */}
            <button
              type="button"
              className="hidden md:flex items-center gap-2 h-9 px-3 text-slate-400 bg-slate-50/80 border border-slate-200/80 rounded-xl hover:bg-white hover:border-slate-300 transition-all cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="text-[13px]">Search…</span>
              <kbd className="ml-4 text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Search icon — mobile */}
            <button
              type="button"
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-white/60 active:scale-95 transition-all cursor-pointer"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            {/* Notification bell */}
            <button
              type="button"
              onClick={() => setNotifOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-white/60 active:scale-95 transition-all cursor-pointer"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-[18px] min-w-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Avatar dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/60 active:scale-95 transition-all cursor-pointer">
                  <Avatar name={session?.name ?? 'Admin'} size="sm" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-semibold">{session?.name}</p>
                    <p className="text-xs text-muted-foreground font-normal">{session?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile & Settings
                </DropdownMenuItem>
                {session?.role === 'super_admin' && (
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    Platform Settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 hover:bg-red-50">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ── Notification Sheet ── */}
      <Sheet open={notifOpen} onOpenChange={setNotifOpen} side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between pr-6">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[11px] font-semibold bg-red-500 text-white rounded-full px-2.5 py-0.5">
                {unreadCount} new
              </span>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-2 mt-3">
          {MOCK_NOTIFICATIONS.map(notif => (
            <div
              key={notif.id}
              className={cn(
                'p-3 rounded-lg cursor-pointer transition-all hover:shadow-sm',
                severityColors[notif.severity],
                !notif.read && 'ring-1 ring-slate-200'
              )}
              onClick={() => {
                setNotifOpen(false)
                if (notif.actionUrl) navigate(notif.actionUrl)
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={cn('text-sm font-semibold', notif.read ? 'text-slate-600' : 'text-slate-900')}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                </div>
                {!notif.read && <span className="h-2 w-2 rounded-full bg-red-500 shrink-0 mt-1.5" />}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">{getRelativeTime(notif.timestamp)}</p>
            </div>
          ))}
        </div>
      </Sheet>
    </>
  )
}
