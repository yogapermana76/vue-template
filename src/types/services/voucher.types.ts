/**
 * Voucher Types
 * Types for user voucher operations
 */

import type {
  BaseResponse,
  PaginatedData,
  MaybeRef,
  BaseComposableParams,
} from '../common/base.types'

// ============================================
// Voucher Entities
// ============================================

export interface Voucher {
  id: string
  code: string
  name: string
  description?: string
  validUntil: string
  status: 'ACTIVE' | 'USED' | 'EXPIRED'
  categoryId?: number
  categoryName?: string
}

export interface VoucherCategory {
  id: number
  name: string
  description?: string
}

export interface VoucherDetail extends Voucher {
  terms?: string[]
  howToUse?: string[]
}

// ============================================
// Response Types
// ============================================

export type VoucherPagesResponse = BaseResponse<PaginatedData<Voucher>>
export type VoucherDetailResponse = BaseResponse<VoucherDetail>
export type VoucherCategoryResponse = BaseResponse<VoucherCategory[]>

// ============================================
// Service Request Parameters (non-reactive)
// ============================================

export interface VoucherPagesParams {
  page?: number
  size?: number
  categoryId?: number
}

export interface VoucherDetailParams {
  id: string
}

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

/** Parameters for useVoucherPages composable */
export type UseVoucherPagesParams = BaseComposableParams<{
  categoryId?: MaybeRef<number | undefined>
}>

/** Parameters for useVoucherDetail composable */
export type UseVoucherDetailParams = BaseComposableParams<never, { id?: MaybeRef<string> }>
