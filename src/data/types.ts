/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Digital Pampas · Client Portal — DATA CONTRACT (also the ingestion schema)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * This file is the single source of truth for the shape of every piece of data
 * the portal reads. It is defined once and used everywhere:
 *
 *   • the mock dataset (`portalMock.ts`) follows this exact shape;
 *   • the Digital Pampas agents/skills will POST JSON in this exact shape;
 *   • Supabase will store data in this exact shape.
 *
 * One language. See `README.md` in this folder for the ingestion guide.
 *
 * Metrics arrive as SNAPSHOTS — immutable point-in-time captures. An agent sends
 * one photo per campaign per capture; the history of photos becomes the time
 * series. Trivial to ingest (append-only), impossible to corrupt (never edited).
 */

/* ── Identity ──────────────────────────────────────────────────────────────── */

export type UserRole = 'client' | 'agency'

export interface UserAccount {
  id: string
  email: string
  displayName: string
  /** Clients this login may view. Length > 1 ⇒ the ClientSelector is shown. */
  clientIds: string[]
  role: UserRole
}

export interface ClientAccount {
  id: string
  name: string
  logoUrl?: string
  industry?: string
  campaignIds: string[]
}

/* ── Campaign (with a configurable, per-campaign timeline) ─────────────────── */

export type CampaignState = 'warming' | 'live' | 'paused' | 'completed'
export type Channel = 'email' | 'linkedin'

export type PhaseStatus = 'done' | 'active' | 'upcoming' | 'delayed'

export interface CampaignPhase {
  id: string
  label: string
  description?: string
  status: PhaseStatus
  /** The promise: planned dates (ISO 8601). */
  plannedStart?: string
  plannedEnd?: string
  /** Reality: actual dates (ISO 8601). */
  startedAt?: string
  completedAt?: string
  /** What was / will be delivered in this phase. */
  deliverables?: string[]
}

export interface Campaign {
  id: string
  clientId: string
  name: string
  state: CampaignState
  /** Controls the conditional channel display. */
  channels: Channel[]
  startedAt: string
  /** This campaign's own timeline. */
  phases: CampaignPhase[]
}

/* ── Metrics snapshot (the unit of ingestion) ──────────────────────────────── */

export type WarmupStatus = 'warming' | 'ready'

export interface EmailChannelMetrics {
  emailsSent: number
  replyRatePct: number
  openRatePct: number
  totalReplies: number
  /** Target < 2. Earns a ✓ seal when met. */
  bounceRatePct: number
  deliverabilityPct: number
  /** 0–100. */
  domainReputation: number
  warmupStatus: WarmupStatus
  activeInboxes: number
  activeDomains: number
}

export interface LinkedInChannelMetrics {
  connectionsSent: number
  acceptanceRatePct: number
  messagesSent: number
  replyRatePct: number
  totalReplies: number
}

export interface ReplyBreakdown {
  interested: number
  notNow: number
  notInterested: number
}

export interface IcpScoreBucket {
  /** e.g. "80-90". */
  bucket: string
  count: number
}

export interface QualificationMetrics {
  leadsSourced: number
  verifiedContacts: number
  qualifiedLeads: number
  icpScoreDistribution: IcpScoreBucket[]
}

export interface OutcomeMetrics {
  meetingsBooked: number
  opportunities: number
  pipelineValueUsd: number
}

export interface MetricsSnapshot {
  campaignId: string
  /** ISO 8601. */
  capturedAt: string
  /** Present only if the campaign runs the email channel. */
  email?: EmailChannelMetrics
  /** Present only if the campaign runs the LinkedIn channel. */
  linkedin?: LinkedInChannelMetrics
  replies: ReplyBreakdown
  qualification: QualificationMetrics
  outcomes: OutcomeMetrics
}

/* ── Time series & inbox ───────────────────────────────────────────────────── */

/** A named metric identifier tracked over time (e.g. 'emailsSent', 'replies'). */
export type SeriesMetric =
  | 'emailsSent'
  | 'replies'
  | 'openRate'
  | 'connectionsSent'
  | 'linkedinReplies'

export interface SeriesPoint {
  /** ISO date (YYYY-MM-DD). */
  date: string
  value: number
}

export interface MetricSeries {
  metric: SeriesMetric
  campaignId: string
  points: SeriesPoint[]
}

export type ReplyCategory = 'interested' | 'not_now' | 'not_interested'

export interface LeadReply {
  id: string
  campaignId: string
  contactName: string
  contactTitle?: string
  company: string
  channel: Channel
  category: ReplyCategory
  snippet: string
  /** ISO 8601. */
  receivedAt: string
  /** 0–100 ICP fit score. */
  icpScore?: number
}

/* ── Report snapshots (Reports page) ───────────────────────────────────────── */

export interface ReportSummary {
  id: string
  campaignId: string
  /** e.g. "June 2026" or "Week of Jun 23". */
  period: string
  periodStart: string
  periodEnd: string
  meetingsBooked: number
  totalReplies: number
  pipelineValueUsd: number
  /** Format hint for the export action (mock now, real PDF/CSV later). */
  format: 'pdf' | 'csv'
}
