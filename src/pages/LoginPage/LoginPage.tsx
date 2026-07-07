import { useState, type FormEvent } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { Button, Card, Icon, TextField, Logo } from '@steschoch/digital-pampas-ds'
import { useAuth } from '../../lib/auth/AuthContext'
import { DEMO_CREDENTIALS } from '../../lib/auth/mockAuth'
import styles from './LoginPage.module.css'

/**
 * LoginPage (architecture §5.2) — the platform's first impression. Terminal
 * aesthetic. Generic error on bad credentials; redirects back to `?from` after
 * login; already-authenticated visitors are bounced to the dashboard.
 */
export function LoginPage() {
  const { user, initializing, signIn } = useAuth()
  const [params] = useSearchParams()
  const from = params.get('from')
  const destination = from ? decodeURIComponent(from) : '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Already signed in? Skip the login screen.
  if (!initializing && user) {
    return <Navigate to={destination} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)
    try {
      await signIn(email, password)
      // On success the guard above re-renders and redirects to `destination`.
    } catch {
      setError('Invalid email or password')
      setSubmitting(false)
    }
  }

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.brand}>
          <Logo variant="wordmark" height={30} />
        </div>

        <Card variant="elevated" className={styles.card}>
          <div className={styles.heading}>
            <h1 className={styles.title}>Client Portal</h1>
            <div className={styles.tagline}>&gt; Your pipeline. Live.</div>
          </div>

          {error && (
            <div className={styles.error} role="alert">
              <Icon name="TriangleAlert" size="sm" />
              {error}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              variant="terminal"
              placeholder="you@company.com"
              autoComplete="username"
              required
              error={error ? ' ' : undefined}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              variant="terminal"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              error={error ? ' ' : undefined}
              trailing={
                <button
                  type="button"
                  className={styles.reveal}
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size="sm" />
                </button>
              }
            />

            <Button type="submit" variant="primary" size="lg" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className={styles.help}>
            Trouble signing in? <a href="mailto:hello@digitalpampas.com">hello@digitalpampas.com</a>
          </div>

          <div className={styles.demo}>
            <div className={styles.demoTitle}>Demo credentials</div>
            {DEMO_CREDENTIALS.map((c) => (
              <div className={styles.demoRow} key={c.email}>
                <span>
                  {c.email} · {c.password}
                </span>
                <button type="button" onClick={() => fillDemo(c.email, c.password)}>
                  use
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
