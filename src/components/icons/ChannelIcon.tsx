import { Icon, SocialIcon } from '@steschoch/digital-pampas-ds'
import type { Channel } from '../../data/types'

/**
 * ChannelIcon — the right glyph per channel, both sourced from the DS
 * (Mail via `Icon`, LinkedIn via `SocialIcon` — no local/inline brand glyphs).
 */
export function ChannelIcon({
  channel,
  size = 'sm',
  px = 16,
}: {
  channel: Channel
  /** DS Icon size (used for the email glyph). */
  size?: 'xs' | 'sm' | 'md'
  /** Pixel size for the LinkedIn glyph. */
  px?: number
}) {
  if (channel === 'email') return <Icon name="Mail" size={size} />
  return <SocialIcon name="linkedin" size={px} />
}
