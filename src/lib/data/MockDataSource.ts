/**
 * MockDataSource — the "test kitchen" implementation of the waiter. Reads the
 * demo dataset (`portalMock.ts`). A small artificial latency is added so the
 * loading/skeleton states are real (and match how Supabase will behave).
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
import {
  aggregateSnapshots,
  clients,
  getCampaignById,
  getCampaignsForClient,
  getLatestSnapshot,
  getReportsForCampaigns,
  getRepliesForCampaign,
  getSeries,
} from '../../data/portalMock'

/** Simulated network latency (ms) so skeleton states are exercised. */
const LATENCY = 320

function delay<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export class MockDataSource implements PortalDataSource {
  getClients(clientIds: string[]): Promise<ClientAccount[]> {
    return delay(clients.filter((c) => clientIds.includes(c.id)))
  }

  getCampaigns(clientId: string): Promise<Campaign[]> {
    return delay(getCampaignsForClient(clientId))
  }

  getCampaign(campaignId: string): Promise<Campaign | undefined> {
    return delay(getCampaignById(campaignId))
  }

  getLatestSnapshot(campaignId: string): Promise<MetricsSnapshot | undefined> {
    return delay(getLatestSnapshot(campaignId))
  }

  getAggregateSnapshot(campaignIds: string[]): Promise<MetricsSnapshot | undefined> {
    return delay(aggregateSnapshots(campaignIds))
  }

  getSeries(campaignId: string, metric: SeriesMetric): Promise<MetricSeries | undefined> {
    return delay(getSeries(campaignId, metric))
  }

  getReplies(campaignIds: string[]): Promise<LeadReply[]> {
    const rows = campaignIds
      .flatMap((id) => getRepliesForCampaign(id))
      .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
    return delay(rows)
  }

  getReports(campaignIds: string[]): Promise<ReportSummary[]> {
    const rows = getReportsForCampaigns(campaignIds).sort((a, b) =>
      b.periodStart.localeCompare(a.periodStart),
    )
    return delay(rows)
  }
}
