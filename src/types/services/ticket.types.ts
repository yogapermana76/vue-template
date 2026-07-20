/**
 * Ticket Types
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
export interface TicketDetail {
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
 * Racepack collection window/location for run-events. Attached per-ticket
 * because different ticket types (5K, 10K, etc.) can have their own pickup
 * windows. Null-safe: backend omits the whole block when the event is not
 * a racepack event.
 */
export interface RacepackData {
  CityId?: number
  ProvinceId?: number
  DistrictId?: number
  SubdistrictId?: number
  Address?: string
  AddressTitle?: string
  StartDate?: string
  EndDate?: string
  OpenTime?: string
  CloseTime?: string
  Timezone?: string
  MapsUrl?: string
  [key: string]: unknown
}

/**
 * Ticket summary as returned inside `ScanResult.Unclaimed[]` /
 * `ScanResult.Claimed[]`. Trimmed shape (does NOT include the full
 * detail — call `getDetail` for that). `Claimable` drives whether the
 * operator can confirm the check-in: an unclaimed ticket may still be
 * un-claimable (e.g. outside its visit window).
 */
export interface ScanTicketItem {
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
  RacepackData?: RacepackData | null
  [key: string]: unknown
}

/**
 * Order-level summary returned alongside the ticket lists.
 * Represents the purchase context (who paid, when, for how many tickets).
 */
export interface ScanOrderInfo {
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
export interface ScanResult {
  Order?: ScanOrderInfo
  Unclaimed?: ScanTicketItem[] | null
  Claimed?: ScanTicketItem[] | null
  [key: string]: unknown
}

export interface ClaimResult {
  SuccessCodes: string[]
  FailedCodes: string[]
}

// ============================================
// Response Types
// ============================================

export type TicketDetailResponse = BaseResponse<TicketDetail>
export type ScanTicketResponse = BaseResponse<ScanResult>
export type ClaimTicketResponse = BaseResponse<ClaimResult>

// ============================================
// Ticket form (visitor-editable fields per ticket)
// ============================================

export type TicketFormHtmlType =
  | 'text'
  | 'tel'
  | 'email'
  | 'date'
  | 'time'
  | 'radio'
  | 'dropdown'
  | 'checkbox'
  | 'bool'
  | 'textarea'
  | 'number'
  | (string & {})

/** Choice option for radio/dropdown/checkbox fields. */
export interface TicketFormFieldOption {
  id: string
  label: string
}

/** Validation rules — mostly opaque to the client but `regex` is enforced UI-side. */
export interface TicketFormFieldValidation {
  regex?: string
  sql?: string
  [key: string]: unknown
}

/**
 * One editable/read-only field returned by `GET /v2/ticket/form/:programId/:code`.
 * Drives the racepack-collection / visitor-edit form.
 */
export interface TicketFormField {
  Name: string
  Label: string
  Value: string
  /** Selected option id for radio/dropdown; empty for free-text fields. */
  ValueId: string
  HtmlType: TicketFormHtmlType
  Validation: TicketFormFieldValidation | null
  /** Options for choice fields; null for free-text. */
  Data: TicketFormFieldOption[] | null
  IsRequired: boolean
  IsEditable: boolean
  EditableRoles: string[] | null
  EditableUntil: string
  Description: string
}

export type TicketFormResponse = BaseResponse<TicketFormField[]>

// ============================================
// Request Parameters (sent to API)
// ============================================

export interface TicketDetailParams {
  programId: number
  code: string
}

export interface ScanTicketParams {
  code: string
}

export interface ClaimTicketRequest {
  Codes: string[]
}

export interface TicketFormParams {
  programId: number
  code: string
}

/** Body shape sent to `PUT /v2/visitors/edit` to persist visitor field changes. */
export interface EditVisitorFieldPayload {
  name: string
  value: string
  /** Required for radio/dropdown fields; empty string for free-text. */
  valueId: string
}

export interface EditVisitorBody {
  code: string
  fields: EditVisitorFieldPayload[]
}

export type EditVisitorResponse = BaseResponse<Record<string, never>>

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

export type UseTicketDetailParams = BaseComposableParams<
  never,
  { programId?: MaybeRef<number | undefined>; code?: MaybeRef<string | undefined> }
>

export type UseScanTicketParams = BaseComposableParams<
  never,
  { code?: MaybeRef<string | undefined> }
>

export type UseTicketFormParams = BaseComposableParams<
  never,
  { programId?: MaybeRef<number | undefined>; code?: MaybeRef<string | undefined> }
>
