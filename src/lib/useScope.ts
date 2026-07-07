import { useMemo } from 'react'
import type { Campaign, ClientAccount } from '../data/types'
import { useAuth } from './auth/AuthContext'
import { useSelection, ALL_CAMPAIGNS } from './selection/SelectionContext'
import { useDataSource } from './data/PortalDataContext'
import { useAsync } from './data/useAsync'

export interface PortalScope {
  client: ClientAccount | undefined
  /** All campaigns of the selected client. */
  campaigns: Campaign[]
  /** Campaign ids in the current scope (one, or all of the client's). */
  campaignIds: string[]
  /** The single selected campaign, if not the aggregate view. */
  selectedCampaign: Campaign | undefined
  isAll: boolean
  loading: boolean
}

/**
 * useScope — resolves the global client/campaign selection into a concrete scope
 * every page can consume: the client, its campaigns, and the campaign ids in view.
 */
export function useScope(): PortalScope {
  const { user } = useAuth()
  const source = useDataSource()
  const { clientId, campaignId } = useSelection()

  const clientIds = user?.clientIds ?? []
  const { data: clients, loading: clientsLoading } = useAsync(
    () => source.getClients(clientIds),
    [clientIds.join(',')],
  )
  const { data: campaigns, loading: campaignsLoading } = useAsync(
    () => (clientId ? source.getCampaigns(clientId) : Promise.resolve([])),
    [clientId],
  )

  return useMemo<PortalScope>(() => {
    const client = clients?.find((c) => c.id === clientId)
    const list = campaigns ?? []
    const isAll = campaignId === ALL_CAMPAIGNS
    const selectedCampaign = isAll ? undefined : list.find((c) => c.id === campaignId)
    const campaignIds = isAll ? list.map((c) => c.id) : selectedCampaign ? [selectedCampaign.id] : []
    return {
      client,
      campaigns: list,
      campaignIds,
      selectedCampaign,
      isAll,
      loading: clientsLoading || campaignsLoading,
    }
  }, [clients, campaigns, clientId, campaignId, clientsLoading, campaignsLoading])
}
