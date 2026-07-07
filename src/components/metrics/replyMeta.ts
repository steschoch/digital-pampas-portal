import type { ReplyCategory } from '../../data/types'

type BadgeVariant = 'success' | 'warning' | 'neutral'

export const REPLY_CATEGORY_META: Record<
  ReplyCategory,
  { label: string; badge: BadgeVariant; colorVar: string }
> = {
  interested: { label: 'Interested', badge: 'success', colorVar: 'var(--dp-color-status-success-500)' },
  not_now: { label: 'Not now', badge: 'warning', colorVar: 'var(--dp-color-status-warning-500)' },
  not_interested: {
    label: 'Not interested',
    badge: 'neutral',
    colorVar: 'var(--dp-color-on-surface-variant)',
  },
}
