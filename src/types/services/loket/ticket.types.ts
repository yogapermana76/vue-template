/**
 * Loket Ticket Types
 */

import type { BaseResponse, MaybeRef, BaseComposableParams } from '@/types/common/base.types'

// ============================================
// Entities
// ============================================

/**
 * Full ticket detail — populated by `GET /v2/ticket/detail/:programId/:code`.
 *
 * Structure follows the fields Eiger's monitoring detail modal renders. Grouped
 * conceptually into three sections:
 * - **Visitor** (Fullname, PhoneNumber, Email) → the person who will attend
 * - **Ticket** (TicketCode, TicketCategory, TicketType, Information[])
 * - **Buyer** (BuyerName, BuyerPhone, BuyerEmail, OrderNumber) → paying party
 * - **Timestamps + status** (OrderDate, ClaimedAt, StartVisit*, EndVisit*, Timezone)
 *
 * All fields are optional to accommodate incomplete backend data.
 */
export interface LoketTicketDetail {
  // Identity
  TicketCode: string
  TicketCategoryID?: number
  Name?: string

  // Visitor (attendee)
  Fullname?: string
  PhoneNumber?: string
  Email?: string
  TicketCategory?: string
  TicketType?: string
  /**
   * Optional custom info fields per event (bib number, shirt size, seat, etc).
   * Keys are lowercase to match Eiger's API contract exactly.
   */
  Information?: Array<{ label: string; value: string | string[] | boolean | null }>

  // Buyer (order-level)
  OrderNumber?: string
  BuyerName?: string
  BuyerPhone?: string
  BuyerEmail?: string
  ClaimedCount?: number
  TotalTicket?: number

  // Timestamps & status
  OrderDate?: string
  ClaimedAt?: string | null
  Claimed?: boolean
  /**
   * true = this is the first successful check-in → header shows
   * "Tiket Berhasil Dipakai" (green).
   * false = re-scan attempt of an already-claimed ticket → header shows
   * "Tiket Sudah Dipakai" (red warning).
   */
  isFirstCheckin?: boolean
  UpdatedBy?: string | null
  Timezone?: string
  StartVisitDate?: string
  StartVisitTime?: string
  EndVisitDate?: string
  EndVisitTime?: string

  // Amount
  Amount?: number

  [key: string]: unknown
}

/**
 * Ticket summary as returned inside `LoketScanResult.Unclaimed[]` /
 * `LoketScanResult.Claimed[]`. Trimmed shape (does NOT include the full
 * detail — call `getDetail` for that). `Claimable` drives whether the
 * operator can confirm the check-in: an unclaimed ticket may still be
 * un-claimable (e.g. outside its visit window).
 */
export interface LoketScanTicketItem {
  TicketCode: string
  Fullname?: string
  Claimed: boolean
  ClaimedAt?: string | null
  TicketType?: string
  StartVisitDate?: string
  StartVisitTime?: string
  EndVisitDate?: string
  EndVisitTime?: string
  Claimable: boolean
  TicketExpiredAt?: string | null
  [key: string]: unknown
}

/**
 * Order-level summary returned alongside the ticket lists.
 * Represents the purchase context (who paid, when, for how many tickets).
 */
export interface LoketScanOrderInfo {
  OrderId?: number
  OrderNumber?: string
  TicketCategory?: string
  BuyerName?: string
  BuyerEmail?: string
  BuyerPhone?: string
  OrderDate?: string
  ClaimedCount?: number
  TotalTicket?: number
  Timezone?: string
  [key: string]: unknown
}

/**
 * `POST /v2/ticket/scan/:code` response body.
 *
 * The endpoint groups every ticket under the same order (a single order
 * can carry many tickets) into `Unclaimed[]` vs `Claimed[]` buckets, plus
 * an `Order` summary. There is no top-level `IsValid` flag — the concept
 * of "valid" is derived from the presence of at least one claimable ticket
 * in `Unclaimed[]`.
 */
export interface LoketScanResult {
  Order?: LoketScanOrderInfo
  Unclaimed?: LoketScanTicketItem[] | null
  Claimed?: LoketScanTicketItem[] | null
  [key: string]: unknown
}

export interface LoketClaimResult {
  SuccessCodes: string[]
  FailedCodes: string[]
}

// ============================================
// Response Types
// ============================================

export type LoketTicketDetailResponse = BaseResponse<LoketTicketDetail>
export type LoketScanTicketResponse = BaseResponse<LoketScanResult>
export type LoketClaimTicketResponse = BaseResponse<LoketClaimResult>

// ============================================
// Request Parameters (sent to API)
// ============================================

export interface LoketTicketDetailParams {
  programId: number
  code: string
}

export interface LoketScanTicketParams {
  code: string
}

export interface LoketClaimTicketRequest {
  Codes: string[]
}

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

export type UseLoketTicketDetailParams = BaseComposableParams<
  never,
  { programId?: MaybeRef<number | undefined>; code?: MaybeRef<string | undefined> }
>

export type UseLoketScanTicketParams = BaseComposableParams<
  never,
  { code?: MaybeRef<string | undefined> }
>
