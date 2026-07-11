import type { ColumnDef } from '@/components/ui/table'
import type { MonitoringHeader, MonitoringRow } from '../types'

const KNOWN_DATE_KEYS = new Set(['OrderDate', 'ClaimedAt', 'ClaimedDate', 'CreatedAt', 'UpdatedAt'])
const KNOWN_STATUS_KEYS = new Set(['Claimed', 'Status'])
const KNOWN_AMOUNT_KEYS = new Set(['Amount', 'Price', 'Total'])

// No actions column — the whole row is clickable via `clickable-rows`.
export function createMonitoringColumns(headers: MonitoringHeader[]): ColumnDef<MonitoringRow>[] {
  return headers.map((h, index) => {
    const inferred =
      h.Type ??
      (KNOWN_DATE_KEYS.has(h.Initial)
        ? 'date'
        : KNOWN_STATUS_KEYS.has(h.Initial)
          ? 'status'
          : KNOWN_AMOUNT_KEYS.has(h.Initial)
            ? 'amount'
            : undefined)

    return {
      key: h.Initial,
      label: h.Title,
      sortable: false,
      minWidth: index === 0 ? '180px' : undefined,
      align: inferred === 'amount' ? 'right' : undefined,
      cell: inferred,
    }
  })
}
