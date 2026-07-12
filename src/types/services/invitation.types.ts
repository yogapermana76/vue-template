/**
 * Invitation Types
 */

import type { MaybeRef } from 'vue'
import type { BaseComposableParams, BaseResponse } from '@/types/common'

// ============================================
// Entities
// ============================================

export interface InvitationTicket {
  TicketID: number
  TicketName: string
  Quota: number
}

export interface InvitationCategory {
  CategoryID: number
  CategoryName: string
  Tickets: InvitationTicket[]
}

export interface InvitationProgramInfo {
  ProgramID: number
  ProgramName: string
  Categories: InvitationCategory[]
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
// Approve (private)
// ============================================

export interface ApproveInvitationBody {
  InvitationCodesIds: number[]
}

export type ApproveInvitationResponse = BaseResponse<Record<string, never>>

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
