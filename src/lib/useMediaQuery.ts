import { useEffect, useState } from 'react'

/** Subscribe to a media query; returns whether it currently matches. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export interface Responsive {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

/** Portal breakpoints: mobile ≤640, tablet 641–1024, desktop >1024. */
export function useResponsive(): Responsive {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet }
}
