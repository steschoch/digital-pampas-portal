import { ChartPanel, LineChart, type LineSeries } from '@steschoch/digital-pampas-ds'
import { formatCompact } from '../../lib/format'

interface ActivityChartProps {
  series: LineSeries[]
  loading?: boolean
  title?: string
}

/** ActivityChart — sent vs. replies over time (or any 1–3 series). */
export function ActivityChart({ series, loading, title = 'Activity & responses (30d)' }: ActivityChartProps) {
  const hasData = series.some((s) => s.points.length > 0)
  const legend = series.map((s) => ({ label: s.label, colorVar: s.colorVar }))

  return (
    <ChartPanel
      title={title}
      legend={legend}
      loading={loading}
      empty={!loading && !hasData}
      emptyTitle="No activity yet"
      emptyDescription="Sending activity will show up here once the campaign starts."
    >
      <LineChart
        series={series}
        height={260}
        yFormat={(v) => formatCompact(v)}
        showGrid
        ariaLabel={title}
      />
    </ChartPanel>
  )
}
