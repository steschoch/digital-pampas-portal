import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Badge, Icon } from '@steschoch/digital-pampas-ds'
import { useAuth } from '../../lib/auth/AuthContext'
import styles from './UserMenu.module.css'

/**
 * UserMenu — DS `Avatar` + a small dropdown (name, email, role, Log out).
 * Composition only (architecture §12). Closes on outside click and Esc.
 */
export function UserMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!user) return null

  const handleSignOut = () => {
    setOpen(false)
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user.displayName}`}
      >
        <Avatar name={user.displayName} size={32} />
        <Icon
          name="ChevronDown"
          size="sm"
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
        />
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <div className={styles.identity}>
            <div className={styles.name}>{user.displayName}</div>
            <div className={styles.email}>{user.email}</div>
            <div className={styles.role}>
              <Badge variant={user.role === 'agency' ? 'primary' : 'neutral'}>
                {user.role === 'agency' ? 'Agency' : 'Client'}
              </Badge>
            </div>
          </div>
          <div className={styles.divider} />
          <button type="button" className={styles.item} role="menuitem" onClick={handleSignOut}>
            <Icon name="LogOut" size="sm" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
