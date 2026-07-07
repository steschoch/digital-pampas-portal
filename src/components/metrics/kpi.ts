import type { StatDelta } from '@steschoch/digital-pampas-ds'
import type { SeriesPoint } from '../../data/types'

export interface Trend {
  /** Last N daily values for a Sparkline. */
  spark: number[]
  /** Recent-vs-prior delta, or undefined when not computable. */
  delta?: StatDelta
}

/**
 * Derive a Sparkline + delta from a daily series: the spark is the trailing
 * window; the delta compares the recent half of that window to the earlier half.
 */
export function trendFromSeries(
  points: SeriesPoint[] | undefined,
  window = 24,
  positiveIsGood = true,
): Trend {
  if (!points || points.length === 0) return { spark: [] }
  const tail = points.slice(-window)
  const spark = tail.map((p) => p.value)
  if (tail.length < 4) return { spark }

  const mid = Math.floor(tail.length / 2)
  const prior = tail.slice(0, mid).reduce((a, p) => a + p.value, 0)
  const recent = tail.slice(mid).reduce((a, p) => a + p.value, 0)
  if (prior === 0) return { spark }

  const changePct = ((recent - prior) / prior) * 100
  const rounded = Math.round(Math.abs(changePct))
  if (rounded === 0) return { spark }

  return {
    spark,
    delta: {
      value: `${rounded}%`,
      direction: changePct >= 0 ? 'up' : 'down',
      positiveIsGood,
    },
  }
}
