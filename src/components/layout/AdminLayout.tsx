import { useState } from 'react'
import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MobileNav } from './MobileNav'

const W_OPEN   = 256  // matches w-64 on Sidebar
const W_CLOSED = 76   // matches w-[76px] on Sidebar
const SIDEBAR_KEY = 'ttm_sidebar_collapsed'

export function AdminLayout({ children }: { children?: ReactNode } = {}) {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_KEY) === 'true'
  )

  const toggle = () =>
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem(SIDEBAR_KEY, String(next))
      return next
    })

  const sidebarPx = collapsed ? W_CLOSED : W_OPEN

  return (
    <div className="min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={toggle} />

      {/* Content area — shifts right of the fixed sidebar on md+ */}
      <div className="admin-content-offset overflow-x-clip">
        <TopBar />
        <main className="max-w-400 mx-auto px-4 md:px-6 py-4 md:py-6 pb-20 md:pb-6">
          {children ?? <Outlet />}
        </main>
      </div>


      {/* Scoped style: dynamic padding-left that tracks the sidebar width */}
      <style>{`
        @media (min-width: 768px) {
          .admin-content-offset {
            padding-left: ${sidebarPx}px;
            transition: padding-left 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }
      `}</style>

      <MobileNav />
    </div>
  )
}
