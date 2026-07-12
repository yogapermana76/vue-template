/**
 * Monitoring Types
 */

import type {
  BaseResponse,
  MaybeRef,
  BaseComposableParams,
  PaginationOnly,
} from '@/types/common/base.types'
import type { Pagination } from './program.types'

// ============================================
// Entities
// ============================================

/**
 * Monitoring row. Known fields are typed; everything else flows through
 * the `[key: string]: unknown` index signature (columns are API-driven).
 */
export interface TicketItem {
  TicketCode?: string
  Code?: string
  /** Per-order TZ abbreviation ("WIB"/"WITA"/"WIT"). Drives cell rendering. */
  Timezone?: string
  [key: string]: unknown
}

/**
 * Column header from `/v2/monitoring/:programId`. `Initial` = field key on
 * the row, `Title` = display label, `Type` = optional cell renderer hint.
 */
export interface ColumnHeader {
  Initial: string
  Title: string
  Type?: string
}

// ============================================
// Response Types
// ============================================

/**
 * Monitoring envelope: standard `{ data, pagination }` + a dynamic `header`
 * array describing column definitions.
 */
export interface MonitoringResponse extends BaseResponse<TicketItem[]> {
  header: ColumnHeader[]
  pagination: Pagination
}

// ============================================
// Request Parameters (sent to API)
// ============================================

export interface MonitoringParams {
  programId: number
  Page?: number
  PerPage?: number
  Keyword?: string
  OrderStartDate?: string
  OrderEndDate?: string
  Claimed?: boolean
  ClaimedStartDate?: string
  ClaimedEndDate?: string
}

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

export type UseMonitoringParams = BaseComposableParams<
  PaginationOnly & {
    Keyword?: MaybeRef<string>
    OrderStartDate?: MaybeRef<string | undefined>
    OrderEndDate?: MaybeRef<string | undefined>
    Claimed?: MaybeRef<boolean | undefined>
    ClaimedStartDate?: MaybeRef<string | undefined>
    ClaimedEndDate?: MaybeRef<string | undefined>
  },
  { programId?: MaybeRef<number | undefined> }
>
