import { createContext, useContext } from 'react'
import type { PortalDataSource } from './PortalDataSource'

export const PortalDataContext = createContext<PortalDataSource | null>(null)

/** Access the active data source (the "waiter"). */
export function useDataSource(): PortalDataSource {
  const source = useContext(PortalDataContext)
  if (!source) {
    throw new Error('useDataSource must be used within <PortalDataProvider>')
  }
  return source
}
