import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  LayoutDashboard, Megaphone, Video, Wallet, MoreHorizontal,
  Users, Trophy, BarChart3, UserCircle,
  ShieldCheck, ClipboardList, Settings
} from 'lucide-react'

/* ── Tab config ── */
const MAIN_TABS = [
  { label: 'Home',        icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Campaigns',   icon: Megaphone,       path: '/campaigns' },
  { label: 'Submissions', icon: Video,           path: '/submissions' },
  { label: 'Payouts',     icon: Wallet,          path: '/payouts' },
]

const MORE_ITEMS = [
  { label: 'Creators',    icon: Users,       path: '/creators' },
  { label: 'Leaderboard', icon: Trophy,      path: '/leaderboard' },
  { label: 'Reports',     icon: BarChart3,   path: '/reports' },
  { label: 'Profile',     icon: UserCircle,  path: '/profile' },
]

const SA_ITEMS = [
  { label: 'Admin Mgmt', icon: ShieldCheck,   path: '/admin-management' },
  { label: 'Audit Log',  icon: ClipboardList, path: '/audit-log' },
  { label: 'Settings',   icon: Settings,      path: '/settings' },
]

export function MobileNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const { session } = useAuth()
  const isSuperAdmin = session?.role === 'super_admin'

  const isActive = (path: string) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path)

  return (
    <>
      {/* ── Bottom tab bar ── */}
      <nav className="md:hidden fixed inset-x-0 bottom-0 z-40">
        <div className="border-t border-white/60 bg-white/80 backdrop-blur-xl backdrop-saturate-[1.8]">
          <div
            className="mx-auto flex max-w-md items-center justify-around"
            style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
          >
            {MAIN_TABS.map(tab => {
              const active = isActive(tab.path)
              const Icon = tab.icon
              return (
                <button
                  key={tab.path}
                  type="button"
                  onClick={() => navigate(tab.path)}
                  className={cn(
                    'group relative flex flex-1 flex-col items-center pt-2.5 pb-1 cursor-pointer',
                    active ? 'text-orange-600' : 'text-slate-400'
                  )}
                >
                  {/* Active top indicator */}
                  {active && (
                    <span className="absolute -top-px left-1/2 -translate-x-1/2 h-[2.5px] w-5 rounded-full bg-linear-to-r from-orange-500 to-rose-500" />
                  )}

                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-2xl transition-colors duration-200',
                      active ? 'bg-orange-500/[0.12]' : 'group-active:bg-slate-100'
                    )}
                  >
                    <Icon
                      className="h-[1.2rem] w-[1.2rem] transition-colors duration-200"
                      strokeWidth={active ? 2.4 : 1.8}
                    />
                  </span>

                  <span
                    className={cn(
                      'mt-0.5 text-[10px] leading-tight tracking-wide transition-colors duration-200',
                      active ? 'font-bold' : 'font-medium'
                    )}
                  >
                    {tab.label}
                  </span>
                </button>
              )
            })}

            {/* More */}
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className="group relative flex flex-1 flex-col items-center pt-2.5 pb-1 cursor-pointer text-slate-400"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-2xl transition-colors group-active:bg-slate-100">
                <MoreHorizontal className="h-[1.2rem] w-[1.2rem]" strokeWidth={1.8} />
              </span>
              <span className="mt-0.5 text-[10px] font-medium leading-tight tracking-wide">
                More
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── More sheet ── */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen} side="bottom">
        <SheetHeader>
          <SheetTitle className="pr-6">More</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 mt-4">
          {/* General items */}
          <div className="grid grid-cols-4 gap-2">
            {MORE_ITEMS.map(item => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => { navigate(item.path); setMoreOpen(false) }}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-pointer transition-colors active:scale-95',
                    active
                      ? 'bg-orange-50 text-orange-600'
                      : 'hover:bg-slate-50 text-slate-600'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[11px] font-medium leading-tight text-center">{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Admin items (super admin only) */}
          {isSuperAdmin && (
            <>
              <div className="border-t border-slate-100" />
              <div>
                <p className="px-1 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Admin
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {SA_ITEMS.map(item => {
                    const Icon = item.icon
                    const active = isActive(item.path)
                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => { navigate(item.path); setMoreOpen(false) }}
                        className={cn(
                          'flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-pointer transition-colors active:scale-95',
                          active
                            ? 'bg-orange-50 border-orange-200/50 text-orange-600'
                            : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-[11px] font-medium leading-tight text-center">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </Sheet>
    </>
  )
}
