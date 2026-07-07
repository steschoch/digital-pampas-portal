/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Digital Pampas · Client Portal — DEMO DATASET (the "test kitchen")
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Realistic demonstration data that follows the ingestion contract (`types.ts`)
 * exactly. When Supabase arrives we swap only the kitchen (MockDataSource →
 * SupabaseDataSource); the screens keep asking the waiter the same questions.
 *
 * Coverage (per architecture §9):
 *   • 2 clients, 3 campaigns — one email-only, one linkedin-only, one both —
 *     to exercise the conditional channel display;
 *   • configurable per-campaign timelines of different lengths;
 *   • ~90 days of daily series; ~25 replies.
 *
 * The dataset is DETERMINISTIC (seeded pseudo-random) so the demo looks the same
 * on every load.
 */

import type {
  Campaign,
  ClientAccount,
  LeadReply,
  MetricSeries,
  MetricsSnapshot,
  OutcomeMetrics,
  QualificationMetrics,
  ReplyBreakdown,
  ReportSummary,
  SeriesMetric,
  SeriesPoint,
  UserAccount,
} from './types'

/* ── Deterministic helpers ─────────────────────────────────────────────────── */

/** Seeded PRNG (mulberry32) — stable, no Math.random, reproducible demo data. */
function mulberry32(seed: number): () => number {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SERIES_END = '2026-07-01'
const SERIES_DAYS = 90

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** Build a `days`-long daily series ending at SERIES_END, ramping from base→peak with noise. */
function buildSeries(
  seed: number,
  base: number,
  peak: number,
  days = SERIES_DAYS,
  { warmupDays = 0 }: { warmupDays?: number } = {},
): SeriesPoint[] {
  const rnd = mulberry32(seed)
  const end = new Date(SERIES_END + 'T00:00:00Z')
  const points: SeriesPoint[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(end)
    d.setUTCDate(end.getUTCDate() - (days - 1 - i))
    const progress = i / (days - 1)
    // Weekends send less.
    const weekday = d.getUTCDay()
    const weekendFactor = weekday === 0 || weekday === 6 ? 0.15 : 1
    // Warm-up: near-zero output for the first `warmupDays`.
    const warmFactor = i < warmupDays ? (i / Math.max(warmupDays, 1)) * 0.3 : 1
    const trend = base + (peak - base) * progress
    const noise = 0.8 + rnd() * 0.4
    const value = Math.max(0, Math.round(trend * noise * weekendFactor * warmFactor))
    points.push({ date: isoDate(d), value })
  }
  return points
}

/* ── Users (the "paper guest list" — see mockAuth for credentials) ─────────── */

export const users: UserAccount[] = [
  {
    id: 'user-agency',
    email: 'demo@digitalpampas.com',
    displayName: 'Sofia Mendes',
    clientIds: ['client-acme', 'client-northwind'],
    role: 'agency',
  },
  {
    id: 'user-acme',
    email: 'client@acme.com',
    displayName: 'Daniel Reyes',
    clientIds: ['client-acme'],
    role: 'client',
  },
]

/* ── Clients ───────────────────────────────────────────────────────────────── */

export const clients: ClientAccount[] = [
  {
    id: 'client-acme',
    name: 'Acme Co.',
    industry: 'B2B SaaS · DevTools',
    campaignIds: ['cmp-q3-us', 'cmp-emea'],
  },
  {
    id: 'client-northwind',
    name: 'Northwind Labs',
    industry: 'Cybersecurity',
    campaignIds: ['cmp-abm'],
  },
]

/* ── Campaigns (each with its own configurable timeline) ───────────────────── */

export const campaigns: Campaign[] = [
  // 1) BOTH channels — the flagship, live. 8 phases.
  {
    id: 'cmp-q3-us',
    clientId: 'client-acme',
    name: 'Q3 Outbound — US Market',
    state: 'live',
    channels: ['email', 'linkedin'],
    startedAt: '2026-05-12',
    phases: [
      {
        id: 'p1',
        label: 'Technical Audit',
        description: 'Deliverability & domain diagnostic before any sending.',
        status: 'done',
        plannedStart: '2026-05-12',
        plannedEnd: '2026-05-19',
        startedAt: '2026-05-12',
        completedAt: '2026-05-18',
        deliverables: ['Diagnostic report delivered', 'DNS/SPF/DKIM/DMARC baseline'],
      },
      {
        id: 'p2',
        label: 'Sending Infrastructure',
        description: 'Domains, inboxes and warm-up.',
        status: 'done',
        plannedStart: '2026-05-19',
        plannedEnd: '2026-06-02',
        startedAt: '2026-05-19',
        completedAt: '2026-06-02',
        deliverables: ['3 domains', '12 inboxes provisioned', 'Warm-up complete'],
      },
      {
        id: 'p3',
        label: 'ICP & Data',
        description: 'Ideal customer profile, sourcing and verification (Clay).',
        status: 'done',
        plannedStart: '2026-06-02',
        plannedEnd: '2026-06-12',
        startedAt: '2026-06-02',
        completedAt: '2026-06-13',
        deliverables: ['4,200 contacts sourced', 'Waterfall enrichment', 'ICP scoring model'],
      },
      {
        id: 'p4',
        label: 'Copy & Sequences',
        description: 'Messaging, sequences and A/B variants.',
        status: 'done',
        plannedStart: '2026-06-12',
        plannedEnd: '2026-06-22',
        startedAt: '2026-06-13',
        completedAt: '2026-06-23',
        deliverables: ['3 sequence variants', 'LinkedIn message scripts'],
      },
      {
        id: 'p5',
        label: 'Campaign Launch',
        description: 'Live sending, monitored daily.',
        status: 'active',
        plannedStart: '2026-06-24',
        startedAt: '2026-06-24',
        deliverables: ['Sending 400–600/day', 'Daily deliverability monitoring'],
      },
      {
        id: 'p6',
        label: 'LinkedIn Integration',
        description: 'Multichannel layer via Aimfox.',
        status: 'active',
        plannedStart: '2026-06-28',
        startedAt: '2026-06-30',
        deliverables: ['Connection campaign live', 'Message follow-ups'],
      },
      {
        id: 'p7',
        label: 'Optimization',
        description: 'Iterate on the winning variants.',
        status: 'upcoming',
        plannedStart: '2026-07-14',
        deliverables: ['Variant pruning', 'Segment expansion'],
      },
      {
        id: 'p8',
        label: 'Ongoing Management',
        description: 'Reporting cadence and handoff.',
        status: 'upcoming',
        plannedStart: '2026-08-01',
        deliverables: ['Weekly reports', 'Monthly review'],
      },
    ],
  },
  // 2) EMAIL only — warming (recently launched infra). 6 phases.
  {
    id: 'cmp-emea',
    clientId: 'client-acme',
    name: 'EMEA Expansion — Email',
    state: 'warming',
    channels: ['email'],
    startedAt: '2026-06-09',
    phases: [
      {
        id: 'p1',
        label: 'Technical Audit',
        status: 'done',
        plannedStart: '2026-06-09',
        plannedEnd: '2026-06-14',
        startedAt: '2026-06-09',
        completedAt: '2026-06-14',
        deliverables: ['EU deliverability baseline'],
      },
      {
        id: 'p2',
        label: 'Sending Infrastructure',
        status: 'active',
        description: 'Domains warming — not at full volume yet.',
        plannedStart: '2026-06-14',
        plannedEnd: '2026-06-30',
        startedAt: '2026-06-14',
        deliverables: ['2 EU domains', '8 inboxes', 'Warm-up in progress'],
      },
      {
        id: 'p3',
        label: 'ICP & Data',
        status: 'upcoming',
        plannedStart: '2026-06-30',
        plannedEnd: '2026-07-10',
        deliverables: ['GDPR-compliant sourcing'],
      },
      {
        id: 'p4',
        label: 'Copy & Sequences',
        status: 'upcoming',
        plannedStart: '2026-07-10',
        plannedEnd: '2026-07-18',
      },
      {
        id: 'p5',
        label: 'Campaign Launch',
        status: 'upcoming',
        plannedStart: '2026-07-20',
      },
      {
        id: 'p6',
        label: 'Ongoing Management',
        status: 'upcoming',
        plannedStart: '2026-08-05',
      },
    ],
  },
  // 3) LINKEDIN only — live ABM. 6 phases.
  {
    id: 'cmp-abm',
    clientId: 'client-northwind',
    name: 'Enterprise ABM — LinkedIn',
    state: 'live',
    channels: ['linkedin'],
    startedAt: '2026-05-20',
    phases: [
      {
        id: 'p1',
        label: 'Account Selection',
        description: 'Target account list and buying committee mapping.',
        status: 'done',
        plannedStart: '2026-05-20',
        plannedEnd: '2026-05-28',
        startedAt: '2026-05-20',
        completedAt: '2026-05-27',
        deliverables: ['120 target accounts', 'Committee mapping'],
      },
      {
        id: 'p2',
        label: 'Profile Warm-up',
        description: 'Sender profiles prepared and warmed.',
        status: 'done',
        plannedStart: '2026-05-28',
        plannedEnd: '2026-06-08',
        startedAt: '2026-05-28',
        completedAt: '2026-06-09',
        deliverables: ['4 sender profiles', 'Aimfox connected'],
      },
      {
        id: 'p3',
        label: 'Connection Campaign',
        description: 'Personalized connection requests.',
        status: 'done',
        plannedStart: '2026-06-08',
        plannedEnd: '2026-06-20',
        startedAt: '2026-06-09',
        completedAt: '2026-06-22',
        deliverables: ['Connection sequences live'],
      },
      {
        id: 'p4',
        label: 'Messaging & Nurture',
        description: 'Multi-touch messaging to accepted connections.',
        status: 'active',
        plannedStart: '2026-06-20',
        startedAt: '2026-06-22',
        deliverables: ['3-touch message flow', 'Meeting booking links'],
      },
      {
        id: 'p5',
        label: 'Optimization',
        status: 'upcoming',
        plannedStart: '2026-07-15',
      },
      {
        id: 'p6',
        label: 'Ongoing Management',
        status: 'upcoming',
        plannedStart: '2026-08-01',
      },
    ],
  },
]

/* ── Latest metric snapshots (one per campaign) ────────────────────────────── */

export const snapshots: MetricsSnapshot[] = [
  {
    campaignId: 'cmp-q3-us',
    capturedAt: '2026-07-01T22:00:00Z',
    email: {
      emailsSent: 12430,
      replyRatePct: 4.2,
      openRatePct: 58,
      totalReplies: 522,
      bounceRatePct: 1.1,
      deliverabilityPct: 98,
      domainReputation: 94,
      warmupStatus: 'ready',
      activeInboxes: 12,
      activeDomains: 3,
    },
    linkedin: {
      connectionsSent: 800,
      acceptanceRatePct: 41,
      messagesSent: 620,
      replyRatePct: 9.8,
      totalReplies: 61,
    },
    replies: { interested: 34, notNow: 21, notInterested: 68 },
    qualification: {
      leadsSourced: 4200,
      verifiedContacts: 3560,
      qualifiedLeads: 1180,
      icpScoreDistribution: [
        { bucket: '60-70', count: 210 },
        { bucket: '70-80', count: 468 },
        { bucket: '80-90', count: 372 },
        { bucket: '90-100', count: 130 },
      ],
    },
    outcomes: { meetingsBooked: 12, opportunities: 8, pipelineValueUsd: 86000 },
  },
  {
    campaignId: 'cmp-emea',
    capturedAt: '2026-07-01T22:00:00Z',
    email: {
      emailsSent: 640,
      replyRatePct: 3.1,
      openRatePct: 52,
      totalReplies: 20,
      bounceRatePct: 1.6,
      deliverabilityPct: 96,
      domainReputation: 88,
      warmupStatus: 'warming',
      activeInboxes: 8,
      activeDomains: 2,
    },
    replies: { interested: 3, notNow: 4, notInterested: 9 },
    qualification: {
      leadsSourced: 900,
      verifiedContacts: 610,
      qualifiedLeads: 180,
      icpScoreDistribution: [
        { bucket: '60-70', count: 54 },
        { bucket: '70-80', count: 78 },
        { bucket: '80-90', count: 36 },
        { bucket: '90-100', count: 12 },
      ],
    },
    outcomes: { meetingsBooked: 2, opportunities: 1, pipelineValueUsd: 9000 },
  },
  {
    campaignId: 'cmp-abm',
    capturedAt: '2026-07-01T22:00:00Z',
    linkedin: {
      connectionsSent: 1180,
      acceptanceRatePct: 47,
      messagesSent: 540,
      replyRatePct: 12.6,
      totalReplies: 68,
    },
    replies: { interested: 22, notNow: 15, notInterested: 31 },
    qualification: {
      leadsSourced: 120,
      verifiedContacts: 118,
      qualifiedLeads: 74,
      icpScoreDistribution: [
        { bucket: '60-70', count: 8 },
        { bucket: '70-80', count: 22 },
        { bucket: '80-90', count: 30 },
        { bucket: '90-100', count: 14 },
      ],
    },
    outcomes: { meetingsBooked: 9, opportunities: 6, pipelineValueUsd: 142000 },
  },
]

/* ── Time series (~90 days) ────────────────────────────────────────────────── */

export const series: MetricSeries[] = [
  // Q3 US — email + linkedin
  { metric: 'emailsSent', campaignId: 'cmp-q3-us', points: buildSeries(101, 60, 520) },
  { metric: 'replies', campaignId: 'cmp-q3-us', points: buildSeries(102, 2, 24) },
  { metric: 'openRate', campaignId: 'cmp-q3-us', points: buildSeries(103, 44, 60) },
  { metric: 'connectionsSent', campaignId: 'cmp-q3-us', points: buildSeries(104, 10, 60, 90, { warmupDays: 60 }) },
  { metric: 'linkedinReplies', campaignId: 'cmp-q3-us', points: buildSeries(105, 0, 6, 90, { warmupDays: 60 }) },
  // EMEA — email only (warming ⇒ low volume, big warm-up)
  { metric: 'emailsSent', campaignId: 'cmp-emea', points: buildSeries(201, 4, 60, 90, { warmupDays: 70 }) },
  { metric: 'replies', campaignId: 'cmp-emea', points: buildSeries(202, 0, 3, 90, { warmupDays: 70 }) },
  { metric: 'openRate', campaignId: 'cmp-emea', points: buildSeries(203, 40, 54, 90, { warmupDays: 70 }) },
  // ABM — linkedin only
  { metric: 'connectionsSent', campaignId: 'cmp-abm', points: buildSeries(301, 8, 40) },
  { metric: 'linkedinReplies', campaignId: 'cmp-abm', points: buildSeries(302, 0, 7) },
]

/* ── Replies inbox (~25) ───────────────────────────────────────────────────── */

export const replies: LeadReply[] = [
  { id: 'r01', campaignId: 'cmp-q3-us', contactName: 'João Martins', contactTitle: 'CTO', company: 'TechCorp', channel: 'email', category: 'interested', snippet: 'Sounds interesting, can we set up a call next week?', receivedAt: '2026-07-01T14:12:00Z', icpScore: 92 },
  { id: 'r02', campaignId: 'cmp-q3-us', contactName: 'Emily Carter', contactTitle: 'VP Engineering', company: 'Datalytics', channel: 'linkedin', category: 'interested', snippet: 'We are actually evaluating this exact problem right now.', receivedAt: '2026-07-01T10:03:00Z', icpScore: 88 },
  { id: 'r03', campaignId: 'cmp-q3-us', contactName: 'Marcus Webb', contactTitle: 'Head of Ops', company: 'Northgate', channel: 'email', category: 'not_now', snippet: 'Not the right time — circle back in Q4?', receivedAt: '2026-06-30T16:40:00Z', icpScore: 74 },
  { id: 'r04', campaignId: 'cmp-q3-us', contactName: 'Priya Nair', contactTitle: 'Director of Growth', company: 'Loopwork', channel: 'email', category: 'interested', snippet: 'Yes — send me a slot, mornings EST work best.', receivedAt: '2026-06-30T12:22:00Z', icpScore: 90 },
  { id: 'r05', campaignId: 'cmp-q3-us', contactName: 'Tom Fletcher', contactTitle: 'CEO', company: 'Bytewise', channel: 'email', category: 'not_interested', snippet: 'Please remove me from this list.', receivedAt: '2026-06-29T09:15:00Z', icpScore: 61 },
  { id: 'r06', campaignId: 'cmp-q3-us', contactName: 'Sara Lindgren', contactTitle: 'CMO', company: 'Helio', channel: 'linkedin', category: 'interested', snippet: 'Interesting approach — what does onboarding look like?', receivedAt: '2026-06-29T08:50:00Z', icpScore: 85 },
  { id: 'r07', campaignId: 'cmp-q3-us', contactName: 'David Kim', contactTitle: 'VP Sales', company: 'Quantech', channel: 'email', category: 'not_now', snippet: 'Interesting but budget is locked until next fiscal year.', receivedAt: '2026-06-28T18:31:00Z', icpScore: 71 },
  { id: 'r08', campaignId: 'cmp-q3-us', contactName: 'Ana Ribeiro', contactTitle: 'Head of RevOps', company: 'Fluxo', channel: 'email', category: 'interested', snippet: 'Love the specificity. Can you share a case study?', receivedAt: '2026-06-27T13:05:00Z', icpScore: 94 },
  { id: 'r09', campaignId: 'cmp-q3-us', contactName: 'Greg Palmer', contactTitle: 'Founder', company: 'Stackline', channel: 'email', category: 'not_interested', snippet: 'We build this in-house, thanks.', receivedAt: '2026-06-27T11:44:00Z', icpScore: 66 },
  { id: 'r10', campaignId: 'cmp-q3-us', contactName: 'Lucia Ferrari', contactTitle: 'COO', company: 'Marena', channel: 'linkedin', category: 'not_now', snippet: 'Reach out again after our reorg settles.', receivedAt: '2026-06-26T15:20:00Z', icpScore: 79 },

  { id: 'r11', campaignId: 'cmp-abm', contactName: 'Robert Hayes', contactTitle: 'CISO', company: 'Vaultline', channel: 'linkedin', category: 'interested', snippet: 'This is timely — we had an incident last month. Let\'s talk.', receivedAt: '2026-07-01T09:10:00Z', icpScore: 96 },
  { id: 'r12', campaignId: 'cmp-abm', contactName: 'Nadia Osei', contactTitle: 'VP Security', company: 'Ironclad', channel: 'linkedin', category: 'interested', snippet: 'Happy to connect the team. What is your availability?', receivedAt: '2026-06-30T14:00:00Z', icpScore: 91 },
  { id: 'r13', campaignId: 'cmp-abm', contactName: 'Chris Donovan', contactTitle: 'Head of SecOps', company: 'Perimeter', channel: 'linkedin', category: 'not_now', snippet: 'Mid-audit right now — ping me in August.', receivedAt: '2026-06-29T17:25:00Z', icpScore: 82 },
  { id: 'r14', campaignId: 'cmp-abm', contactName: 'Yuki Tanaka', contactTitle: 'Security Architect', company: 'Sentinel', channel: 'linkedin', category: 'interested', snippet: 'Send over a technical overview and I\'ll route it internally.', receivedAt: '2026-06-28T11:12:00Z', icpScore: 89 },
  { id: 'r15', campaignId: 'cmp-abm', contactName: 'Olivia Brooks', contactTitle: 'CTO', company: 'Redshift', channel: 'linkedin', category: 'not_interested', snippet: 'Not a fit for us at the moment.', receivedAt: '2026-06-27T10:40:00Z', icpScore: 68 },
  { id: 'r16', campaignId: 'cmp-abm', contactName: 'Felipe Souza', contactTitle: 'VP Infrastructure', company: 'Cloudspan', channel: 'linkedin', category: 'interested', snippet: 'Yes, interested. Do you support on-prem?', receivedAt: '2026-06-26T09:33:00Z', icpScore: 93 },
  { id: 'r17', campaignId: 'cmp-abm', contactName: 'Hannah Wright', contactTitle: 'Director IT', company: 'Blackwood', channel: 'linkedin', category: 'not_now', snippet: 'Good timing next quarter, not now.', receivedAt: '2026-06-25T16:05:00Z', icpScore: 76 },
  { id: 'r18', campaignId: 'cmp-abm', contactName: 'Ivan Petrov', contactTitle: 'Head of Platform', company: 'Nimbus', channel: 'linkedin', category: 'interested', snippet: 'Let\'s get 30 minutes on the calendar.', receivedAt: '2026-06-24T13:48:00Z', icpScore: 87 },

  { id: 'r19', campaignId: 'cmp-emea', contactName: 'Sophie Dubois', contactTitle: 'Head of Growth', company: 'Parisel', channel: 'email', category: 'interested', snippet: 'Intéressant — pouvez-vous m\'envoyer plus de détails?', receivedAt: '2026-06-30T10:15:00Z', icpScore: 84 },
  { id: 'r20', campaignId: 'cmp-emea', contactName: 'Lars Nilsson', contactTitle: 'CEO', company: 'Fjordtech', channel: 'email', category: 'not_now', snippet: 'Interested but let\'s revisit after summer.', receivedAt: '2026-06-29T12:30:00Z', icpScore: 77 },
  { id: 'r21', campaignId: 'cmp-emea', contactName: 'Marta Kowalski', contactTitle: 'VP Marketing', company: 'Bialystok', channel: 'email', category: 'not_interested', snippet: 'Please unsubscribe me.', receivedAt: '2026-06-28T08:20:00Z', icpScore: 63 },
  { id: 'r22', campaignId: 'cmp-emea', contactName: 'Giulia Romano', contactTitle: 'COO', company: 'Milano SRL', channel: 'email', category: 'interested', snippet: 'This could help our outbound. Can we schedule a demo?', receivedAt: '2026-06-27T15:55:00Z', icpScore: 88 },
  { id: 'r23', campaignId: 'cmp-emea', contactName: 'Henrik Bauer', contactTitle: 'Head of Sales', company: 'Rheinwerk', channel: 'email', category: 'not_now', snippet: 'Not right now, thanks for reaching out.', receivedAt: '2026-06-26T11:10:00Z', icpScore: 72 },
  { id: 'r24', campaignId: 'cmp-emea', contactName: 'Elena Popa', contactTitle: 'Founder', company: 'Carpathia', channel: 'email', category: 'not_interested', snippet: 'We already have a provider.', receivedAt: '2026-06-25T09:00:00Z', icpScore: 65 },
  { id: 'r25', campaignId: 'cmp-emea', contactName: 'Pieter de Vries', contactTitle: 'CTO', company: 'Amstel', channel: 'email', category: 'not_now', snippet: 'Circle back in September please.', receivedAt: '2026-06-24T14:44:00Z', icpScore: 75 },
]

/* ── Report snapshots ──────────────────────────────────────────────────────── */

export const reports: ReportSummary[] = [
  { id: 'rep-q3-jun', campaignId: 'cmp-q3-us', period: 'June 2026', periodStart: '2026-06-01', periodEnd: '2026-06-30', meetingsBooked: 9, totalReplies: 402, pipelineValueUsd: 64000, format: 'pdf' },
  { id: 'rep-q3-may', campaignId: 'cmp-q3-us', period: 'May 2026', periodStart: '2026-05-01', periodEnd: '2026-05-31', meetingsBooked: 3, totalReplies: 118, pipelineValueUsd: 22000, format: 'pdf' },
  { id: 'rep-abm-jun', campaignId: 'cmp-abm', period: 'June 2026', periodStart: '2026-06-01', periodEnd: '2026-06-30', meetingsBooked: 7, totalReplies: 61, pipelineValueUsd: 112000, format: 'pdf' },
  { id: 'rep-abm-w26', campaignId: 'cmp-abm', period: 'Week of Jun 23', periodStart: '2026-06-23', periodEnd: '2026-06-29', meetingsBooked: 2, totalReplies: 18, pipelineValueUsd: 40000, format: 'csv' },
  { id: 'rep-emea-jun', campaignId: 'cmp-emea', period: 'June 2026', periodStart: '2026-06-01', periodEnd: '2026-06-30', meetingsBooked: 2, totalReplies: 20, pipelineValueUsd: 9000, format: 'pdf' },
]

/* ── Helpers ───────────────────────────────────────────────────────────────── */

export function getClientById(id: string): ClientAccount | undefined {
  return clients.find((c) => c.id === id)
}

export function getCampaignsForClient(clientId: string): Campaign[] {
  return campaigns.filter((c) => c.clientId === clientId)
}

export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id)
}

export function getLatestSnapshot(campaignId: string): MetricsSnapshot | undefined {
  return snapshots.find((s) => s.campaignId === campaignId)
}

export function getRepliesForCampaign(campaignId: string): LeadReply[] {
  return replies.filter((r) => r.campaignId === campaignId)
}

export function getSeries(campaignId: string, metric: SeriesMetric): MetricSeries | undefined {
  return series.find((s) => s.campaignId === campaignId && s.metric === metric)
}

export function getReportsForCampaigns(campaignIds: string[]): ReportSummary[] {
  return reports.filter((r) => campaignIds.includes(r.campaignId))
}

/** Weighted-average helper: Σ(value·weight) / Σweight (0 if no weight). */
function weightedAvg(pairs: Array<[value: number, weight: number]>): number {
  const totalW = pairs.reduce((a, [, w]) => a + w, 0)
  if (totalW === 0) return 0
  const sum = pairs.reduce((a, [v, w]) => a + v * w, 0)
  return sum / totalW
}

/**
 * Aggregate several campaigns' latest snapshots into one — the "All campaigns"
 * view. Counts sum; rates are weighted by volume; channel blocks appear only if
 * at least one campaign runs that channel.
 */
export function aggregateSnapshots(campaignIds: string[]): MetricsSnapshot | undefined {
  const snaps = campaignIds
    .map((id) => getLatestSnapshot(id))
    .filter((s): s is MetricsSnapshot => Boolean(s))
  if (snaps.length === 0) return undefined
  if (snaps.length === 1) return snaps[0]

  const replies: ReplyBreakdown = {
    interested: snaps.reduce((a, s) => a + s.replies.interested, 0),
    notNow: snaps.reduce((a, s) => a + s.replies.notNow, 0),
    notInterested: snaps.reduce((a, s) => a + s.replies.notInterested, 0),
  }

  const outcomes: OutcomeMetrics = {
    meetingsBooked: snaps.reduce((a, s) => a + s.outcomes.meetingsBooked, 0),
    opportunities: snaps.reduce((a, s) => a + s.outcomes.opportunities, 0),
    pipelineValueUsd: snaps.reduce((a, s) => a + s.outcomes.pipelineValueUsd, 0),
  }

  // Merge ICP buckets by label.
  const bucketMap = new Map<string, number>()
  for (const s of snaps) {
    for (const b of s.qualification.icpScoreDistribution) {
      bucketMap.set(b.bucket, (bucketMap.get(b.bucket) ?? 0) + b.count)
    }
  }
  const qualification: QualificationMetrics = {
    leadsSourced: snaps.reduce((a, s) => a + s.qualification.leadsSourced, 0),
    verifiedContacts: snaps.reduce((a, s) => a + s.qualification.verifiedContacts, 0),
    qualifiedLeads: snaps.reduce((a, s) => a + s.qualification.qualifiedLeads, 0),
    icpScoreDistribution: [...bucketMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([bucket, count]) => ({ bucket, count })),
  }

  const emailSnaps = snaps.filter((s) => s.email).map((s) => s.email!)
  const email = emailSnaps.length
    ? {
        emailsSent: emailSnaps.reduce((a, e) => a + e.emailsSent, 0),
        totalReplies: emailSnaps.reduce((a, e) => a + e.totalReplies, 0),
        activeInboxes: emailSnaps.reduce((a, e) => a + e.activeInboxes, 0),
        activeDomains: emailSnaps.reduce((a, e) => a + e.activeDomains, 0),
        replyRatePct: round1(weightedAvg(emailSnaps.map((e) => [e.replyRatePct, e.emailsSent]))),
        openRatePct: round1(weightedAvg(emailSnaps.map((e) => [e.openRatePct, e.emailsSent]))),
        bounceRatePct: round1(weightedAvg(emailSnaps.map((e) => [e.bounceRatePct, e.emailsSent]))),
        deliverabilityPct: round1(weightedAvg(emailSnaps.map((e) => [e.deliverabilityPct, e.emailsSent]))),
        domainReputation: Math.round(weightedAvg(emailSnaps.map((e) => [e.domainReputation, e.activeDomains]))),
        warmupStatus: emailSnaps.every((e) => e.warmupStatus === 'ready')
          ? ('ready' as const)
          : ('warming' as const),
      }
    : undefined

  const liSnaps = snaps.filter((s) => s.linkedin).map((s) => s.linkedin!)
  const linkedin = liSnaps.length
    ? {
        connectionsSent: liSnaps.reduce((a, l) => a + l.connectionsSent, 0),
        messagesSent: liSnaps.reduce((a, l) => a + l.messagesSent, 0),
        totalReplies: liSnaps.reduce((a, l) => a + l.totalReplies, 0),
        acceptanceRatePct: round1(weightedAvg(liSnaps.map((l) => [l.acceptanceRatePct, l.connectionsSent]))),
        replyRatePct: round1(weightedAvg(liSnaps.map((l) => [l.replyRatePct, l.messagesSent]))),
      }
    : undefined

  return {
    campaignId: '__aggregate__',
    capturedAt: snaps[0].capturedAt,
    email,
    linkedin,
    replies,
    qualification,
    outcomes,
  }
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}
