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
  type?: 'ITEM' | 'VOUCHER'
  categoryId?: number
  categoryName?: string
  stock?: number
  status?: 'AVAILABLE' | 'OUT_OF_STOCK'
}

export interface RewardCategory {
  id: number
  category: string
  label: string
  orderBy: number
  description?: string
}

export interface TermCondition {
  label: string
  value: string | string[]
}

export interface AddRules {
  reward_max?: {
    qty: number
    type: string
  }
}

export interface RewardDetail extends Reward {
  active: boolean
  type: 'ITEM' | 'VOUCHER'
  termsCondition?: TermCondition[]
  howToUse?: string[]
  addRules?: AddRules
  quotaUsage?: number
  startDate?: string
  endDate?: string
  created?: string
  updated?: string
  createdBy?: string | null
  updatedBy?: string | null
  activityId?: number | null
  lotteryId?: number | null
  canExchanged?: boolean
  voucherId?: number | null
  rewardCategoryId?: number
  remainingQuota?: number
}

// ============================================
// Gift Instantly (Instant Rewards)
// ============================================

export interface GiftInstantly extends Reward {
  claimedAt?: string
  quota?: number
  quotaUsage?: number
}

export interface UserGiftInstantly {
  rewardId: number
  tUserPointId: number
  imageUrl: string | null
  title: string
}

export interface UserGiftInstantlyDetail extends UserGiftInstantly {
  description: string
  termsCondition?: TermCondition[]
  fullname: string
  phoneNumber: string
  provinceName: string
  cityName: string
  districtName: string
  postalCode: string
}

// ============================================
// Exchange Point Detail
// ============================================

export interface ExchangePointAddress {
  id: number
  fullname: string
  nohp: string
  provinceId: string
  provinceName: string
  cityId: string
  cityName: string
  districtId: string
  districtName: string
  address: string
  postalCode: string
}

export interface ExchangePointDetail {
  created: string
  point: number
  title: string
  address: ExchangePointAddress | null
  description?: string
  typeOfService?: string
}

// ============================================
// Verify Info
// ============================================

export interface VerifyInfoData {
  deeplink: string
}

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
  rewardId: number
}

export interface ExchangeResult {
  id: number
  pricePoint: number
  total: number
  transactionDate: string
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

export type ExchangePointDetailResponse = BaseResponse<ExchangePointDetail>
export type VerifyInfoResponse = BaseResponse<VerifyInfoData | null>
export type SetExpiredTokenResponse = BaseResponse<null>

// ============================================
// Request Parameters
// ============================================

export interface RewardPagesParams {
  page?: number
  size?: number
  type?: string
  rewardCategoryId?: number | string
}

export interface RewardDetailParams {
  id: string
}

export interface UserGiftInstantlyParams {
  page?: number
  size?: number
}

export interface UserGiftInstantlyDetailParams {
  userPointId: string
}

export interface ExchangePointDetailParams {
  tUserPointId: string | number
}

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

/** Parameters for useRewardGiftInstantly composable (with pagination and optional filters) */
export type UseRewardGiftInstantlyParams = BaseComposableParams<
  PaginationOnly & {
    type?: MaybeRef<string | undefined>
    rewardCategoryId?: MaybeRef<string | number | undefined>
  }
>

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
  { userPointId?: MaybeRef<string> }
>

/** Parameters for useExchangePointDetail composable */
export type UseExchangePointDetailParams = BaseComposableParams<
  never,
  { tUserPointId?: MaybeRef<string | number> }
>

/** Parameters for useVerifyInfo composable */
export type UseVerifyInfoParams = BaseComposableParams
