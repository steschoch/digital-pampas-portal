import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, EmptyState, Icon, Skeleton, Timeline, type LineSeries } from '@steschoch/digital-pampas-ds'
import { useDataSource } from '../../lib/data/PortalDataContext'
import { useAsync } from '../../lib/data/useAsync'
import { useMergedSeries } from '../../lib/useSeries'
import { useSelection, ALL_CAMPAIGNS } from '../../lib/selection/SelectionContext'
import { formatRelative } from '../../lib/format'
import { PageHeader, LastSync } from '@steschoch/digital-pampas-ds'
import { KpiRow } from '../metrics/KpiRow'
import { ActivityChart } from '../metrics/ActivityChart'
import { ReplyDonut } from '../metrics/ReplyDonut'
import { EmailChannelCard, LinkedInChannelCard } from '../metrics/ChannelCards'
import { Qualification } from '../metrics/Qualification'
import { RepliesTable } from '../metrics/RepliesTable'
import { CAMPAIGN_STATE_META } from './campaignMeta'
import layout from '../../styles/layout.module.css'
import styles from './CampaignDetailView.module.css'

/** The full campaign dossier. Shared by /campaigns/:id and the Campaigns page
 *  when a single campaign is selected in the global dropdown. */
export function CampaignDetailView({ id }: { id: string }) {
  const source = useDataSource()
  const navigate = useNavigate()
  const { setCampaign } = useSelection()

  const { data: campaign, loading: campaignLoading } = useAsync(() => source.getCampaign(id), [id])
  const { data: snapshot, loading: snapLoading } = useAsync(() => source.getLatestSnapshot(id), [id])
  const { data: replies, loading: repliesLoading } = useAsync(() => source.getReplies([id]), [id])

  const emailsSent = useMergedSeries([id], 'emailsSent')
  const emailReplies = useMergedSeries([id], 'replies')
  const connections = useMergedSeries([id], 'connectionsSent')
  const liReplies = useMergedSeries([id], 'linkedinReplies')

  // Refine the document title with the campaign name once loaded (C-25).
  useEffect(() => {
    if (campaign?.name) document.title = `${campaign.name} — Digital Pampas`
  }, [campaign?.name])

  const backToAll = () => {
    setCampaign(ALL_CAMPAIGNS)
    navigate('/campaigns')
  }

  if (campaignLoading) {
    return (
      <div className={layout.stack}>
        <Skeleton variant="text" width={280} />
        <Skeleton variant="rect" height={160} />
        <Skeleton variant="rect" height={120} />
      </div>
    )
  }

  if (!campaign) {
    return (
      <EmptyState
        icon={<Icon name="SearchX" size="xl" />}
        title="Campaign not found"
        description="This campaign doesn't exist or isn't available for your account."
        action={
          <Button variant="secondary" onClick={backToAll}>
            Back to campaigns
          </Button>
        }
      />
    )
  }

  const hasEmail = campaign.channels.includes('email')
  const hasLinkedIn = campaign.channels.includes('linkedin')
  const meta = CAMPAIGN_STATE_META[campaign.state]

  const activitySeries: LineSeries[] = hasEmail
    ? [
        { label: 'Emails sent', colorVar: 'var(--dp-color-primary)', points: emailsSent.data ?? [] },
        { label: 'Replies', colorVar: 'var(--dp-color-phase-coral)', points: emailReplies.data ?? [] },
      ]
    : [
        { label: 'Invites sent', colorVar: 'var(--dp-color-phase-sky)', points: connections.data ?? [] },
        { label: 'Replies', colorVar: 'var(--dp-color-phase-violet)', points: liReplies.data ?? [] },
      ]
  const activityLoading = hasEmail
    ? emailsSent.loading || emailReplies.loading
    : connections.loading || liReplies.loading

  return (
    <div className={layout.stack}>
      <PageHeader
        eyebrow={
          <button type="button" onClick={backToAll} className={styles.back}>
            <Icon name="ArrowLeft" size="xs" /> All campaigns
          </button>
        }
        title={
          <span className={styles.titleRow}>
            {campaign.name}
            <Badge variant={meta.badge}>{meta.label}</Badge>
          </span>
        }
        aside={
          snapshot ? (
            <span className={styles.syncAside}>
              <Badge variant="neutral">Demo dataset</Badge>
              <LastSync label={formatRelative(snapshot.capturedAt)} />
            </span>
          ) : undefined
        }
      />

      <section>
        <h2 className={layout.sectionTitle}>Timeline</h2>
        <Timeline phases={campaign.phases} orientation="vertical" density="detailed" />
      </section>

      <section>
        <h2 className={layout.sectionTitle}>Results</h2>
        <KpiRow
          snapshot={snapshot}
          loading={snapLoading}
        />
      </section>

      <section className={layout.chartSplit}>
        <ActivityChart series={activitySeries} loading={activityLoading} />
        <ReplyDonut replies={snapshot?.replies} loading={snapLoading} />
      </section>

      <section>
        <h2 className={layout.sectionTitle}>Channels</h2>
        <div className={layout.channelGrid}>
          {hasEmail && snapshot?.email && <EmailChannelCard email={snapshot.email} detailed />}
          {hasLinkedIn && snapshot?.linkedin && (
            <LinkedInChannelCard linkedin={snapshot.linkedin} detailed />
          )}
        </div>
      </section>

      <section>
        <h2 className={layout.sectionTitle}>Qualification (Clay)</h2>
        <Qualification qualification={snapshot?.qualification} loading={snapLoading} />
      </section>

      <section>
        <h2 className={layout.sectionTitle}>Replies</h2>
        <RepliesTable replies={replies ?? []} loading={repliesLoading} />
      </section>
    </div>
  )
}
