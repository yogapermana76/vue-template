/**
 * Winner Types
 * Types for lottery/reward winners
 */

import type {
  BaseResponse,
  PaginatedData,
  MaybeRef,
  BaseComposableParams,
} from '../common/base.types'

// ============================================
// Winner Entities
// ============================================

export interface Winner {
  id?: string
  fullname: string
  email: string
  phoneNumber: string
  title: string
  img: string
  index?: number
}

export interface WinnerTnc {
  order: number
  title: string
  value: string
}

// ============================================
// Response Types
// ============================================

export interface WinnersData extends PaginatedData<Winner> {
  detailUserWinner?: Winner | null
}

export type WinnersResponse = BaseResponse<WinnersData>
export type WinnerTncResponse = BaseResponse<WinnerTnc[]>

// ============================================
// Request Parameters
// ============================================

export interface WinnersParams {
  page?: number
  size?: number
  timingCategory?: 'MONTHLY' | 'ANNUAL'
  lotteryId?: string | number
}

export interface WinnerCategoryParams {
  lotteryId?: string | number
}

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

/** Parameters for useWinnerList composable */
export type UseWinnerListParams = BaseComposableParams<{
  timingCategory?: MaybeRef<'MONTHLY' | 'ANNUAL' | undefined>
  lotteryId?: MaybeRef<string | number | undefined>
}>

/** Parameters for useWinnerListInfinite composable */
export type UseWinnerListInfiniteParams = BaseComposableParams<{
  size?: number
  timingCategory?: MaybeRef<'MONTHLY' | 'ANNUAL' | undefined>
  lotteryId?: MaybeRef<string | number | undefined>
}>

/** Parameters for useWinnerCategories composable */
export type UseWinnerCategoriesParams = BaseComposableParams<{
  lotteryId?: MaybeRef<string | number | undefined>
}>

/** Parameters for useWinnerTnc composable */
export type UseWinnerTncParams = BaseComposableParams<{
  lotteryId?: MaybeRef<string | number | undefined>
}>
