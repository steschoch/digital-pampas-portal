/** Formatting helpers — display only, no business logic. */

/** 12430 → "12.4k", 1180 → "1,180", 8 → "8". Compact only kicks in at 10k so
 *  four-digit counts stay exact and legible (C-36). */
export function formatCompact(n: number): string {
  if (Math.abs(n) >= 10000) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(n)
  }
  return new Intl.NumberFormat('en-US').format(n)
}

/** 86000 → "$86k", 142000 → "$142k". */
export function formatCurrencyCompact(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n)
}

/** 4.2 → "4.2%". */
export function formatPct(n: number): string {
  return `${n % 1 === 0 ? n : n.toFixed(1)}%`
}

/** Date-only strings ("2026-06-01") are parsed as UTC midnight; render them in
 *  UTC too so they don't shift a day west of UTC (the "June" → "May 31" bug).
 *  Full timestamps keep local rendering. (C-09) */
const isDateOnly = (iso: string) => /^\d{4}-\d{2}-\d{2}$/.test(iso)

/** ISO → "Jun 24". */
export function formatShortDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  if (isDateOnly(iso)) opts.timeZone = 'UTC'
  return d.toLocaleDateString('en-US', opts)
}

/** ISO → "Jun 24, 2026". */
export function formatLongDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  if (isDateOnly(iso)) opts.timeZone = 'UTC'
  return d.toLocaleDateString('en-US', opts)
}

/**
 * Relative time from a reference "now" → "2h ago", "3d ago", "just now".
 * Reference defaults to the demo's data horizon so "Last sync" reads sensibly.
 */
const DEMO_NOW = '2026-07-02T00:00:00Z'

export function formatRelative(iso: string, nowIso: string = DEMO_NOW): string {
  const then = new Date(iso).getTime()
  const now = new Date(nowIso).getTime()
  if (Number.isNaN(then) || Number.isNaN(now)) return iso
  const diffMs = now - then
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}
