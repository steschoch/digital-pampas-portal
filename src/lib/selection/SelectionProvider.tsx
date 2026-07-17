import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import {
  ALL_CAMPAIGNS,
  SELECTION_STORAGE_KEY,
  SelectionContext,
  type SelectionContextValue,
} from './SelectionContext'

interface PersistedSelection {
  clientId: string
}

/** Only the client is persisted — the campaign filter is intentionally session-only
 *  so a reload never leaves a "phantom" campaign scoping the dashboard. (C-19) */
function readPersisted(): PersistedSelection | null {
  try {
    const raw = localStorage.getItem(SELECTION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedSelection
    if (typeof parsed?.clientId === 'string') {
      return { clientId: parsed.clientId }
    }
    return null
  } catch {
    return null
  }
}

function persist(clientId: string): void {
  try {
    localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify({ clientId }))
  } catch {
    /* ignore */
  }
}

/**
 * SelectionProvider — the global client/campaign context. The client is persisted;
 * the campaign filter is session-only and always starts at All campaigns. (C-19)
 */
export function SelectionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const [clientId, setClientId] = useState<string | null>(null)
  const [campaignId, setCampaignId] = useState<string>(ALL_CAMPAIGNS)

  // Initialize / reconcile whenever the login changes.
  useEffect(() => {
    if (!user) {
      setClientId(null)
      setCampaignId(ALL_CAMPAIGNS)
      return
    }
    const persisted = readPersisted()
    const validClient =
      persisted && user.clientIds.includes(persisted.clientId)
        ? persisted.clientId
        : (user.clientIds[0] ?? null)
    setClientId(validClient)
    // Campaign scope always starts at All on a fresh load (not persisted).
    setCampaignId(ALL_CAMPAIGNS)
  }, [user])

  const setClient = useCallback((next: string) => {
    setClientId(next)
    // Switching client always resets scope to All (campaigns differ per client).
    setCampaignId(ALL_CAMPAIGNS)
    persist(next)
  }, [])

  const setCampaign = useCallback((next: string) => {
    setCampaignId(next)
  }, [])

  const value = useMemo<SelectionContextValue>(
    () => ({ clientId, campaignId, setClient, setCampaign }),
    [clientId, campaignId, setClient, setCampaign],
  )

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}
