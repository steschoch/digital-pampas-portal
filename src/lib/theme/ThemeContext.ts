import { createContext, useContext } from 'react'
import type { ColorScheme } from '@steschoch/digital-pampas-ds'

export interface ThemeContextValue {
  scheme: ColorScheme
  toggle: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within <ThemeProvider>')
  }
  return ctx
}

export const THEME_STORAGE_KEY = 'dp-theme'
