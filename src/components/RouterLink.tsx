import { Link } from 'react-router-dom'
import type { LinkRenderer } from '@steschoch/digital-pampas-ds'

/**
 * A DS `LinkRenderer` backed by react-router — passed to components (Sidebar,
 * BlogCard-style) so their internal `href` links become client-side navigations.
 */
export const routerLink: LinkRenderer = ({ href, className, children, ...rest }) => (
  <Link to={href} className={className} {...rest}>
    {children}
  </Link>
)
