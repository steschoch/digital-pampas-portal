import { createContext, useContext } from 'react'

/** The campaign scope: a specific campaign id, or all campaigns of the client. */
export const ALL_CAMPAIGNS = 'all'

export interface SelectionContextValue {
  /** Currently selected client. */
  clientId: string | null
  /** Selected campaign id, or ALL_CAMPAIGNS for the aggregate view. */
  campaignId: string
  setClient: (clientId: string) => void
  setCampaign: (campaignId: string) => void
}

export const SelectionContext = createContext<SelectionContextValue | null>(null)

export function useSelection(): SelectionContextValue {
  const ctx = useContext(SelectionContext)
  if (!ctx) {
    throw new Error('useSelection must be used within <SelectionProvider>')
  }
  return ctx
}

export const SELECTION_STORAGE_KEY = 'dp-portal-selection'
