import { EmptyState, Icon, Skeleton } from '@steschoch/digital-pampas-ds'
import { useScope } from '../../lib/useScope'
import { PageHeader } from '@steschoch/digital-pampas-ds'
import { CampaignCard } from '../../components/campaign/CampaignCard'
import layout from '../../styles/layout.module.css'

export function CampaignsPage() {
  // /campaigns always shows the full grid; a single campaign's dossier lives at
  // /campaigns/:id. The global dropdown filters the dashboard pages, not this list. (C-19)
  const { client, campaigns, loading } = useScope()

  return (
    <div className={layout.stack}>
      <PageHeader
        eyebrow="Campaigns"
        title="Campaigns"
        subtitle={client ? `${client.name} · ${campaigns.length} campaign${campaigns.length === 1 ? '' : 's'}` : '—'}
      />

      {loading ? (
        <div className={layout.cardGrid}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rect" height={230} />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={<Icon name="Megaphone" size="xl" />}
          title="No campaigns yet"
          description="Nothing wired for this client yet. Campaigns appear here once the engine is built."
        />
      ) : (
        <div className={layout.cardGrid}>
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </div>
  )
}
