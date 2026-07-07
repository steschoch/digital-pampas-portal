import { useMemo } from 'react'
import { Badge, Button, DataTable, Icon, type DataColumn, type DataRow } from '@steschoch/digital-pampas-ds'
import { useDataSource } from '../../lib/data/PortalDataContext'
import { useAsync } from '../../lib/data/useAsync'
import { useScope } from '../../lib/useScope'
import { formatCompact, formatCurrencyCompact, formatLongDate } from '../../lib/format'
import { PageHeader } from '@steschoch/digital-pampas-ds'
import type { ReportSummary } from '../../data/types'
import layout from '../../styles/layout.module.css'

/** Mock export — builds a small CSV client-side and triggers a download. */
function exportReportCsv(report: ReportSummary, campaignName: string): void {
  const rows = [
    ['Report', report.period],
    ['Campaign', campaignName],
    ['Period start', report.periodStart],
    ['Period end', report.periodEnd],
    ['Meetings booked', String(report.meetingsBooked)],
    ['Total replies', String(report.totalReplies)],
    ['Pipeline value (USD)', String(report.pipelineValueUsd)],
  ]
  const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${report.id}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function ReportsPage() {
  const source = useDataSource()
  const { client, campaigns, campaignIds } = useScope()
  const key = campaignIds.join(',')

  const { data: reports, loading } = useAsync(() => source.getReports(campaignIds), [key])

  const campaignName = useMemo(() => {
    const map = new Map(campaigns.map((c) => [c.id, c.name]))
    return (id: string) => map.get(id) ?? id
  }, [campaigns])

  const columns: DataColumn[] = [
    {
      key: 'period',
      header: 'Period',
      render: (row) => {
        const r = row as unknown as ReportSummary
        return (
          <div>
            <div style={{ fontWeight: 'var(--dp-font-weight-medium)' }}>{r.period}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--dp-color-on-surface-variant)' }}>
              {formatLongDate(r.periodStart)} – {formatLongDate(r.periodEnd)}
            </div>
          </div>
        )
      },
    },
    {
      key: 'campaignId',
      header: 'Campaign',
      render: (row) => campaignName((row as unknown as ReportSummary).campaignId),
    },
    {
      key: 'meetingsBooked',
      header: 'Meetings',
      align: 'right',
      render: (row) => formatCompact((row as unknown as ReportSummary).meetingsBooked),
    },
    {
      key: 'totalReplies',
      header: 'Replies',
      align: 'right',
      render: (row) => formatCompact((row as unknown as ReportSummary).totalReplies),
    },
    {
      key: 'pipelineValueUsd',
      header: 'Pipeline',
      align: 'right',
      render: (row) => formatCurrencyCompact((row as unknown as ReportSummary).pipelineValueUsd),
    },
    {
      key: 'format',
      header: 'Export',
      align: 'right',
      render: (row) => {
        const r = row as unknown as ReportSummary
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => exportReportCsv(r, campaignName(r.campaignId))}
          >
            <Icon name="Download" size="xs" /> {r.format.toUpperCase()}
          </Button>
        )
      },
    },
  ]

  return (
    <div className={layout.stack}>
      <PageHeader
        eyebrow="Reports"
        title="Reports"
        subtitle={client ? `${client.name} · monthly & weekly snapshots` : '—'}
        aside={<Badge variant="neutral">Export is a demo</Badge>}
      />
      <DataTable
        columns={columns}
        rows={(reports ?? []) as unknown as DataRow[]}
        sortable
        loading={loading}
        emptyTitle="No reports yet"
        emptyDescription="Monthly and weekly report snapshots will appear here as the campaign runs."
      />
    </div>
  )
}
