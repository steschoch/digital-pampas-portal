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
  campaignId: string
}

function readPersisted(): PersistedSelection | null {
  try {
    const raw = localStorage.getItem(SELECTION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedSelection
    if (typeof parsed?.clientId === 'string' && typeof parsed?.campaignId === 'string') {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

function persist(sel: PersistedSelection): void {
  try {
    localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(sel))
  } catch {
    /* ignore */
  }
}

/**
 * SelectionProvider — the global client/campaign context (persisted). Changing
 * either updates every page. Defaults to the user's first client + All campaigns;
 * a persisted selection is restored when still valid for this login.
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
    setCampaignId(
      persisted && persisted.clientId === validClient ? persisted.campaignId : ALL_CAMPAIGNS,
    )
  }, [user])

  const setClient = useCallback((next: string) => {
    setClientId(next)
    // Switching client always resets scope to All (campaigns differ per client).
    setCampaignId(ALL_CAMPAIGNS)
    persist({ clientId: next, campaignId: ALL_CAMPAIGNS })
  }, [])

  const setCampaign = useCallback(
    (next: string) => {
      setCampaignId(next)
      if (clientId) persist({ clientId, campaignId: next })
    },
    [clientId],
  )

  const value = useMemo<SelectionContextValue>(
    () => ({ clientId, campaignId, setClient, setCampaign }),
    [clientId, campaignId, setClient, setCampaign],
  )

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}
