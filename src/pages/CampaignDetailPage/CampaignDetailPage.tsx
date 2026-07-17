import { useParams } from 'react-router-dom'
import { CampaignDetailView } from '../../components/campaign/CampaignDetailView'

/**
 * Route /campaigns/:id — thin wrapper: reads the id from the URL and renders the
 * dossier. It deliberately does NOT touch the global campaign dropdown, so opening
 * a campaign never silently filters the rest of the dashboard. (C-19)
 */
export function CampaignDetailPage() {
  const { id = '' } = useParams()
  return <CampaignDetailView id={id} />
}
