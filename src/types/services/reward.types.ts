/**
 * Reward Types
 * Types for reward/gift operations
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
// Reward Entities
// ============================================

export interface Reward {
  id: string
  title: string
  description: string
  imageUrl: string
  pricePoint: number
  categoryId?: number
  categoryName?: string
  stock?: number
  status?: 'AVAILABLE' | 'OUT_OF_STOCK'
}

export interface RewardCategory {
  id: number
  name: string
  description?: string
}

export interface RewardDetail extends Reward {
  terms?: string[]
  howToRedeem?: string[]
}

// ============================================
// Gift Instantly (Instant Rewards)
// ============================================

export interface GiftInstantly extends Reward {
  claimedAt?: string
}

export interface UserGiftInstantly {
  id: string
  title: string
  description: string
  imageUrl: string
  point: number
  created: string
  status: 'CLAIMED' | 'USED'
}

export interface UserGiftInstantlyDetail extends UserGiftInstantly, FullAddress {}

// ============================================
// Last Address
// ============================================

export interface LastAddress extends FullAddress {
  id: string
  updatedAt: string
}

// ============================================
// Exchange Request/Response
// ============================================

export interface ExchangeRequest extends FullAddress {
  itemId: number
}

export interface ExchangeResult {
  id: string
  itemId: number
  point: number
  status: 'SUCCESS' | 'PENDING' | 'FAILED'
  transactionId?: string
}

export type ExchangeResponse = BaseResponse<ExchangeResult>

// ============================================
// Response Types
// ============================================

export type RewardGiftInstantlyResponse = BaseResponse<PaginatedData<GiftInstantly>>
export type RewardRedeemableResponse = BaseResponse<PaginatedData<Reward>>
export type RewardDetailResponse = BaseResponse<RewardDetail>
export type RewardCategoryResponse = BaseResponse<RewardCategory[]>

export type UserGiftInstantlyResponse = BaseResponse<PaginatedData<UserGiftInstantly>>
export type UserGiftInstantlyDetailResponse = BaseResponse<UserGiftInstantlyDetail>

export type LastAddressResponse = BaseResponse<LastAddress | null>

// ============================================
// Request Parameters
// ============================================

export interface RewardPagesParams {
  page?: number
  size?: number
  categoryId?: number
}

export interface RewardDetailParams {
  id: string
}

export interface UserGiftInstantlyParams {
  page?: number
  size?: number
}

export interface UserGiftInstantlyDetailParams {
  id: string
}

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

/** Parameters for useRewardGiftInstantly composable (with pagination) */
export type UseRewardGiftInstantlyParams = BaseComposableParams<PaginationOnly>

/** Parameters for useRewardRedeemable composable (with pagination) */
export type UseRewardRedeemableParams = BaseComposableParams<PaginationOnly>

/** Parameters for useRewardRedeemableDetail composable */
export type UseRewardRedeemableDetailParams = BaseComposableParams<never, { id?: MaybeRef<string> }>

/** Parameters for useRewardGiftInstantlyDetail composable */
export type UseRewardGiftInstantlyDetailParams = BaseComposableParams<
  never,
  { id?: MaybeRef<string> }
>

/** Parameters for useUserGiftInstantly composable (with pagination) */
export type UseUserGiftInstantlyParams = BaseComposableParams<PaginationOnly>

/** Parameters for useUserGiftInstantlyDetail composable */
export type UseUserGiftInstantlyDetailParams = BaseComposableParams<
  never,
  { id?: MaybeRef<string> }
>
