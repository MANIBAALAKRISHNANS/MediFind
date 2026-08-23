import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import useAuthStore from './store/authStore.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute    from './components/PublicRoute.jsx'

// Auth pages
import LoginPage          from './pages/auth/LoginPage.jsx'
import SignupPage         from './pages/auth/SignupPage.jsx'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx'
import ResetPasswordPage  from './pages/auth/ResetPasswordPage.jsx'

// App pages
import HomePage           from './pages/HomePage.jsx'
import HistoryPage        from './pages/HistoryPage.jsx'
import AnalysisDetailPage from './pages/AnalysisDetailPage.jsx'
import ProfilePage        from './pages/ProfilePage.jsx'
import EditProfilePage    from './pages/EditProfilePage.jsx'

export default function App() {
  const loadUser = useAuthStore((s) => s.loadUser)

  // Bootstrap auth state once on mount
  useEffect(() => {
    loadUser()
  }, [loadUser])

  return (
    <Routes>
      {/* ── Public routes (redirect home if already logged in) ───────────── */}
      <Route element={<PublicRoute />}>
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/signup"          element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password"  element={<ResetPasswordPage />} />
      </Route>

      {/* ── Protected routes (redirect to /login if not logged in) ──────── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/"                element={<HomePage />} />
        <Route path="/history"         element={<HistoryPage />} />
        <Route path="/history/:id"     element={<AnalysisDetailPage />} />
        <Route path="/profile"         element={<ProfilePage />} />
        <Route path="/profile/edit"    element={<EditProfilePage />} />
      </Route>

      {/* ── Catch-all ───────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
