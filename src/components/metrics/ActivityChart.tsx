import { ChartPanel, LineChart, type LineSeries } from '@steschoch/digital-pampas-ds'
import { formatCompact } from '../../lib/format'

interface ActivityChartProps {
  series: LineSeries[]
  loading?: boolean
  title?: string
}

/** ActivityChart — sent vs. replies over time (or any 1–3 series).
 *  Slices each series to the last 30 days so the "(30d)" window in the title is
 *  truthful (the raw series holds ~90 days). (C-08 + C-24 wording) */
export function ActivityChart({ series, loading, title = 'Activity & replies (30d)' }: ActivityChartProps) {
  const series30 = series.map((s) => ({ ...s, points: s.points.slice(-30) }))
  const hasData = series30.some((s) => s.points.length > 0)
  const legend = series30.map((s) => ({ label: s.label, colorVar: s.colorVar }))

  return (
    <ChartPanel
      title={title}
      legend={legend}
      loading={loading}
      empty={!loading && !hasData}
      emptyTitle="No activity yet"
      emptyDescription="Sending activity will show up here once the campaign starts."
    >
      {/* Authored, not stock (audit AS-08): the primary series gets an area so it
          reads as volume, the reference lines drop to three, and the per-day dots
          come off — at 30 daily points they only added serration. */}
      <LineChart
        series={series30}
        height={260}
        yFormat={(v) => formatCompact(v)}
        showGrid
        gridLines={3}
        showDots={false}
        area
        ariaLabel={title}
      />
    </ChartPanel>
  )
}
