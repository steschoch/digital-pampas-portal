import type { CampaignState } from '../../data/types'

type BadgeVariant = 'primary' | 'success' | 'warning' | 'neutral' | 'secondary'

export const CAMPAIGN_STATE_META: Record<CampaignState, { label: string; badge: BadgeVariant }> = {
  live: { label: 'Live', badge: 'success' },
  warming: { label: 'Warming', badge: 'warning' },
  paused: { label: 'Paused', badge: 'neutral' },
  completed: { label: 'Completed', badge: 'secondary' },
}
