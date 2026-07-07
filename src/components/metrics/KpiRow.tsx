import { StatCard, Sparkline } from '@steschoch/digital-pampas-ds'
import type { MetricsSnapshot, SeriesPoint } from '../../data/types'
import { formatCompact, formatCurrencyCompact } from '../../lib/format'
import { trendFromSeries } from './kpi'
import layout from '../../styles/layout.module.css'

interface KpiRowProps {
  snapshot: MetricsSnapshot | undefined
  /** Trend source for outcome/reply momentum. */
  repliesSeries: SeriesPoint[]
  /** Trend source for volume/pipeline momentum. */
  volumeSeries: SeriesPoint[]
  loading?: boolean
}

/**
 * KpiRow — the four business-result KPIs (architecture §5.3): result metrics
 * before operational ones. Each card shows value, delta and a trend sparkline.
 */
export function KpiRow({ snapshot, repliesSeries, volumeSeries, loading }: KpiRowProps) {
  const repliesTrend = trendFromSeries(repliesSeries)
  const volumeTrend = trendFromSeries(volumeSeries)
  const o = snapshot?.outcomes
  const r = snapshot?.replies

  return (
    <div className={layout.kpiGrid}>
      <StatCard
        label="Meetings booked"
        value={o ? formatCompact(o.meetingsBooked) : '—'}
        delta={repliesTrend.delta}
        loading={loading}
      >
        {repliesTrend.spark.length > 0 && (
          <Sparkline points={repliesTrend.spark} colorVar="var(--dp-color-primary)" fill />
        )}
      </StatCard>

      <StatCard
        label="Opportunities"
        value={o ? formatCompact(o.opportunities) : '—'}
        delta={repliesTrend.delta}
        loading={loading}
      >
        {repliesTrend.spark.length > 0 && (
          <Sparkline points={repliesTrend.spark} colorVar="var(--dp-color-phase-violet)" fill />
        )}
      </StatCard>

      <StatCard
        label="Pipeline value"
        value={o ? formatCurrencyCompact(o.pipelineValueUsd) : '—'}
        delta={volumeTrend.delta}
        loading={loading}
      >
        {volumeTrend.spark.length > 0 && (
          <Sparkline points={volumeTrend.spark} colorVar="var(--dp-color-phase-coral)" fill />
        )}
      </StatCard>

      <StatCard
        label="Interested replies"
        value={r ? formatCompact(r.interested) : '—'}
        delta={repliesTrend.delta}
        loading={loading}
      >
        {repliesTrend.spark.length > 0 && (
          <Sparkline points={repliesTrend.spark} colorVar="var(--dp-color-phase-sky)" fill />
        )}
      </StatCard>
    </div>
  )
}
