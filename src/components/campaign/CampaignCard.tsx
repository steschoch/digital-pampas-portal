import { useNavigate } from 'react-router-dom'
import { Badge, Card, Skeleton, Timeline } from '@steschoch/digital-pampas-ds'
import type { Campaign } from '../../data/types'
import { ChannelIcon } from '../icons/ChannelIcon'
import { useDataSource } from '../../lib/data/PortalDataContext'
import { useAsync } from '../../lib/data/useAsync'
import { formatCompact } from '../../lib/format'
import { CAMPAIGN_STATE_META } from './campaignMeta'
import styles from './CampaignCard.module.css'

function KeyStat({ label, value, loading }: { label: string; value: string; loading?: boolean }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statLabel}>{label}</div>
      {loading ? (
        <Skeleton variant="text" width={44} />
      ) : (
        <div className={styles.statValue}>{value}</div>
      )}
    </div>
  )
}

/** CampaignCard — one campaign summary in the Campaigns grid. Loads its own snapshot. */
export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const source = useDataSource()
  const navigate = useNavigate()
  const { data: snapshot, loading } = useAsync(
    () => source.getLatestSnapshot(campaign.id),
    [campaign.id],
  )
  const meta = CAMPAIGN_STATE_META[campaign.state]

  // Current-phase caption for the minimal timeline strip.
  const total = campaign.phases.length
  const activeIdx = campaign.phases.findIndex((p) => p.status === 'active')
  const doneCount = campaign.phases.filter((p) => p.status === 'done').length
  const current = activeIdx >= 0 ? campaign.phases[activeIdx] : undefined
  const phaseCaption = current
    ? `Phase ${activeIdx + 1} of ${total} · ${current.label}`
    : doneCount === total
      ? 'All phases complete'
      : `${doneCount} of ${total} phases done`

  const sent = snapshot?.email
    ? formatCompact(snapshot.email.emailsSent)
    : snapshot?.linkedin
      ? formatCompact(snapshot.linkedin.connectionsSent)
      : '—'
  const sentLabel = campaign.channels.includes('email') ? 'Emails sent' : 'Invites sent'
  const totalReplies =
    (snapshot?.email?.totalReplies ?? 0) + (snapshot?.linkedin?.totalReplies ?? 0)

  return (
    <Card variant="outlined" onClick={() => navigate(`/campaigns/${campaign.id}`)} className={styles.card}>
      <div className={styles.head}>
        <div className={styles.name}>{campaign.name}</div>
        <Badge variant={meta.badge}>{meta.label}</Badge>
      </div>

      <div className={styles.channels}>
        {campaign.channels.includes('email') && (
          <span className={styles.channel}>
            <ChannelIcon channel="email" size="xs" /> Email
          </span>
        )}
        {campaign.channels.includes('linkedin') && (
          <span className={styles.channel}>
            <ChannelIcon channel="linkedin" px={12} /> LinkedIn
          </span>
        )}
      </div>

      <div className={styles.timeline}>
        <Timeline phases={campaign.phases} orientation="horizontal" density="minimal" />
        <div className={styles.phaseCaption}>{phaseCaption}</div>
      </div>

      <div className={styles.stats}>
        <KeyStat label={sentLabel} value={sent} loading={loading} />
        <KeyStat label="Replies" value={formatCompact(totalReplies)} loading={loading} />
        <KeyStat
          label="Meetings"
          value={snapshot ? formatCompact(snapshot.outcomes.meetingsBooked) : '—'}
          loading={loading}
        />
      </div>
    </Card>
  )
}
