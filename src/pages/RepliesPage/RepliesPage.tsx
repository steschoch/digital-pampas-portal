import { useDataSource } from '../../lib/data/PortalDataContext'
import { useAsync } from '../../lib/data/useAsync'
import { useScope } from '../../lib/useScope'
import { PageHeader } from '@steschoch/digital-pampas-ds'
import { RepliesTable } from '../../components/metrics/RepliesTable'
import layout from '../../styles/layout.module.css'

export function RepliesPage() {
  const source = useDataSource()
  const { client, isAll, selectedCampaign, campaignIds } = useScope()
  const key = campaignIds.join(',')

  const { data: replies, loading } = useAsync(() => source.getReplies(campaignIds), [key])

  const scopeLabel = isAll ? 'All campaigns' : selectedCampaign?.name ?? '—'

  return (
    <div className={layout.stack}>
      <PageHeader
        eyebrow="Inbox"
        title="Replies"
        subtitle={`${client?.name ?? '—'} · ${scopeLabel}`}
      />
      <RepliesTable replies={replies ?? []} loading={loading} />
    </div>
  )
}
