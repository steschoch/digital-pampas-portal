import { StatCard } from '@steschoch/digital-pampas-ds'
import type { MetricsSnapshot } from '../../data/types'
import { formatCompact, formatCurrencyCompact } from '../../lib/format'
import layout from '../../styles/layout.module.css'

interface KpiRowProps {
  snapshot: MetricsSnapshot | undefined
  loading?: boolean
}

/**
 * KpiRow — the four business-result KPIs (architecture §5.3): result metrics
 * before operational ones.
 *
 * NOTE (C-03): deltas + sparklines were removed. They all reused the email-reply
 * trend, so "Meetings booked ↓4%" etc. were not measuring their own metric — a
 * false-precision honesty risk in a product that sells "the numbers speak".
 * TODO: reintroduce a per-metric delta once the backend provides a true time
 * series per KPI (from the snapshot history), labelled "vs. prior 12 days".
 */
export function KpiRow({ snapshot, loading }: KpiRowProps) {
  const o = snapshot?.outcomes
  const r = snapshot?.replies

  return (
    <div className={layout.kpiGrid}>
      <StatCard
        label="Meetings booked"
        value={o ? formatCompact(o.meetingsBooked) : '—'}
        loading={loading}
      />
      <StatCard
        label="Opportunities"
        value={o ? formatCompact(o.opportunities) : '—'}
        loading={loading}
      />
      <StatCard
        label="Pipeline value"
        value={o ? formatCurrencyCompact(o.pipelineValueUsd) : '—'}
        loading={loading}
      />
      <StatCard
        label="Interested replies"
        value={r ? formatCompact(r.interested) : '—'}
        loading={loading}
      />
    </div>
  )
}
