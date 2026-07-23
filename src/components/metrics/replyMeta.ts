import type { ReplyCategory } from '../../data/types'

type BadgeVariant = 'success' | 'warning' | 'neutral'

/**
 * Colors point at the SEMANTIC tokens, not the raw primitives. The primitives are
 * fixed hexes, so the donut's green stayed #2efc73 while every other success
 * signal (Gauge, badges) resolved to the dark-mode green — two different greens
 * in the same fold (audit AS-07). Semantic tokens flip with the theme, so all
 * success signals now agree in both modes.
 */
export const REPLY_CATEGORY_META: Record<
  ReplyCategory,
  { label: string; badge: BadgeVariant; colorVar: string }
> = {
  interested: { label: 'Interested', badge: 'success', colorVar: 'var(--dp-color-success)' },
  not_now: { label: 'Not now', badge: 'warning', colorVar: 'var(--dp-color-warning)' },
  not_interested: {
    label: 'Not interested',
    badge: 'neutral',
    colorVar: 'var(--dp-color-on-surface-variant)',
  },
}
