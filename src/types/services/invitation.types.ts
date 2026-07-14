/**
 * Invitation Types
 */

import type { MaybeRef } from 'vue'
import type { BaseComposableParams, BaseResponse } from '@/types/common'
import type { Pagination } from './program.types'

// ============================================
// Entities
// ============================================

export interface InvitationTicket {
  TicketID: number
  TicketName: string
  Quota: number
}

/** Category with tickets — returned by the category-info endpoint. */
export interface InvitationCategory {
  CategoryID: number
  CategoryName: string
  Tickets: InvitationTicket[]
}

/** Category without tickets — returned by the program-info endpoint. */
export interface InvitationCategoryLite {
  CategoryID: number
  CategoryName: string
}

export interface InvitationProgramInfo {
  ProgramID: number
  ProgramName: string
  Categories: InvitationCategoryLite[]
}

// ============================================
// Register (public)
// ============================================

export interface InvitationTicketSelection {
  ticketId: number
  quota: number
}

export interface RegisterInvitationBody {
  name: string
  phone: string
  email: string
  entity: string
  programId: number
  categoryId: number
  tickets: InvitationTicketSelection[]
}

export interface RegisterInvitationData {
  Code: string
}

export type RegisterInvitationResponse = BaseResponse<RegisterInvitationData>

/** Registration is per-program (Electric Run 2026 etc.), so the slug is part of the URL. */
export interface RegisterInvitationParams {
  programSlug: string
  body: RegisterInvitationBody
}

// ============================================
// Program / Category info (public)
// ============================================

export interface InvitationProgramInfoParams {
  programId: number
}

export type InvitationProgramInfoResponse = BaseResponse<InvitationProgramInfo>

export interface InvitationCategoryInfoParams {
  programId: number
  categoryId: number
}

export type InvitationCategoryInfoResponse = BaseResponse<InvitationCategory>

// ============================================
// Summary (private) — quota + status counters, per category + per ticket
// ============================================

export interface InvitationSummaryTicket {
  Id: number
  Name: string
  Quota: number
  Pending: number
  Approved: number
  Disapproved: number
}

export interface InvitationSummaryCategory {
  CategoryId: number
  CategoryName: string
  TotalQuota: number
  TotalPending: number
  TotalApproved: number
  TotalDisapproved: number
  Tickets: InvitationSummaryTicket[]
}

export interface InvitationSummaryParams {
  programId: number
}

export type InvitationSummaryResponse = BaseResponse<InvitationSummaryCategory[]>

// ============================================
// Count (private) — filtered status counters for the list view
// ============================================

export type InvitationStatus = 'pending' | 'approved' | 'disapproved'

export interface InvitationCountQuery {
  categoryId?: number
  keyword?: string
  status?: InvitationStatus
}

export interface InvitationCountParams {
  programId: number
  query?: InvitationCountQuery
}

export interface InvitationCountData {
  Pending: number
  Approved: number
  Disapproved: number
}

export type InvitationCountResponse = BaseResponse<InvitationCountData>

// ============================================
// List (private) — invitation rows. Response shape TBD by backend, kept as unknown.
// ============================================

export interface InvitationListQuery {
  page?: number
  size?: number
  categoryId?: number
  keyword?: string
  status?: InvitationStatus
}

export interface InvitationListParams {
  programId: number
  query?: InvitationListQuery
}

export interface InvitationListRow {
  ID: number
  RequestCode: string
  CreatedAt: string
  Name: string
  Phone: string
  Email: string
  CompanyName: string
  CategoryName: string
  TotalQuota: number
}

/** Backend-driven column definition — used to build DataTable columns dynamically. */
export interface InvitationListHeader {
  Initial: string
  Title: string
  Type: 'string' | 'time' | 'int' | (string & {})
}

/**
 * List response envelope: `header` + `pagination` are envelope-level siblings
 * of `data`, not inside it — mirrors the paginated program endpoint shape.
 */
export interface InvitationListResponse extends BaseResponse<InvitationListRow[]> {
  header: InvitationListHeader[]
  pagination: Pagination
}

// ============================================
// Detail (private) — single invitation record with tickets + generated vouchers
// ============================================

export interface InvitationDetailTicket {
  /** Ticket numeric id — needed for the approve-single mutation payload. */
  TicketID: number
  CategoryName: string
  TicketName: string
  Quota: number
  QuotaApproved: number
}

export interface InvitationDetailVoucher {
  /** Voucher numeric id — needed for the release-voucher mutation payload. */
  VoucherID: number
  Code: string
  CreatedAt: string
  Status: string
  CategoryName: string
  TicketName: string
  /** Server-side gate for the release action. */
  Releasable: boolean
}

export interface InvitationDetail {
  ID: number
  RequestCode: string
  Status: InvitationStatus
  CreatedAt: string
  Name: string
  Phone: string
  Email: string
  CompanyName: string
  Tickets: InvitationDetailTicket[]
  Vouchers: InvitationDetailVoucher[]
}

export interface InvitationDetailParams {
  id: number
}

export type InvitationDetailResponse = BaseResponse<InvitationDetail>

// ============================================
// Approve — bulk (private) — approve or reject one or more invitations at once.
// ============================================

export interface ApproveInvitationBulkBody {
  InvitationCodesIds: number[]
  /** `true` = approve, `false` = reject/disapprove. */
  Approved: boolean
}

export type ApproveInvitationBulkResponse = BaseResponse<Record<string, never>>

// ============================================
// Approve — single (private) — approve/reject a single invitation with
// per-ticket quota allocation. Used by the detail page.
// ============================================

export interface ApproveInvitationSingleTicket {
  TicketId: number
  QuotaApproved: number
}

export interface ApproveInvitationSingleBody {
  InvitationID: number
  Approved: boolean
  Tickets: ApproveInvitationSingleTicket[]
}

export type ApproveInvitationSingleResponse = BaseResponse<Record<string, never>>

// ============================================
// Release voucher (private)
// ============================================

export interface ReleaseVoucherBody {
  VoucherIds: number[]
}

export type ReleaseVoucherResponse = BaseResponse<Record<string, never>>

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

export type UseInvitationProgramInfoParams = BaseComposableParams<
  never,
  { programId?: MaybeRef<number | undefined> }
>

export type UseInvitationCategoryInfoParams = BaseComposableParams<
  never,
  {
    programId?: MaybeRef<number | undefined>
    categoryId?: MaybeRef<number | undefined>
  }
>

export type UseInvitationSummaryParams = BaseComposableParams<
  never,
  { programId?: MaybeRef<number | undefined> }
>

export type UseInvitationDetailParams = BaseComposableParams<
  never,
  { id?: MaybeRef<number | undefined> }
>

export type UseInvitationCountParams = BaseComposableParams<
  {
    categoryId?: MaybeRef<number | undefined>
    keyword?: MaybeRef<string | undefined>
    status?: MaybeRef<InvitationStatus | undefined>
  },
  { programId?: MaybeRef<number | undefined> }
>

export type UseInvitationListParams = BaseComposableParams<
  {
    page?: MaybeRef<number | undefined>
    size?: MaybeRef<number | undefined>
    categoryId?: MaybeRef<number | undefined>
    keyword?: MaybeRef<string | undefined>
    status?: MaybeRef<InvitationStatus | undefined>
  },
  { programId?: MaybeRef<number | undefined> }
>
