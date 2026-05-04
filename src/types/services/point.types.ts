/**
 * Point Types
 * Types for point/coin related operations
 */

import type {
  BaseResponse,
  PaginatedData,
  MaybeRef,
  BaseComposableParams,
  PaginationOnly,
} from '../common/base.types'
import type { FullAddress } from './reward.types'

// ============================================
// Point Summary
// ============================================

export interface PointSummary {
  balance: number
  startDate?: string
  endDate: string
}

export type PointSummaryResponse = BaseResponse<PointSummary>

// ============================================
// Point History
// ============================================

export interface PointHistoryItem {
  id: number
  userId?: number
  activity: string
  activityId?: number
  activityType?: string
  description?: string
  qty?: number
  refId?: string
  created: string
  point: number
  detailRequest?: unknown
}

export type PointHistoryData = PaginatedData<PointHistoryItem>

export type PointHistoryResponse = BaseResponse<PointHistoryData>

// ============================================
// Point Detail
// ============================================

export interface PointDetail extends FullAddress {
  id: string
  point: number
  created: string
  activity: string
}

export type PointDetailResponse = BaseResponse<PointDetail>

// ============================================
// Request Parameters
// ============================================

export interface PointHistoryParams {
  page?: number
  size?: number
}

export interface PointDetailParams {
  id: string
}

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

/** Parameters for usePointSummary composable */
export type UsePointSummaryParams = BaseComposableParams

/** Parameters for usePointHistory composable (with pagination) */
export type UsePointHistoryParams = BaseComposableParams<PaginationOnly>

/** Parameters for usePointHistoryInfinite composable */
export type UsePointHistoryInfiniteParams = BaseComposableParams<{
  size?: number
}>

/** Parameters for usePointDetail composable */
export type UsePointDetailParams = BaseComposableParams<never, { id?: MaybeRef<string> }>
