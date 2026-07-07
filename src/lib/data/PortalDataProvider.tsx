import { useMemo, type ReactNode } from 'react'
import { PortalDataContext } from './PortalDataContext'
import { MockDataSource } from './MockDataSource'
// import { SupabaseDataSource } from './SupabaseDataSource'

/**
 * PortalDataProvider — mounts the active data source into context.
 *
 * ── TO GO LIVE (one line): ──────────────────────────────────────────────────
 *   const source = useMemo(() => new SupabaseDataSource(supabaseClient), [])
 * ────────────────────────────────────────────────────────────────────────────
 */
export function PortalDataProvider({ children }: { children: ReactNode }) {
  const source = useMemo(() => new MockDataSource(), [])
  return <PortalDataContext.Provider value={source}>{children}</PortalDataContext.Provider>
}
