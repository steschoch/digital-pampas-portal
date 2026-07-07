/**
 * SupabaseDataSource — the "real kitchen" (documented stub).
 *
 * When the backend is ready, this class implements the SAME `PortalDataSource`
 * interface by reading from Supabase (Postgres + Auth). Because the interface is
 * identical, switching is ONE line in `PortalDataProvider`:
 *
 *   const source = new SupabaseDataSource(supabaseClient)   // instead of new MockDataSource()
 *
 * No screen changes. The methods below sketch the intended queries.
 *
 * Reference schema (mirrors `data/types.ts` — see `data/README.md`):
 *   clients(id, name, logo_url, industry)
 *   campaigns(id, client_id, name, state, channels[], started_at)
 *   campaign_phases(id, campaign_id, label, description, status, planned_start,
 *                   planned_end, started_at, completed_at, deliverables[])
 *   metrics_snapshots(campaign_id, captured_at, email jsonb, linkedin jsonb,
 *                     replies jsonb, qualification jsonb, outcomes jsonb)   -- append-only
 *   metric_series(campaign_id, metric, points jsonb)
 *   lead_replies(id, campaign_id, contact_name, contact_title, company, channel,
 *                category, snippet, received_at, icp_score)
 *   report_summaries(id, campaign_id, period, period_start, period_end, ...)
 */

import type { PortalDataSource } from './PortalDataSource'
import type {
  Campaign,
  ClientAccount,
  LeadReply,
  MetricSeries,
  MetricsSnapshot,
  ReportSummary,
  SeriesMetric,
} from '../../data/types'

const NOT_IMPLEMENTED =
  'SupabaseDataSource is a documented stub. Wire a Supabase client and implement these queries to go live.'

export class SupabaseDataSource implements PortalDataSource {
  // constructor(private readonly client: SupabaseClient) {}

  getClients(_clientIds: string[]): Promise<ClientAccount[]> {
    // return this.client.from('clients').select('*').in('id', _clientIds)
    throw new Error(NOT_IMPLEMENTED)
  }

  getCampaigns(_clientId: string): Promise<Campaign[]> {
    // select campaigns + nested campaign_phases where client_id = _clientId
    throw new Error(NOT_IMPLEMENTED)
  }

  getCampaign(_campaignId: string): Promise<Campaign | undefined> {
    throw new Error(NOT_IMPLEMENTED)
  }

  getLatestSnapshot(_campaignId: string): Promise<MetricsSnapshot | undefined> {
    // select from metrics_snapshots order by captured_at desc limit 1
    throw new Error(NOT_IMPLEMENTED)
  }

  getAggregateSnapshot(_campaignIds: string[]): Promise<MetricsSnapshot | undefined> {
    // fetch latest per campaign then aggregate (reuse aggregateSnapshots logic server- or client-side)
    throw new Error(NOT_IMPLEMENTED)
  }

  getSeries(_campaignId: string, _metric: SeriesMetric): Promise<MetricSeries | undefined> {
    throw new Error(NOT_IMPLEMENTED)
  }

  getReplies(_campaignIds: string[]): Promise<LeadReply[]> {
    throw new Error(NOT_IMPLEMENTED)
  }

  getReports(_campaignIds: string[]): Promise<ReportSummary[]> {
    throw new Error(NOT_IMPLEMENTED)
  }
}
