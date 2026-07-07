import { useMemo, useState } from 'react'
import { Badge, DataTable, Tabs, type DataColumn, type DataRow } from '@steschoch/digital-pampas-ds'
import type { LeadReply, ReplyCategory } from '../../data/types'
import { ChannelIcon } from '../icons/ChannelIcon'
import { formatShortDate } from '../../lib/format'
import { REPLY_CATEGORY_META } from './replyMeta'

type TabId = 'all' | ReplyCategory

/** RepliesTable — filterable inbox table (Tabs by category + DataTable). */
export function RepliesTable({ replies, loading }: { replies: LeadReply[]; loading?: boolean }) {
  const [tab, setTab] = useState<TabId>('all')

  const counts = useMemo(() => {
    const c = { all: replies.length, interested: 0, not_now: 0, not_interested: 0 }
    for (const r of replies) c[r.category] += 1
    return c
  }, [replies])

  const filtered = tab === 'all' ? replies : replies.filter((r) => r.category === tab)

  const columns: DataColumn[] = [
    {
      key: 'contactName',
      header: 'Contact',
      render: (row) => {
        const r = row as unknown as LeadReply
        return (
          <div>
            <div style={{ fontWeight: 'var(--dp-font-weight-medium)' }}>{r.contactName}</div>
            {r.contactTitle && (
              <div style={{ fontSize: '0.8125rem', color: 'var(--dp-color-on-surface-variant)' }}>
                {r.contactTitle}
              </div>
            )}
          </div>
        )
      },
    },
    { key: 'company', header: 'Company' },
    {
      key: 'channel',
      header: 'Channel',
      align: 'center',
      render: (row) => {
        const r = row as unknown as LeadReply
        return <ChannelIcon channel={r.channel} size="sm" px={16} />
      },
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => {
        const r = row as unknown as LeadReply
        const meta = REPLY_CATEGORY_META[r.category]
        return <Badge variant={meta.badge}>{meta.label}</Badge>
      },
    },
    {
      key: 'snippet',
      header: 'Reply',
      width: '32%',
      render: (row) => {
        const r = row as unknown as LeadReply
        return (
          <span
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: 'var(--dp-color-on-surface-variant)',
            }}
            title={r.snippet}
          >
            “{r.snippet}”
          </span>
        )
      },
    },
    {
      key: 'icpScore',
      header: 'ICP',
      align: 'right',
      render: (row) => {
        const r = row as unknown as LeadReply
        return r.icpScore != null ? String(r.icpScore) : '—'
      },
    },
    {
      key: 'receivedAt',
      header: 'Received',
      align: 'right',
      render: (row) => {
        const r = row as unknown as LeadReply
        return formatShortDate(r.receivedAt)
      },
    },
  ]

  return (
    <div>
      <Tabs
        tabs={[
          { id: 'all', label: 'All', count: counts.all },
          { id: 'interested', label: 'Interested', count: counts.interested },
          { id: 'not_now', label: 'Not now', count: counts.not_now },
          { id: 'not_interested', label: 'Not interested', count: counts.not_interested },
        ]}
        active={tab}
        onChange={(id) => setTab(id as TabId)}
        aria-label="Filter replies by category"
      />
      <div style={{ marginTop: 'var(--dp-space-200)' }}>
        <DataTable
          columns={columns}
          rows={filtered as unknown as DataRow[]}
          sortable
          loading={loading}
          emptyTitle="No replies yet"
          emptyDescription="No replies match this filter. When the campaign is in warm-up, replies take a little time to arrive."
        />
      </div>
    </div>
  )
}
