import { useEffect, useState } from 'react'

export interface AsyncState<T> {
  data: T | undefined
  loading: boolean
  error: Error | undefined
  /** Bump to re-run the loader. */
  reload: () => void
}

/**
 * useAsync — run an async loader and expose { data, loading, error, reload }.
 * The loader is re-run whenever `deps` change. Guards against setting state after
 * unmount or after a superseded run (stale response).
 */
export function useAsync<T>(loader: () => Promise<T>, deps: React.DependencyList): AsyncState<T> {
  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(undefined)
    loader()
      .then((result) => {
        if (alive) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (alive) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setLoading(false)
        }
      })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce])

  return { data, loading, error, reload: () => setNonce((n) => n + 1) }
}
