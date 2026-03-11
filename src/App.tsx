import { useEffect, lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { PageLoader } from '@/components/ui/PageLoader'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const LoginPage            = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const DashboardPage        = lazy(() => import('@/pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })))
const CampaignsPage        = lazy(() => import('@/pages/campaigns/CampaignsPage').then(m => ({ default: m.CampaignsPage })))
const CampaignDetailPage   = lazy(() => import('@/pages/campaigns/CampaignDetailPage').then(m => ({ default: m.CampaignDetailPage })))
const CampaignFormPage     = lazy(() => import('@/pages/campaigns/CampaignFormPage').then(m => ({ default: m.CampaignFormPage })))
const CreatorsPage         = lazy(() => import('@/pages/creators/CreatorsPage').then(m => ({ default: m.CreatorsPage })))
const CreatorDetailPage    = lazy(() => import('@/pages/creators/CreatorDetailPage').then(m => ({ default: m.CreatorDetailPage })))
const SubmissionsPage      = lazy(() => import('@/pages/submissions/SubmissionsPage').then(m => ({ default: m.SubmissionsPage })))
const SubmissionDetailPage = lazy(() => import('@/pages/submissions/SubmissionDetailPage').then(m => ({ default: m.SubmissionDetailPage })))
const PayoutsPage          = lazy(() => import('@/pages/payouts/PayoutsPage').then(m => ({ default: m.PayoutsPage })))
const LeaderboardPage      = lazy(() => import('@/pages/leaderboard/LeaderboardPage').then(m => ({ default: m.LeaderboardPage })))
const AdminManagementPage  = lazy(() => import('@/pages/admin-mgmt/AdminManagementPage').then(m => ({ default: m.AdminManagementPage })))
const SettingsPage         = lazy(() => import('@/pages/settings/SettingsPage').then(m => ({ default: m.SettingsPage })))
const AuditLogPage         = lazy(() => import('@/pages/audit-log/AuditLogPage').then(m => ({ default: m.AuditLogPage })))
const ReportsPage          = lazy(() => import('@/pages/reports/ReportsPage').then(m => ({ default: m.ReportsPage })))
const ProfilePage          = lazy(() => import('@/pages/profile/ProfilePage').then(m => ({ default: m.ProfilePage })))

/* ── Scroll to top on every navigation ── */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}


/* ── Route guards ── */

/** Redirect to /login if not authenticated. Shows loader while auth is resolving. */
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

/** Redirect to /dashboard if already authenticated (e.g. login page). */
const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <PageLoader />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

/** Redirect to /dashboard if authenticated but not a super_admin. */
const SuperAdminRoute = ({ children }: { children: ReactNode }) => {
  const { session, isLoading } = useAuth()
  if (isLoading) return <PageLoader />
  if (session?.role !== 'super_admin') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

/** Wraps a page in ProtectedRoute + AdminLayout (for use outside nested routes). */
export const WithLayout = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute>
    <AdminLayout>{children}</AdminLayout>
  </ProtectedRoute>
)

/* ── Legacy check-in URL redirect ── */
const LegacyCheckInRedirect = () => {
  const { campaignId } = useParams()
  return <Navigate to={campaignId ? `/submit/${campaignId}` : '/campaigns'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Auth */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <ErrorBoundary>
                      <LoginPage />
                    </ErrorBoundary>
                  </PublicOnlyRoute>
                }
              />

              {/* Legacy redirect */}
              <Route path="/checkin/:campaignId" element={<LegacyCheckInRedirect />} />

              {/* Protected routes — ProtectedRoute guards auth, AdminLayout renders shell */}
              <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />

                {/* Campaigns */}
                <Route path="/campaigns" element={<ErrorBoundary><CampaignsPage /></ErrorBoundary>} />
                <Route path="/campaigns/new" element={<ErrorBoundary><CampaignFormPage /></ErrorBoundary>} />
                <Route path="/campaigns/:id" element={<ErrorBoundary><CampaignDetailPage /></ErrorBoundary>} />
                <Route path="/campaigns/:id/edit" element={<ErrorBoundary><CampaignFormPage /></ErrorBoundary>} />

                {/* Creators */}
                <Route path="/creators" element={<ErrorBoundary><CreatorsPage /></ErrorBoundary>} />
                <Route path="/creators/:id" element={<ErrorBoundary><CreatorDetailPage /></ErrorBoundary>} />

                {/* Submissions */}
                <Route path="/submissions" element={<ErrorBoundary><SubmissionsPage /></ErrorBoundary>} />
                <Route path="/submissions/:id" element={<ErrorBoundary><SubmissionDetailPage /></ErrorBoundary>} />

                {/* Payouts */}
                <Route path="/payouts" element={<ErrorBoundary><PayoutsPage /></ErrorBoundary>} />

                {/* Leaderboard */}
                <Route path="/leaderboard" element={<ErrorBoundary><LeaderboardPage /></ErrorBoundary>} />

                {/* Super Admin only */}
                <Route path="/admin-management" element={<SuperAdminRoute><ErrorBoundary><AdminManagementPage /></ErrorBoundary></SuperAdminRoute>} />
                <Route path="/settings" element={<SuperAdminRoute><ErrorBoundary><SettingsPage /></ErrorBoundary></SuperAdminRoute>} />
                <Route path="/audit-log" element={<SuperAdminRoute><ErrorBoundary><AuditLogPage /></ErrorBoundary></SuperAdminRoute>} />

                {/* Reports + Profile */}
                <Route path="/reports" element={<ErrorBoundary><ReportsPage /></ErrorBoundary>} />
                <Route path="/profile" element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
              </Route>

              {/* Default */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
