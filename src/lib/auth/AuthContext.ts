import { createContext, useContext } from 'react'
import type { UserAccount } from '../../data/types'

export interface AuthContextValue {
  /** The signed-in user, or null. */
  user: UserAccount | null
  /** True until the initial session rehydration finishes. */
  initializing: boolean
  /** Verify credentials and sign in. Rejects with a generic error on failure. */
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>')
  }
  return ctx
}
