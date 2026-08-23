import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'

/**
 * Wraps routes that require authentication.
 *
 * • While auth state is bootstrapping  → full-screen spinner with logo
 * • No authenticated user              → redirect to /login
 * • Authenticated                      → render <Outlet /> (nested routes)
 *                                        or children if passed directly
 */
export default function ProtectedRoute({ children }) {
  const { user, isInitialized } = useAuthStore()

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ios-bg">
        <div className="flex flex-col items-center gap-4">
          <span className="font-display font-bold text-2xl tracking-tight text-teal-500">
            MediFind
          </span>
          <div className="w-7 h-7 border-2 border-medical-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children ?? <Outlet />
}
