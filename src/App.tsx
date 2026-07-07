import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './lib/theme/ThemeProvider'
import { AuthProvider } from './lib/auth/AuthProvider'
import { PortalDataProvider } from './lib/data/PortalDataProvider'
import { SelectionProvider } from './lib/selection/SelectionProvider'
import { RequireAuth } from './components/RequireAuth/RequireAuth'
import { AppShell } from './components/AppShell/AppShell'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { OverviewPage } from './pages/OverviewPage/OverviewPage'
import { CampaignsPage } from './pages/CampaignsPage/CampaignsPage'
import { CampaignDetailPage } from './pages/CampaignDetailPage/CampaignDetailPage'
import { RepliesPage } from './pages/RepliesPage/RepliesPage'
import { ReportsPage } from './pages/ReportsPage/ReportsPage'

/**
 * Protected layout: RequireAuth → data + selection providers → AppShell (with an
 * <Outlet/> for the page). Everything the dashboard needs lives inside the badge check.
 */
function ProtectedLayout() {
  return (
    <RequireAuth>
      <PortalDataProvider>
        <SelectionProvider>
          <AppShell />
        </SelectionProvider>
      </PortalDataProvider>
    </RequireAuth>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected (inside the shell) */}
            <Route element={<ProtectedLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="campaigns/:id" element={<CampaignDetailPage />} />
              <Route path="replies" element={<RepliesPage />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
