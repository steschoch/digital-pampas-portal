# Data contract & ingestion guide

This folder is the **single language** every part of the portal speaks. It is the
contract between four parties:

| Party | Reads / writes |
|---|---|
| The **screens** (pages) | read data through the "waiter" (`lib/data/PortalDataSource`) |
| The **mock** (`portalMock.ts`) | the demo dataset — follows the contract exactly |
| The **Digital Pampas agents/skills** | will POST JSON in this exact shape |
| **Supabase** (later) | stores rows in this exact shape |

> Define once, use everywhere. No screen is ever rewritten when the backend arrives —
> only `MockDataSource` is swapped for `SupabaseDataSource` (one line in `lib/data/PortalDataProvider`).

---

## The contract (`types.ts`)

The authoritative types live in [`types.ts`](./types.ts). Summary:

- **`UserAccount`** — a login. `clientIds.length > 1` ⇒ the client selector appears (agency login).
- **`ClientAccount`** — a client the agency serves; owns `campaignIds`.
- **`Campaign`** — has a `state`, a `channels` array (`email` / `linkedin` — controls the
  conditional display), and its own **`phases`** timeline (see below).
- **`MetricsSnapshot`** — **the unit of ingestion.** An immutable point-in-time photo of one
  campaign's metrics. Channel blocks (`email`, `linkedin`) are present only for active channels.
- **`MetricSeries`** — the daily history that powers the line charts.
- **`LeadReply`** — one row in the replies inbox.
- **`ReportSummary`** — one entry on the Reports page.

### Configurable timeline

Each campaign carries its **own** `phases[]` — the timeline promised to *that* client. The
`Timeline` component just renders whatever list it receives; nothing about phases is hard-coded.

```ts
CampaignPhase {
  id, label, description?,
  status: 'done' | 'active' | 'upcoming' | 'delayed',
  plannedStart?, plannedEnd?,   // the promise
  startedAt?, completedAt?,     // reality
  deliverables?: string[],      // what was / will be delivered
}
```

---

## How agents ingest (future)

Metrics arrive as **snapshots** — append-only, never edited:

1. On each capture, an agent builds one `MetricsSnapshot` per campaign.
2. It includes `email` **only** if the campaign runs email; `linkedin` **only** if it runs LinkedIn.
3. It POSTs the JSON. The backend appends it. The history of snapshots **is** the time series.

Example payload (email + LinkedIn campaign):

```json
{
  "campaignId": "cmp-q3-us",
  "capturedAt": "2026-07-01T22:00:00Z",
  "email": {
    "emailsSent": 12430, "replyRatePct": 4.2, "openRatePct": 58, "totalReplies": 522,
    "bounceRatePct": 1.1, "deliverabilityPct": 98, "domainReputation": 94,
    "warmupStatus": "ready", "activeInboxes": 12, "activeDomains": 3
  },
  "linkedin": {
    "connectionsSent": 800, "acceptanceRatePct": 41, "messagesSent": 620,
    "replyRatePct": 9.8, "totalReplies": 61
  },
  "replies": { "interested": 34, "notNow": 21, "notInterested": 68 },
  "qualification": {
    "leadsSourced": 4200, "verifiedContacts": 3560, "qualifiedLeads": 1180,
    "icpScoreDistribution": [{ "bucket": "80-90", "count": 372 }]
  },
  "outcomes": { "meetingsBooked": 12, "opportunities": 8, "pipelineValueUsd": 86000 }
}
```

**Rules**

- **Append, never update.** Corrections are new snapshots, not edits.
- **Omit inactive channels.** A LinkedIn-only campaign must not send an `email` block (the portal
  never shows a zeroed block for a channel the campaign doesn't run).
- **Rates are percentages** already computed (e.g. `4.2` = 4.2 %), `0–100` scale.
- **Bounce target is `< 2`** — the portal awards a ✓ seal when met.
- All timestamps are **ISO 8601 UTC**.

---

## The demo dataset (`portalMock.ts`)

Deterministic (seeded), so the demo looks identical on every load. Covers, per architecture §9:

- **2 clients** (`Acme Co.`, `Northwind Labs`);
- **3 campaigns** — one email-only (`cmp-emea`), one LinkedIn-only (`cmp-abm`), one both
  (`cmp-q3-us`) — to exercise the conditional channel display;
- **~90 days** of daily series; **~25** replies; monthly/weekly report snapshots.

Helpers exported for the data source: `getClientById`, `getCampaignsForClient`, `getCampaignById`,
`getLatestSnapshot`, `getRepliesForCampaign`, `getSeries`, `getReportsForCampaigns`, and
`aggregateSnapshots` for the "All campaigns" view (sums counts, weights rates by volume).
