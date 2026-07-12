import type { ColumnHeader, TicketItem, MonitoringParams } from '@/types/services'

export interface MonitoringFilters {
  keyword: string
  orderStartDate: string | null
  orderEndDate: string | null
  claimedStartDate: string | null
  claimedEndDate: string | null
  /** undefined = "semua", true = "sudah diklaim", false = "belum diklaim". */
  claimed: boolean | undefined
}

export const emptyMonitoringFilters = (): MonitoringFilters => ({
  keyword: '',
  orderStartDate: null,
  orderEndDate: null,
  claimedStartDate: null,
  claimedEndDate: null,
  claimed: undefined,
})

export function toMonitoringParams(
  programId: number,
  filters: MonitoringFilters,
  page: number,
  perPage: number,
): MonitoringParams {
  const params: MonitoringParams = { programId, Page: page, PerPage: perPage }
  if (filters.keyword) params.Keyword = filters.keyword
  if (filters.orderStartDate) params.OrderStartDate = filters.orderStartDate
  if (filters.orderEndDate) params.OrderEndDate = filters.orderEndDate
  if (filters.claimed !== undefined) params.Claimed = filters.claimed
  if (filters.claimedStartDate) params.ClaimedStartDate = filters.claimedStartDate
  if (filters.claimedEndDate) params.ClaimedEndDate = filters.claimedEndDate
  return params
}

export type MonitoringHeader = ColumnHeader
export type MonitoringRow = TicketItem
