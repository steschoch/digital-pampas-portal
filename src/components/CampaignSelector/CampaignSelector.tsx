import { Select } from '@steschoch/digital-pampas-ds'
import { useSelection, ALL_CAMPAIGNS } from '../../lib/selection/SelectionContext'
import { useDataSource } from '../../lib/data/PortalDataContext'
import { useAsync } from '../../lib/data/useAsync'

/**
 * CampaignSelector — DS `Select` wired to the global selection. Lists the current
 * client's campaigns plus an "All campaigns" aggregate option.
 */
export function CampaignSelector() {
  const source = useDataSource()
  const { clientId, campaignId, setCampaign } = useSelection()

  const { data: campaigns } = useAsync(
    () => (clientId ? source.getCampaigns(clientId) : Promise.resolve([])),
    [clientId],
  )

  if (!clientId) return null

  const options = [
    { value: ALL_CAMPAIGNS, label: 'All campaigns' },
    ...(campaigns ?? []).map((c) => ({ value: c.id, label: c.name })),
  ]

  return (
    <Select
      options={options}
      value={campaignId}
      onChange={setCampaign}
      size="sm"
      label="Campaign"
      aria-label="Select campaign"
    />
  )
}
