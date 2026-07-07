import { BarChart, ChartPanel, FunnelChart } from '@steschoch/digital-pampas-ds'
import type { QualificationMetrics } from '../../data/types'
import { formatCompact } from '../../lib/format'
import layout from '../../styles/layout.module.css'

/** Qualification (Clay) — sourcing funnel + ICP-score distribution. */
export function Qualification({
  qualification,
  loading,
}: {
  qualification: QualificationMetrics | undefined
  loading?: boolean
}) {
  const q = qualification
  return (
    <div className={layout.twoCol}>
      <ChartPanel title="Qualification funnel" loading={loading} empty={!loading && !q}>
        {q && (
          <FunnelChart
            stages={[
              { label: 'Sourced', value: q.leadsSourced, colorVar: 'var(--dp-color-primary)' },
              { label: 'Verified', value: q.verifiedContacts, colorVar: 'var(--dp-color-phase-sky)' },
              { label: 'Qualified', value: q.qualifiedLeads, colorVar: 'var(--dp-color-phase-violet)' },
            ]}
            yFormat={(v) => formatCompact(v)}
            ariaLabel="Qualification funnel: sourced, verified, qualified"
          />
        )}
      </ChartPanel>

      <ChartPanel title="ICP score distribution" loading={loading} empty={!loading && !q}>
        {q && (
          <BarChart
            bars={q.icpScoreDistribution.map((b) => ({
              label: b.bucket,
              value: b.count,
              colorVar: 'var(--dp-color-primary)',
            }))}
            yFormat={(v) => formatCompact(v)}
            ariaLabel="ICP score distribution by bucket"
          />
        )}
      </ChartPanel>
    </div>
  )
}
