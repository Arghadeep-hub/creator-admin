import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Bell, AlertTriangle, AlertCircle, Info,
  CheckCheck, LogOut, UserCircle,
} from 'lucide-react'
import { cn, getRelativeTime } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from '@/store/api/notificationsApi'
import type { AdminNotification } from '@/types'

/* ── Page metadata ─────────────────────────────────────────────────────────── */
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
  '/profile':          { title: 'My Profile',        sub: 'Your account settings' },
}

function getPageMeta(pathname: string) {
  if (PAGE_META[pathname]) return PAGE_META[pathname]
  const match = Object.keys(PAGE_META)
    .filter(k => k.endsWith('/') && pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0]
  if (match) return PAGE_META[match]
  const fallback = Object.keys(PAGE_META)
    .filter(k => pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0]
  return fallback ? PAGE_META[fallback] : { title: 'Dashboard', sub: 'Overview & analytics' }
}

/* ── Severity config ───────────────────────────────────────────────────────── */
const SEVERITY: Record<AdminNotification['severity'], {
  icon: typeof Info
  dot: string
  bg: string
  iconColor: string
}> = {
  INFO:     { icon: Info,          dot: 'bg-blue-500',  bg: 'bg-blue-50/80',  iconColor: 'text-blue-500' },
  WARNING:  { icon: AlertTriangle, dot: 'bg-amber-500', bg: 'bg-amber-50/80', iconColor: 'text-amber-500' },
  CRITICAL: { icon: AlertCircle,   dot: 'bg-red-500',   bg: 'bg-red-50/80',   iconColor: 'text-red-500' },
}

/* ── Greeting helper ───────────────────────────────────────────────────────── */
function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/* ── Component ─────────────────────────────────────────────────────────────── */
export function TopBar() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)

  const { data: notifData } = useGetNotificationsQuery({ page: 1, limit: 50 })
  const [markRead] = useMarkNotificationReadMutation()
  const [markAllRead] = useMarkAllNotificationsReadMutation()

  const allNotifications = notifData?.data ?? []

  const page = getPageMeta(pathname)
  const isDashboard = pathname === '/dashboard'

  const { unread, earlier } = useMemo(() => {
    const u: AdminNotification[] = []
    const e: AdminNotification[] = []
    for (const n of allNotifications) {
      ;(n.read ? e : u).push(n)
    }
    return { unread: u, earlier: e }
  }, [allNotifications])

  const unreadCount = unread.length

  async function handleMarkAllRead() {
    try {
      await markAllRead().unwrap()
    } catch {
      // silent — UI will update via cache invalidation
    }
  }

  async function handleMarkOneRead(id: string) {
    try {
      await markRead(id).unwrap()
    } catch {
      // silent
    }
  }

  return (
    <>
      <header className="pwa-top-safe sticky top-0 z-30">
        {/* Frosted glass */}
        <div className="absolute inset-0 bg-transparent backdrop-blur-xl" />

        <div className="relative flex h-14 items-center justify-between gap-3 px-4 md:h-15 md:px-6">
          {/* ── Left: Page context / Greeting ── */}
          <div className="min-w-0 flex-1">
            {isDashboard ? (
              <>
                <p className="text-[11px] font-medium text-slate-400 leading-none tracking-wide">
                  {getGreeting()}
                </p>
                <h1 className="text-[16px] font-bold leading-snug text-slate-900 tracking-[-0.01em] md:text-[18px] truncate mt-0.5">
                  {session?.name}
                </h1>
              </>
            ) : (
              <>
                <h1 className="text-[16px] font-bold leading-snug text-slate-900 tracking-[-0.01em] md:text-[18px] truncate">
                  {page.title}
                </h1>
                <p className="mt-px text-[11px] font-medium text-slate-400 leading-none hidden sm:block">
                  {page.sub}
                </p>
              </>
            )}
          </div>

          {/* ── Right: Notification + Avatar ── */}
          <div className="flex shrink-0 items-center gap-1.5">
            {/* Notification bell */}
            <button
              type="button"
              onClick={() => setNotifOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl text-slate-500 hover:bg-slate-100/80 active:scale-95 transition-all cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none shadow-sm shadow-red-200">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Avatar dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100/80 active:scale-95 transition-all cursor-pointer">
                  <Avatar name={session?.name ?? 'Admin'} size="sm" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-semibold text-slate-900">{session?.name}</p>
                    <p className="text-xs text-muted-foreground font-normal">{session?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <UserCircle className="h-4 w-4 mr-2 text-slate-400" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4 mr-2" />
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
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 text-[12px] font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5 mt-2">
          {/* Unread */}
          {unread.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  New
                </p>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white leading-none">
                  {unread.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {unread.map(notif => (
                  <NotifCard
                    key={notif.id}
                    notif={notif}
                    isRead={false}
                    onTap={() => {
                      handleMarkOneRead(notif.id)
                      setNotifOpen(false)
                      if (notif.actionUrl) navigate(notif.actionUrl)
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Earlier */}
          {earlier.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Earlier
              </p>
              <div className="space-y-1.5">
                {earlier.map(notif => (
                  <NotifCard
                    key={notif.id}
                    notif={notif}
                    isRead
                    onTap={() => {
                      setNotifOpen(false)
                      if (notif.actionUrl) navigate(notif.actionUrl)
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {unread.length === 0 && earlier.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Bell className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">All caught up</p>
              <p className="text-xs text-muted-foreground mt-0.5">No new notifications</p>
            </div>
          )}
        </div>
      </Sheet>
    </>
  )
}

/* ── Notification card ─────────────────────────────────────────────────────── */
function NotifCard({
  notif, isRead, onTap,
}: {
  notif: AdminNotification
  isRead: boolean
  onTap: () => void
}) {
  const sev = SEVERITY[notif.severity]
  const Icon = sev.icon

  return (
    <div
      onClick={onTap}
      className={cn(
        'group flex gap-3 p-3 rounded-xl cursor-pointer transition-all active:scale-[0.98]',
        isRead
          ? 'bg-white hover:bg-slate-50'
          : cn(sev.bg, 'hover:shadow-sm'),
      )}
    >
      {/* Severity icon */}
      <div className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5',
        isRead ? 'bg-slate-100' : 'bg-white/80',
      )}>
        <Icon className={cn('h-4 w-4', isRead ? 'text-slate-400' : sev.iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-[13px] font-semibold leading-snug', isRead ? 'text-slate-500' : 'text-slate-900')}>
            {notif.title}
          </p>
          {!isRead && <span className={cn('h-2 w-2 rounded-full shrink-0 mt-1.5', sev.dot)} />}
        </div>
        <p className={cn('text-xs leading-relaxed mt-0.5', isRead ? 'text-slate-400' : 'text-muted-foreground')}>
          {notif.message}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">{getRelativeTime(notif.createdAt)}</p>
      </div>
    </div>
  )
}
