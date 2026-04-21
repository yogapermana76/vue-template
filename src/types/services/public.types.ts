/**
 * Public Types
 * Types for public data (no auth required)
 */

import type {
  BaseResponse,
  BaseComposableParams,
  PaginationOnly,
  PaginatedData,
} from '../common/base.types'

// ============================================
// FYI (For Your Information)
// ============================================

export interface FYIItem {
  order: number
  question: string
  answer: string
  imageUrl: string
  bannerImageUrl: string
}

export type FYIResponse = BaseResponse<FYIItem[]>

// ============================================
// FAQ (Frequently Asked Questions)
// ============================================

export interface FAQItem {
  id: number
  question: string
  answer: string
  category?: string
  order?: number
}

export type FAQResponse = BaseResponse<FAQItem[]>

// ============================================
// Winner Category
// ============================================

export interface WinnerCategory {
  lotteryId: number
  imageUrl: string
  startDate: string
  endDate: string
  timingCategory: 'MONTHLY' | 'ANNUAL'
  created: string
  title: string
  bgColor: string
}

export type WinnerCategoryData = PaginatedData<WinnerCategory>

export type WinnerCategoryResponse = BaseResponse<WinnerCategoryData>

// ============================================
// Winner Terms & Conditions
// ============================================

export interface WinnerTnc {
  order: number
  title: string
  value: string
}

export type WinnerTncResponse = BaseResponse<WinnerTnc[]>

// ============================================
// Request Parameters
// ============================================

export interface WinnerTncParams {
  lotteryId?: string | number
}

// ============================================
// Composable Parameters (reactive-aware)
// ============================================

/** Parameters for useFYI composable */
export type UseFYIParams = BaseComposableParams

/** Parameters for useFAQ composable */
export type UseFAQParams = BaseComposableParams

/** Parameters for useWinnersCategory composable (with pagination) */
export type UseWinnersCategoryParams = BaseComposableParams<PaginationOnly>

/** Parameters for usePublicWinnerTnc composable */
export type UsePublicWinnerTncParams = BaseComposableParams
