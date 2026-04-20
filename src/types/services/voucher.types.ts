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
  codename: string
  id: number
  title: string
  description: string
  availableQuota: number
  expiredDate: string
  imageUrl: string
  voucherId: number
  voucherCode: string | null
  createdDate: string
}

export interface VoucherCategory {
  id: number
  title: string
  activeColorCode: string
  inactiveColorCode: string
  created: string | null
  updated: string | null
  enable: boolean
  sort: number
}

export interface VoucherCodeInfo {
  type: 'LINK' | 'CODE'
  value: string
}

export interface VoucherDetail {
  id: number
  title: string
  description: string
  imageUrl: string
  expiredDate: string
  termsCondition?: string[]
  howToUse?: string[]
  voucherCode: VoucherCodeInfo
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
  voucherCode: string
  voucherId: string | number
}

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

/** Parameters for useVoucherPages composable */
export type UseVoucherPagesParams = BaseComposableParams<{
  categoryId?: MaybeRef<number | undefined>
}>

/** Parameters for useVoucherDetail composable */
export type UseVoucherDetailParams = BaseComposableParams<
  never,
  { voucherCode?: MaybeRef<string>; voucherId?: MaybeRef<string | number> }
>

/** Parameters for useVoucherCategories composable */
export type UseVoucherCategoriesParams = BaseComposableParams
