import type { SeriesMetric, SeriesPoint } from '../data/types'
import { useDataSource } from './data/PortalDataContext'
import { useAsync, type AsyncState } from './data/useAsync'

/** Merge several campaigns' series into one, summing values by date. */
function mergeByDate(pointsList: SeriesPoint[][]): SeriesPoint[] {
  const byDate = new Map<string, number>()
  for (const points of pointsList) {
    for (const p of points) {
      byDate.set(p.date, (byDate.get(p.date) ?? 0) + p.value)
    }
  }
  return [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([date, value]) => ({ date, value }))
}

/**
 * useMergedSeries — a metric's daily series summed across the campaigns in scope.
 * Returns an empty series if none of the campaigns track that metric.
 */
export function useMergedSeries(
  campaignIds: string[],
  metric: SeriesMetric,
): AsyncState<SeriesPoint[]> {
  const source = useDataSource()
  const key = campaignIds.join(',')
  return useAsync(async () => {
    if (campaignIds.length === 0) return []
    const results = await Promise.all(campaignIds.map((id) => source.getSeries(id, metric)))
    return mergeByDate(results.filter(Boolean).map((s) => s!.points))
  }, [key, metric])
}
