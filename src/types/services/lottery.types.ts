/**
 * Lottery Types
 * Types for lottery/promo operations
 */

import type {
  BaseResponse,
  PaginatedData,
  FullAddress,
  MaybeRef,
  BaseComposableParams,
  PaginationOnly,
} from '../common/base.types'

// ============================================
// Lottery Entities
// ============================================

export interface LotteryTermsCondition {
  label: string
  value: string
}

export interface Lottery {
  id: string
  title: string
  description: string
  imageUrl: string
  pricePoint: number
  termsCondition?: LotteryTermsCondition[]
  startDate?: string
  endDate?: string
  stock?: number
  status?: 'ACTIVE' | 'ENDED'
}

export interface LotteryDetail extends Lottery {
  termsCondition: LotteryTermsCondition[]
}

// ============================================
// User Lottery
// ============================================

export interface LotteryCode {
  lotteryCode: string
}

export interface UserLottery {
  redeemCount: number
  id: number
  imageUrl: string
  title: string
  startDate: string
  endDate: string
  timingCategory: 'MONTHLY' | 'ANNUAL'
  specification: string | null
}

export interface UserLotteryDetail extends Omit<UserLottery, 'id'> {
  description: string
  expiredDate: string
  announceDate: string
  lotteryCodes: LotteryCode[]
  pricePoint?: number
  termsCondition?: LotteryTermsCondition[]
}

// ============================================
// Redeem Request/Response
// ============================================

export interface LotteryRedeemRequest extends FullAddress {
  lotteryId: number
}

export interface LotteryRedeemResult {
  id: number
  userId: number
  lotteryId: number
  lotteryCode: string
  created: string
  updated: string
  tUserPointId: number
}

export type LotteryRedeemResponse = BaseResponse<LotteryRedeemResult>

// ============================================
// Response Types
// ============================================

export type LotteryRedeemablePagesResponse = BaseResponse<PaginatedData<Lottery>>
export type LotteryDetailResponse = BaseResponse<LotteryDetail>
export type LotteryPromoResponse = BaseResponse<PaginatedData<Lottery>>

export type UserLotteryListResponse = BaseResponse<PaginatedData<UserLottery>>
export type UserLotteryDetailResponse = BaseResponse<UserLotteryDetail>

// ============================================
// Request Parameters
// ============================================

export interface LotteryRedeemablePagesParams {
  page?: number
  size?: number
}

export interface LotteryDetailParams {
  id: string
}

export interface LotteryPromoParams {
  page?: number
  size?: number
}

export interface UserLotteryListParams {
  page?: number
  size?: number
}

export interface UserLotteryDetailParams {
  id: string
}

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

/** Parameters for useLotteryRedeemablePages composable (with pagination) */
export type UseLotteryRedeemablePagesParams = BaseComposableParams<PaginationOnly>

/** Parameters for useLotteryDetail composable */
export type UseLotteryDetailParams = BaseComposableParams<never, { id?: MaybeRef<string> }>

/** Parameters for useLotteryPromo composable (with pagination) */
export type UseLotteryPromoParams = BaseComposableParams<PaginationOnly>

/** Parameters for useUserLotteryList composable (with pagination) */
export type UseUserLotteryListParams = BaseComposableParams<PaginationOnly>

/** Parameters for useUserLotteryDetail composable */
export type UseUserLotteryDetailParams = BaseComposableParams<never, { id?: MaybeRef<string> }>
