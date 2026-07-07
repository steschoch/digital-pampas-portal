import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelection } from '../../lib/selection/SelectionContext'
import { CampaignDetailView } from '../../components/campaign/CampaignDetailView'

/**
 * Route /campaigns/:id — thin wrapper: reads the id from the URL and syncs the
 * global campaign dropdown to it (so the selector reflects what's on screen).
 */
export function CampaignDetailPage() {
  const { id = '' } = useParams()
  const { campaignId, setCampaign } = useSelection()

  useEffect(() => {
    if (id && id !== campaignId) setCampaign(id)
  }, [id, campaignId, setCampaign])

  return <CampaignDetailView id={id} />
}
