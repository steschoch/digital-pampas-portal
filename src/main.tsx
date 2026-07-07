import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Design System styles — imported ONCE, here, at the app entry.
import '@steschoch/digital-pampas-ds/globals.css' // Layer 1 + 2: design tokens (dark/light)
import '@steschoch/digital-pampas-ds/styles.css' // Layer 3: component styles

import './styles/app.css' // portal-only layout helpers (composition, not visual components)
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
