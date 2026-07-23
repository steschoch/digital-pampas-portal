import { Badge, Card, FunnelChart, Gauge, Icon } from '@steschoch/digital-pampas-ds'
import type { EmailChannelMetrics, LinkedInChannelMetrics } from '../../data/types'
import { ChannelIcon } from '../icons/ChannelIcon'
import { formatCompact, formatPct } from '../../lib/format'
import styles from './metrics.module.css'

function Metric({ label, value, badge }: { label: string; value: string; badge?: React.ReactNode }) {
  return (
    <div className={styles.metric}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricValue}>
        <span>{value}</span>
        {badge}
      </div>
    </div>
  )
}

/**
 * Domain reputation as a number plus a qualitative band. Same information the
 * second radial gauge carried, at a fraction of the ink — a pair of gauges side
 * by side is the stock-dashboard tell (audit AS-03), so the radial format is
 * reserved for ONE signature indicator (deliverability). Bands match the
 * thresholds the gauge used: good ≥ 85, warn ≥ 70.
 */
function reputationBand(value: number): { label: string; variant: 'success' | 'warning' | 'error' } {
  if (value >= 85) return { label: 'Strong', variant: 'success' }
  if (value >= 70) return { label: 'Watch', variant: 'warning' }
  return { label: 'At risk', variant: 'error' }
}

/** EmailChannelCard — email metrics (SmartLead). Renders only for email campaigns. */
export function EmailChannelCard({
  email,
  detailed = false,
}: {
  email: EmailChannelMetrics
  detailed?: boolean
}) {
  const bounceMet = email.bounceRatePct < 2
  const reputation = reputationBand(email.domainReputation)
  return (
    <Card variant="outlined" className={styles.channelCard}>
      <div className={styles.channelHead}>
        <div className={styles.channelTitle}>
          <Icon name="Mail" size="sm" />
          Email
        </div>
        <Badge variant={email.warmupStatus === 'ready' ? 'success' : 'warning'}>
          {email.warmupStatus === 'ready' ? 'Ready' : 'Warming'}
        </Badge>
      </div>

      <div className={styles.channelBody}>
        <div className={styles.metricList}>
          <Metric label="Sent" value={formatCompact(email.emailsSent)} />
          <Metric label="Reply rate" value={formatPct(email.replyRatePct)} />
          <Metric label="Open rate" value={formatPct(email.openRatePct)} />
          <Metric
            label="Bounce rate"
            value={formatPct(email.bounceRatePct)}
            badge={
              bounceMet ? (
                <Badge variant="success">
                  <Icon name="Check" size="xs" /> under 2% target
                </Badge>
              ) : (
                <Badge variant="warning">above 2% target</Badge>
              )
            }
          />
          {detailed && (
            <>
              <Metric label="Active inboxes" value={String(email.activeInboxes)} />
              <Metric label="Active domains" value={String(email.activeDomains)} />
            </>
          )}
        </div>

        {/* Infrastructure health, grouped: ONE radial (the signature indicator for
            an outbound engine) plus the reputation it depends on. A second gauge
            beside the first is the stock-dashboard tell (AS-03). */}
        <div className={styles.healthCol}>
          <Gauge
            value={email.deliverabilityPct}
            label="Deliverability"
            format="percent"
            thresholds={{ warn: 90, good: 95 }}
            size={detailed ? 132 : 120}
          />
          <Metric
            label="Domain reputation"
            value={`${Math.round(email.domainReputation)}/100`}
            badge={<Badge variant={reputation.variant}>{reputation.label}</Badge>}
          />
        </div>
      </div>
    </Card>
  )
}

/** LinkedInChannelCard — LinkedIn metrics (Aimfox). Renders only for LinkedIn campaigns. */
export function LinkedInChannelCard({
  linkedin,
  detailed = false,
}: {
  linkedin: LinkedInChannelMetrics
  detailed?: boolean
}) {
  const accepted = Math.round((linkedin.connectionsSent * linkedin.acceptanceRatePct) / 100)
  const replied = linkedin.totalReplies

  return (
    <Card variant="outlined" className={styles.channelCard}>
      <div className={styles.channelHead}>
        <div className={styles.channelTitle}>
          <ChannelIcon channel="linkedin" px={18} />
          LinkedIn
        </div>
      </div>

      <div className={styles.channelBody}>
        <div className={styles.metricList}>
          <Metric label="Invites sent" value={formatCompact(linkedin.connectionsSent)} />
          <Metric label="Acceptance rate" value={formatPct(linkedin.acceptanceRatePct)} />
          <Metric label="Messages" value={formatCompact(linkedin.messagesSent)} />
          <Metric label="Reply rate (per message)" value={formatPct(linkedin.replyRatePct)} />
        </div>

        {detailed && (
          <div style={{ minWidth: 200, flex: 1 }}>
            <FunnelChart
              stages={[
                { label: 'Invites', value: linkedin.connectionsSent, colorVar: 'var(--dp-color-primary)' },
                { label: 'Accepted', value: accepted, colorVar: 'var(--dp-color-phase-sky)' },
                { label: 'Replied', value: replied, colorVar: 'var(--dp-color-phase-violet)' },
              ]}
              yFormat={(v) => formatCompact(v)}
              ariaLabel="LinkedIn funnel: invites, accepted, replied"
            />
          </div>
        )}
      </div>
    </Card>
  )
}
