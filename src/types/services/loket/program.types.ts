/**
 * Loket Program Types
 */

import type {
  BaseResponse,
  MaybeRef,
  BaseComposableParams,
  PaginationOnly,
} from '@/types/common/base.types'

// ============================================
// Shared Types
// ============================================

export interface LoketPagination {
  Total: number
  PerPage: number
  CurrentPage: number
  FirstPage: number
  LastPage: number
}

// ============================================
// Entities
// ============================================

/**
 * Program entity — shape returned by `/v2/dashboard/programs`.
 *
 * `ProgramID` and `Title` were used by an earlier PLN API and are kept
 * optional here so historical mocks continue to type-check. New code should
 * rely on `ID` and `Name`.
 *
 * `ScheduleCode` describes how event dates behave:
 * - `DATE`: fixed single date range
 * - `DATE_RANGE`: multi-day period (StartDate/EndDate may be null)
 * - `DAILY`: repeating daily program (no fixed dates)
 */
export interface LoketProgram {
  ID: number
  Name: string
  ScheduleCode?: 'DATE' | 'DATE_RANGE' | 'DAILY' | string
  StartDate: string | null
  EndDate: string | null
  ProgramID?: number
  Title?: string
}

/**
 * Banner URL — the real API returns a plain string per entry
 * (see /v2/dashboard/banners/:programId). We keep the alias so consumer code
 * reads more explicitly than a bare `string[]`.
 */
export type LoketBannerURL = string

export interface LoketCategory {
  ID: number
  Name: string
}

/**
 * Event schedule row from `/v2/dashboard/programs/:id/schedules`.
 *
 * Two display variants, keyed off `ScheduleCode`:
 *  - **`DAILY`**: schedule repeats on a specific day of the week — render
 *    `OperationalDay` (e.g. "Senin") in the date column, ignore StartDate/
 *    EndDate.
 *  - **anything else** (typically `DATE`): fixed date range — render
 *    `formatDateRange(StartDate, EndDate)`.
 *
 * All fields except `ID` may be `null` from the API — normalise at render
 * time with a `'-'` fallback (mirrors Eiger).
 */
export interface LoketSchedule {
  ID: number
  Category?: string | null
  Type?: string | null
  StartDate?: string | null
  EndDate?: string | null
  StartTime?: string | null
  EndTime?: string | null
  Timezone?: string | null
  ScheduleCode?: string | null
  OperationalDay?: string | null
}

export interface LoketStatistics {
  PurchasedTicketCount: number
  TransactionCount: number
  CheckedCount: number
  BookedTicketCount: number
  TotalIncomeAmount: number
  UncheckedCount: number
}

/**
 * Loket paginated envelope — differs from `BaseResponse` in that the
 * `pagination` field sits at the envelope level (sibling to `data`), not
 * nested inside `data`. Example (real `/v2/dashboard/programs`):
 *
 * ```json
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "message": "Berhasil",
 *   "data": [ ... ],
 *   "pagination": { "Total": 37, "PerPage": 100, ... }
 * }
 * ```
 */
export interface LoketPaginatedResponse<T> extends BaseResponse<T[]> {
  pagination: LoketPagination
}

// ============================================
// Response Types
// ============================================

export type LoketProgramListResponse = LoketPaginatedResponse<LoketProgram>
export type LoketBannerListResponse = BaseResponse<LoketBannerURL[]>
export type LoketCategoryListResponse = BaseResponse<LoketCategory[]>
export type LoketScheduleListResponse = LoketPaginatedResponse<LoketSchedule>
export type LoketStatisticsResponse = BaseResponse<LoketStatistics>

// ============================================
// Request Parameters (sent to API)
// ============================================

export interface LoketProgramListParams {
  Page?: number
  PerPage?: number
  Name?: string
}

export interface LoketBannersParams {
  programId: number
}

export interface LoketCategoriesParams {
  programId: number
}

export interface LoketScheduleListParams {
  programId: number
  Page?: number
  PerPage?: number
}

export interface LoketStatisticsParams {
  programId: number
  StartDate?: string
  EndDate?: string
  CategoryId?: number
}

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

export type UseLoketProgramsParams = BaseComposableParams<
  PaginationOnly & {
    Name?: MaybeRef<string | undefined>
  }
>

export type UseLoketBannersParams = BaseComposableParams<
  never,
  { programId?: MaybeRef<number | undefined> }
>

export type UseLoketCategoriesParams = BaseComposableParams<
  never,
  { programId?: MaybeRef<number | undefined> }
>

export type UseLoketSchedulesParams = BaseComposableParams<
  PaginationOnly,
  { programId?: MaybeRef<number | undefined> }
>

export type UseLoketStatisticsParams = BaseComposableParams<
  {
    StartDate?: MaybeRef<string | undefined>
    EndDate?: MaybeRef<string | undefined>
    CategoryId?: MaybeRef<number | undefined>
  },
  { programId?: MaybeRef<number | undefined> }
>
