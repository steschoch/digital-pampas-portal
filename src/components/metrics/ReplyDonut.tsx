import { ChartPanel, DonutChart } from '@steschoch/digital-pampas-ds'
import type { ReplyBreakdown } from '../../data/types'
import { REPLY_CATEGORY_META } from './replyMeta'

/** ReplyDonut — reply breakdown as a donut (Interested / Not now / Not interested). */
export function ReplyDonut({
  replies,
  loading,
}: {
  replies: ReplyBreakdown | undefined
  loading?: boolean
}) {
  const total = replies ? replies.interested + replies.notNow + replies.notInterested : 0
  const segments = replies
    ? [
        { label: 'Interested', value: replies.interested, colorVar: REPLY_CATEGORY_META.interested.colorVar },
        { label: 'Not now', value: replies.notNow, colorVar: REPLY_CATEGORY_META.not_now.colorVar },
        {
          label: 'Not interested',
          value: replies.notInterested,
          colorVar: REPLY_CATEGORY_META.not_interested.colorVar,
        },
      ]
    : []

  return (
    <ChartPanel
      title="Reply breakdown"
      loading={loading}
      empty={!loading && total === 0}
      emptyTitle="No replies yet"
      emptyDescription="Categorized replies will appear here once the campaign gets responses."
    >
      <DonutChart
        segments={segments}
        centerLabel="Total replies"
        centerValue={String(total)}
        ariaLabel="Reply breakdown by category"
      />
    </ChartPanel>
  )
}
