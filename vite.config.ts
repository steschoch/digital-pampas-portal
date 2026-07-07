import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//
// Client Portal app. Dev on port 5174 so it runs alongside the marketing site.
// Consumes @digital-pampas/ds via `file:../ds-digital-pampas` (tokens + components).
export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
  preview: { port: 5174 },
})
