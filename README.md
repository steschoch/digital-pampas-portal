# Client Portal — Digital Pampas

The client-facing dashboard where Digital Pampas customers log in and see their
outbound pipeline **live**: campaign phase, sending health, replies, qualification
and business outcomes. Built on the Digital Pampas Design System (`@digital-pampas/ds`)
— tokens **and** components. The portal owns only composition and data.

> Full spec: `../docs geral/client-portal-architecture.md`

## Stack

- **React 19 + Vite + TypeScript** (strict: `noUnusedLocals`/`noUnusedParameters`)
- **react-router-dom v7** — routes in `src/App.tsx`
- **`@digital-pampas/ds`** via `file:../ds-digital-pampas` (tokens + components)
- **lucide-react** — DS `Icon` peer
- Dark/light theme via `data-color-scheme` on `<html>` (persisted in `localStorage`, key `dp-theme`)

## Run

```bash
npm install          # DS is linked from ../ds-digital-pampas (must be built: npm run build there)
npm run dev          # http://localhost:5174
npm run build        # tsc -b + vite build  (strict typecheck)
npm run typecheck
```

**Demo credentials** (also shown on the login screen):

| Login | Email | Password | Sees |
|---|---|---|---|
| Agency | `demo@digitalpampas.com` | `pampas2026` | Acme + Northwind (client selector visible) |
| Client | `client@acme.com` | `acme2026` | Acme only (no client selector) |

## Architecture

- **The "waiter"** (`src/lib/data`) — screens read data through `PortalDataSource`.
  `MockDataSource` reads the demo dataset today; `SupabaseDataSource` (documented
  stub) plugs in later by changing **one line** in `PortalDataProvider`. No screen
  is rewritten.
- **The "doorman"** (`src/lib/auth`) — `AuthProvider` + `mockAuth` today; swap for
  Supabase Auth later. `RequireAuth` bounces logged-out visitors to
  `/login?from=<dest>` and returns them after login.
- **Data contract** (`src/data/types.ts`) — the single shape used by the mock, the
  future ingestion agents, and Supabase. See `src/data/README.md` for the ingestion guide.
- **Global selection** (`src/lib/selection`) — client/campaign context, persisted;
  changing it updates every page. `All campaigns` aggregates.

## Structure

```
src/
├─ App.tsx                 # router + providers
├─ pages/                  # Login, Overview, Campaigns, CampaignDetail, Replies, Reports
├─ components/             # composition only (AppShell, selectors, UserMenu, metric blocks…)
├─ lib/
│  ├─ auth/  data/  theme/  selection/   # providers + hooks
│  └─ format.ts  useScope.ts  useSeries.ts  useMediaQuery.ts
└─ data/                   # types.ts (contract) · portalMock.ts (demo) · README.md (ingestion)
```

Every visual widget (Sidebar, TopBar, StatCard, charts, Timeline, DataTable, …)
comes from `@digital-pampas/ds`. The portal never creates a generic visual component.
