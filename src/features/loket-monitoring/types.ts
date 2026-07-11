import type {
  LoketColumnHeader,
  LoketTicketItem,
  LoketMonitoringParams,
} from '@/types/services/loket'

export interface LoketMonitoringFilters {
  keyword: string
  orderStartDate: string | null
  orderEndDate: string | null
  claimedStartDate: string | null
  claimedEndDate: string | null
  /** undefined = "semua", true = "sudah diklaim", false = "belum diklaim". */
  claimed: boolean | undefined
}

export const emptyMonitoringFilters = (): LoketMonitoringFilters => ({
  keyword: '',
  orderStartDate: null,
  orderEndDate: null,
  claimedStartDate: null,
  claimedEndDate: null,
  claimed: undefined,
})

export function toMonitoringParams(
  programId: number,
  filters: LoketMonitoringFilters,
  page: number,
  perPage: number,
): LoketMonitoringParams {
  const params: LoketMonitoringParams = { programId, Page: page, PerPage: perPage }
  if (filters.keyword) params.Keyword = filters.keyword
  if (filters.orderStartDate) params.OrderStartDate = filters.orderStartDate
  if (filters.orderEndDate) params.OrderEndDate = filters.orderEndDate
  if (filters.claimed !== undefined) params.Claimed = filters.claimed
  if (filters.claimedStartDate) params.ClaimedStartDate = filters.claimedStartDate
  if (filters.claimedEndDate) params.ClaimedEndDate = filters.claimedEndDate
  return params
}

export type MonitoringHeader = LoketColumnHeader
export type MonitoringRow = LoketTicketItem
