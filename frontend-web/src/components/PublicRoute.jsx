import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'

/**
 * Wraps public-only routes (login, signup, forgot/reset password).
 *
 * • Auth state still loading → render null to prevent a flash redirect
 * • User IS logged in         → redirect to home
 * • No user                   → render <Outlet /> (nested routes)
 *                               or children if passed directly
 */
export default function PublicRoute({ children }) {
  const { user, isInitialized } = useAuthStore()

  if (!isInitialized) {
    return null
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children ?? <Outlet />
}
