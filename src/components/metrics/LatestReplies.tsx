import { Link } from 'react-router-dom'
import { Badge, Card, EmptyState, Icon, Skeleton } from '@steschoch/digital-pampas-ds'
import type { LeadReply } from '../../data/types'
import { ChannelIcon } from '../icons/ChannelIcon'
import { formatRelative } from '../../lib/format'
import { REPLY_CATEGORY_META } from './replyMeta'
import styles from './metrics.module.css'

interface LatestRepliesProps {
  replies: LeadReply[]
  loading?: boolean
  title?: string
  viewAllHref?: string
}

/** LatestReplies — compact list of recent replies with a "View all" link. */
export function LatestReplies({
  replies,
  loading,
  title = 'Latest interested replies',
  viewAllHref = '/replies',
}: LatestRepliesProps) {
  return (
    <Card variant="outlined" className={styles.channelCard}>
      <div className={styles.sectionAction}>
        <div className={styles.channelTitle}>{title}</div>
        <Link to={viewAllHref} style={{ color: 'var(--dp-color-primary)', fontSize: '0.875rem' }}>
          View all →
        </Link>
      </div>

      {loading ? (
        <div className={styles.repliesList}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div className={styles.replyRow} key={i}>
              <Skeleton variant="text" lines={2} width="100%" />
            </div>
          ))}
        </div>
      ) : replies.length === 0 ? (
        <EmptyState
          icon={<Icon name="Inbox" size="lg" />}
          title="No replies yet"
          description="Interested replies will show up here as the campaign gets responses."
        />
      ) : (
        <div className={styles.repliesList}>
          {replies.map((r) => {
            const meta = REPLY_CATEGORY_META[r.category]
            return (
              <div className={styles.replyRow} key={r.id}>
                <ChannelIcon channel={r.channel} size="sm" px={16} />
                <div className={styles.replyMeta}>
                  <div className={styles.replyName}>
                    {r.contactName}
                    {r.contactTitle ? ` — ${r.contactTitle}, ` : ' — '}
                    {r.company}
                  </div>
                  <div className={styles.replySnippet}>“{r.snippet}”</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <Badge variant={meta.badge}>{meta.label}</Badge>
                  <span className={styles.replyContext}>{formatRelative(r.receivedAt)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
