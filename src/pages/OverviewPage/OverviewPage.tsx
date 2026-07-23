import { useMemo } from 'react'
import { Badge, Timeline, type LineSeries } from '@steschoch/digital-pampas-ds'
import { useDataSource } from '../../lib/data/PortalDataContext'
import { useAsync } from '../../lib/data/useAsync'
import { useScope } from '../../lib/useScope'
import { useResponsive } from '../../lib/useMediaQuery'
import { useMergedSeries } from '../../lib/useSeries'
import { formatCompact, formatCurrencyCompact, formatRelative } from '../../lib/format'
import { PageHeader, LastSync } from '@steschoch/digital-pampas-ds'
import { KpiRow } from '../../components/metrics/KpiRow'
import { ActivityChart } from '../../components/metrics/ActivityChart'
import { ReplyDonut } from '../../components/metrics/ReplyDonut'
import { EmailChannelCard, LinkedInChannelCard } from '../../components/metrics/ChannelCards'
import { LatestReplies } from '../../components/metrics/LatestReplies'
import { ScopeFilterChip } from '../../components/ScopeFilterChip/ScopeFilterChip'
import type { Channel } from '../../data/types'
import layout from '../../styles/layout.module.css'
import styles from './OverviewPage.module.css'

export function OverviewPage() {
  const source = useDataSource()
  const scope = useScope()
  const { isMobile } = useResponsive()
  const { campaignIds, isAll, client, selectedCampaign, campaigns } = scope
  const timelineOrientation = isMobile ? 'vertical' : 'horizontal'
  const key = campaignIds.join(',')

  // Snapshot for the current scope (single campaign or the aggregate).
  const { data: snapshot, loading: snapLoading } = useAsync(
    () => (isAll ? source.getAggregateSnapshot(campaignIds) : source.getLatestSnapshot(campaignIds[0])),
    [key, isAll],
  )

  // Merged daily series (called unconditionally; used per channel below).
  const emailsSent = useMergedSeries(campaignIds, 'emailsSent')
  const emailReplies = useMergedSeries(campaignIds, 'replies')
  const connections = useMergedSeries(campaignIds, 'connectionsSent')
  const liReplies = useMergedSeries(campaignIds, 'linkedinReplies')

  const { data: replies, loading: repliesLoading } = useAsync(
    () => source.getReplies(campaignIds),
    [key],
  )

  // Channels present in the current scope.
  const channels = useMemo<Channel[]>(() => {
    const scoped = campaigns.filter((c) => campaignIds.includes(c.id))
    const set = new Set<Channel>()
    scoped.forEach((c) => c.channels.forEach((ch) => set.add(ch)))
    return [...set]
  }, [campaigns, campaignIds])

  const hasEmail = channels.includes('email')
  const hasLinkedIn = channels.includes('linkedin')

  // Activity lines: email campaigns show sent+replies; LinkedIn-only shows invites+replies.
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

  const interested = (replies ?? []).filter((r) => r.category === 'interested').slice(0, 5)

  const scopeLabel = isAll ? 'All campaigns' : selectedCampaign?.name ?? '—'
  const syncLabel = snapshot ? formatRelative(snapshot.capturedAt) : '—'
  // Cumulative campaign figures — OutcomeMetrics carries no period, so the lede
  // says "to date" rather than claiming a window the data doesn't support.
  const outcomes = snapshot?.outcomes

  return (
    <div className={`${layout.stack} ${layout.stackGrouped}`}>
      <div className={layout.group}>
        <PageHeader
          eyebrow="Dashboard"
          title="Overview"
          subtitle={`${client?.name ?? '—'} · ${scopeLabel}`}
          aside={
            <span className={styles.syncAside}>
              <Badge variant="neutral">Demo dataset</Badge>
              <LastSync label={syncLabel} />
            </span>
          }
        />

        <ScopeFilterChip />
      </div>

      {/* The answer, before anything operational. No section title on purpose:
          this block IS the page's opening statement, and one figure leads. */}
      <section className={layout.roleHero}>
        {outcomes && (
          <p className={styles.lede}>
            <strong>{formatCompact(outcomes.meetingsBooked)} meetings booked</strong> and{' '}
            <strong>{formatCurrencyCompact(outcomes.pipelineValueUsd)} in pipeline</strong>
            {isAll ? ' across all campaigns' : ` on ${selectedCampaign?.name ?? ''}`}, to date.
          </p>
        )}
        <KpiRow snapshot={snapshot} loading={snapLoading} />
      </section>

      {/* Where the work stands. */}
      <section>
        <h2 className={layout.sectionTitle}>Campaign status</h2>
        {isAll ? (
          <div className={styles.timelineStack}>
            {campaigns
              .filter((c) => campaignIds.includes(c.id))
              .map((c) => (
                <div key={c.id} className={styles.timelineRow}>
                  <div className={styles.timelineLabel}>{c.name}</div>
                  <Timeline phases={c.phases} orientation={timelineOrientation} density="compact" animate />
                </div>
              ))}
          </div>
        ) : selectedCampaign ? (
          <Timeline phases={selectedCampaign.phases} orientation={timelineOrientation} density="compact" animate />
        ) : null}
      </section>

      {/* Performance — activity, reply mix and channels bind into one block, so
          the page reads as a few groups instead of a list of equal sections. */}
      <div className={layout.group}>
        <section className={layout.chartSplit}>
          <ActivityChart series={activitySeries} loading={activityLoading} />
          <ReplyDonut replies={snapshot?.replies} loading={snapLoading} />
        </section>

        {/* Conditional channel blocks — only channels the scope actually runs. */}
        {(hasEmail || hasLinkedIn) && (
          <section>
            <h2 className={layout.sectionTitle}>Channels</h2>
            <div className={layout.channelGrid}>
              {hasEmail && snapshot?.email && <EmailChannelCard email={snapshot.email} />}
              {hasLinkedIn && snapshot?.linkedin && <LinkedInChannelCard linkedin={snapshot.linkedin} />}
            </div>
          </section>
        )}
      </div>

      {/* Latest interested replies. */}
      <section>
        <LatestReplies replies={interested} loading={repliesLoading} />
      </section>
    </div>
  )
}
