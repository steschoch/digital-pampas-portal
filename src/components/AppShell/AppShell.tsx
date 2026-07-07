import { useEffect, useState, type CSSProperties } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Sidebar, TopBar, ThemeToggle, Icon, Logo, type SidebarItem } from '@steschoch/digital-pampas-ds'
import { useTheme } from '../../lib/theme/ThemeContext'
import { useResponsive } from '../../lib/useMediaQuery'
import { routerLink } from '../RouterLink'
import { ClientSelector } from '../ClientSelector/ClientSelector'
import { CampaignSelector } from '../CampaignSelector/CampaignSelector'
import { UserMenu } from '../UserMenu/UserMenu'
import styles from './AppShell.module.css'

interface NavDef {
  id: string
  label: string
  href: string
  icon: string
}

const NAV: NavDef[] = [
  { id: 'overview', label: 'Overview', href: '/', icon: 'LayoutDashboard' },
  { id: 'campaigns', label: 'Campaigns', href: '/campaigns', icon: 'Megaphone' },
  { id: 'replies', label: 'Replies', href: '/replies', icon: 'MessageSquareText' },
  { id: 'reports', label: 'Reports', href: '/reports', icon: 'FileText' },
]

function isActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

/**
 * AppShell — the persistent frame (architecture §5.1). Composes the DS Sidebar +
 * TopBar around a scrollable <Outlet/>. Sidebar/TopBar never re-mount on navigation.
 */
export function AppShell() {
  const location = useLocation()
  const { scheme, toggle } = useTheme()
  const { isTablet, isMobile } = useResponsive()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close the mobile drawer whenever navigation happens.
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  const collapsed = isTablet

  const items: SidebarItem[] = NAV.map((n) => ({
    id: n.id,
    label: n.label,
    href: n.href,
    active: isActive(location.pathname, n.href),
    icon: <Icon name={n.icon as never} size="sm" />,
  }))

  const logo = (
    <Link to="/" className={styles.logoLink} aria-label="Digital Pampas — Overview">
      <Logo variant={collapsed ? 'icon' : 'wordmark'} height={collapsed ? 28 : 18} />
    </Link>
  )

  const footer = (
    <span className={styles.footerNote} title="Settings — coming soon">
      <Icon name="Settings" size="sm" />
      {!collapsed && <span>Settings · soon</span>}
    </span>
  )

  return (
    <div
      className={styles.shell}
      style={{ ['--sidebar-w' as string]: collapsed ? '64px' : '240px' } as CSSProperties}
    >
      <div className={styles.sidebarSlot}>
        <Sidebar
          items={items}
          logo={logo}
          footer={footer}
          collapsed={collapsed}
          renderLink={routerLink}
          mobileOpen={drawerOpen}
          onMobileClose={() => setDrawerOpen(false)}
          ariaLabel="Portal navigation"
        />
      </div>

      <div className={styles.main}>
        <TopBar
          onMenuClick={isMobile ? () => setDrawerOpen(true) : undefined}
          leading={
            <>
              <ClientSelector />
              <CampaignSelector />
            </>
          }
          trailing={
            <>
              <ThemeToggle scheme={scheme} onToggle={toggle} />
              <UserMenu />
            </>
          }
        />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
