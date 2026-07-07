import { Select } from '@steschoch/digital-pampas-ds'
import { useAuth } from '../../lib/auth/AuthContext'
import { useSelection } from '../../lib/selection/SelectionContext'
import { useDataSource } from '../../lib/data/PortalDataContext'
import { useAsync } from '../../lib/data/useAsync'

/**
 * ClientSelector — DS `Select` wired to the global selection. Only rendered when
 * the login has more than one client (UX rule: no control without a choice).
 */
export function ClientSelector() {
  const { user } = useAuth()
  const source = useDataSource()
  const { clientId, setClient } = useSelection()

  const clientIds = user?.clientIds ?? []
  const { data: clients } = useAsync(() => source.getClients(clientIds), [clientIds.join(',')])

  // Single-client logins never see the selector.
  if (clientIds.length <= 1) return null

  const options = (clients ?? []).map((c) => ({ value: c.id, label: c.name }))

  return (
    <Select
      options={options}
      value={clientId}
      onChange={setClient}
      size="sm"
      aria-label="Select client"
    />
  )
}
