import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { ColorScheme } from '@steschoch/digital-pampas-ds'
import { THEME_STORAGE_KEY, ThemeContext, type ThemeContextValue } from './ThemeContext'

/** Dark is the brand default (terminal / live-dashboard identity). */
const DEFAULT_SCHEME: ColorScheme = 'dark'

function readInitialScheme(): ColorScheme {
  // The inline script in index.html already set the attribute pre-paint.
  const attr = document.documentElement.getAttribute('data-color-scheme')
  if (attr === 'light' || attr === 'dark') return attr
  return DEFAULT_SCHEME
}

/**
 * ThemeProvider — owns the dark/light scheme. Applies `data-color-scheme` on
 * <html> and persists to localStorage (`dp-theme`) — the same mechanism the DS
 * expects (it exports no ThemeProvider; the app drives the attribute).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [scheme, setScheme] = useState<ColorScheme>(readInitialScheme)

  const toggle = useCallback(() => {
    setScheme((prev) => {
      const next: ColorScheme = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-color-scheme', next)
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const value = useMemo<ThemeContextValue>(() => ({ scheme, toggle }), [scheme, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
