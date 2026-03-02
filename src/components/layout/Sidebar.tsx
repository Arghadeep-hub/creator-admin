import { memo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar } from '@/components/ui/avatar'
import { Tooltip } from '@/components/ui/tooltip'
import { BrandLogo } from '@/components/BrandLogo'
import {
  LayoutDashboard, Megaphone, Users, Video, Wallet, Trophy,
  ShieldCheck, Settings, ClipboardList, BarChart3,
  PanelLeftClose, PanelLeftOpen, LogOut
} from 'lucide-react'

/* ── Types ── */
interface NavItem {
  label: string
  icon: typeof LayoutDashboard
  path: string
  superAdminOnly?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

/* ── Grouped nav config ── */
const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard',   icon: LayoutDashboard, path: '/dashboard' },
      { label: 'Campaigns',   icon: Megaphone,       path: '/campaigns' },
      { label: 'Creators',    icon: Users,           path: '/creators' },
      { label: 'Submissions', icon: Video,           path: '/submissions' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Payouts',     icon: Wallet,    path: '/payouts' },
      { label: 'Leaderboard', icon: Trophy,    path: '/leaderboard' },
      { label: 'Reports',     icon: BarChart3, path: '/reports' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Admin Mgmt', icon: ShieldCheck,   path: '/admin-management', superAdminOnly: true },
      { label: 'Audit Log',  icon: ClipboardList, path: '/audit-log',        superAdminOnly: true },
      { label: 'Settings',   icon: Settings,      path: '/settings',         superAdminOnly: true },
    ],
  },
]

/* ── Props ── */
interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export const Sidebar = memo(function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isSuperAdmin = session?.role === 'super_admin'

  const isActive = (path: string) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path)

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 left-0 hidden md:flex flex-col overflow-hidden border-r border-slate-200/80 bg-white/95 backdrop-blur-sm z-40"
    >
      {/* ── Header: Logo + Collapse ── */}
      <div
        className={cn(
          'flex items-center h-[60px] border-b border-slate-100 shrink-0',
          collapsed ? 'justify-center px-2' : 'justify-between px-4'
        )}
      >
        <div className={cn('flex items-center gap-2.5 min-w-0', collapsed && 'justify-center')}>
          <AnimatePresence mode="wait" initial={false}>
            {collapsed ? (
              <motion.div
                key="icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              >
                <BrandLogo
                  className="h-9 w-9 shrink-0 object-cover object-left rounded-lg"
                  alt="TryTheMenu"
                />
              </motion.div>
            ) : (
              <motion.div
                key="full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex flex-col"
              >
                <BrandLogo className="h-8 w-auto max-w-35 shrink-0" alt="TryTheMenu" />
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Admin Panel
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Collapse sidebar"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Navigation (grouped) ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-5">
        {NAV_GROUPS.map(group => {
          const visible = group.items.filter(i => !i.superAdminOnly || isSuperAdmin)
          if (visible.length === 0) return null

          return (
            <div key={group.label}>
              {/* Section label */}
              {!collapsed ? (
                <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400/80">
                  {group.label}
                </p>
              ) : (
                <div className="mx-3 mb-2 border-t border-slate-100" />
              )}

              <div className="space-y-0.5">
                {visible.map(item => {
                  const active = isActive(item.path)
                  const Icon = item.icon

                  const btn = (
                    <button
                      type="button"
                      onClick={() => navigate(item.path)}
                      className={cn(
                        'group relative flex w-full items-center rounded-xl text-[13px] font-semibold cursor-pointer transition-[color,box-shadow] duration-150',
                        collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2',
                        active
                          ? 'bg-linear-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-200/50'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span
                        className={cn(
                          'grid h-7 w-7 shrink-0 place-items-center rounded-lg',
                          active ? 'bg-white/20' : 'bg-transparent'
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-[18px] w-[18px]',
                            active ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                          )}
                        />
                      </span>
                      {!collapsed && (
                        <span className="truncate whitespace-nowrap">{item.label}</span>
                      )}
                    </button>
                  )

                  return collapsed ? (
                    <Tooltip key={item.path} content={item.label} side="right" className="w-full">
                      {btn}
                    </Tooltip>
                  ) : (
                    <div key={item.path}>{btn}</div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* ── Footer: User + Logout + Expand ── */}
      <div className="border-t border-slate-100 p-2.5 space-y-1">
        {/* User card */}
        {collapsed ? (
          <Tooltip content={session?.name ?? 'Profile'} side="right" className="w-full">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Avatar name={session?.name ?? 'Admin'} size="sm" />
            </button>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <Avatar name={session?.name ?? 'Admin'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-900">{session?.name}</p>
              <p className="text-[11px] text-slate-500 truncate">
                {session?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </p>
            </div>
          </button>
        )}

        {/* Logout */}
        {collapsed ? (
          <Tooltip content="Logout" side="right" className="w-full">
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </button>
        )}

        {/* Expand toggle (collapsed only) */}
        {collapsed && (
          <Tooltip content="Expand sidebar" side="right" className="w-full">
            <button
              type="button"
              onClick={onToggle}
              aria-label="Expand sidebar"
              className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          </Tooltip>
        )}
      </div>
    </motion.aside>
  )
})
