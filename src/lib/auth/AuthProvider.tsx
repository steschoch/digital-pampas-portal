import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { UserAccount } from '../../data/types'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { clearSession, persistSession, restoreSession, verifyCredentials } from './mockAuth'

/**
 * AuthProvider — the doorman (architecture §3.3). Holds the current user, hands
 * out a "badge" (persisted session), and clears it on sign-out. To go live, swap
 * the mockAuth calls for Supabase Auth — this component's shape is unchanged.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null)
  const [initializing, setInitializing] = useState(true)

  // Rehydrate any persisted session on first mount.
  useEffect(() => {
    setUser(restoreSession())
    setInitializing(false)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const account = await verifyCredentials(email, password)
    persistSession(account.id)
    setUser(account)
  }, [])

  const signOut = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, initializing, signIn, signOut }),
    [user, initializing, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
