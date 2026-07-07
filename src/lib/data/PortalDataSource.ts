/**
 * The "waiter" (architecture §3.1). Screens never enter the kitchen; they ask the
 * waiter ("give me campaign X's metrics") and get a plate back.
 *
 * Every method is async FROM THE START so that swapping MockDataSource for
 * SupabaseDataSource later changes zero call-sites — same signatures, same shapes.
 */

import type {
  Campaign,
  ClientAccount,
  LeadReply,
  MetricSeries,
  MetricsSnapshot,
  ReportSummary,
  SeriesMetric,
} from '../../data/types'

export interface PortalDataSource {
  /** Clients this login may view. */
  getClients(clientIds: string[]): Promise<ClientAccount[]>
  /** Campaigns belonging to a client. */
  getCampaigns(clientId: string): Promise<Campaign[]>
  /** A single campaign by id. */
  getCampaign(campaignId: string): Promise<Campaign | undefined>
  /** Latest metrics snapshot for one campaign. */
  getLatestSnapshot(campaignId: string): Promise<MetricsSnapshot | undefined>
  /** Aggregated snapshot across many campaigns (the "All campaigns" view). */
  getAggregateSnapshot(campaignIds: string[]): Promise<MetricsSnapshot | undefined>
  /** A named daily time series for one campaign. */
  getSeries(campaignId: string, metric: SeriesMetric): Promise<MetricSeries | undefined>
  /** Replies across one or more campaigns, newest first. */
  getReplies(campaignIds: string[]): Promise<LeadReply[]>
  /** Report snapshots across one or more campaigns, newest first. */
  getReports(campaignIds: string[]): Promise<ReportSummary[]>
}
