import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth/AuthContext'

/**
 * RequireAuth — the "safety rope" (architecture §3.3). No badge ⇒ bounced to
 * /login?from=<destination>; after login the user returns exactly where they went.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, initializing } = useAuth()
  const location = useLocation()

  // Wait for session rehydration before deciding (avoids a flash to /login).
  if (initializing) return null

  if (!user) {
    const from = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?from=${from}`} replace />
  }

  return <>{children}</>
}
