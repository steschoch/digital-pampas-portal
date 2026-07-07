/**
 * The "paper guest list" (architecture §3.3). Demo credentials checked against a
 * hard-coded list — enough to present the portal. Later, the doorman checks the
 * real system (Supabase Auth) instead; the login page, the badge (token) and the
 * RequireAuth ropes stay identical.
 */

import type { UserAccount } from '../../data/types'
import { users } from '../../data/portalMock'

interface Credential {
  email: string
  password: string
  userId: string
}

/** Demo credentials — shown as hints on the login page. */
export const DEMO_CREDENTIALS: Credential[] = [
  { email: 'demo@digitalpampas.com', password: 'pampas2026', userId: 'user-agency' },
  { email: 'client@acme.com', password: 'acme2026', userId: 'user-acme' },
]

const STORAGE_KEY = 'dp-portal-auth'
/** Simulated auth latency (ms). */
const LATENCY = 500

function findUser(userId: string): UserAccount | undefined {
  return users.find((u) => u.id === userId)
}

/** Verify credentials. Resolves to the user, or rejects with a generic message. */
export function verifyCredentials(email: string, password: string): Promise<UserAccount> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const normalized = email.trim().toLowerCase()
      const match = DEMO_CREDENTIALS.find(
        (c) => c.email === normalized && c.password === password,
      )
      const user = match && findUser(match.userId)
      if (user) {
        resolve(user)
      } else {
        // Generic message — never reveal which field was wrong.
        reject(new Error('Invalid email or password'))
      }
    }, LATENCY)
  })
}

/** Persist the "badge" (the signed-in user id) in the browser. */
export function persistSession(userId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, userId)
  } catch {
    /* storage unavailable — session lives only in memory */
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

/** Rehydrate a persisted session on app start. */
export function restoreSession(): UserAccount | null {
  try {
    const userId = localStorage.getItem(STORAGE_KEY)
    return userId ? (findUser(userId) ?? null) : null
  } catch {
    return null
  }
}
