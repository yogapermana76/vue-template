/**
 * Public Types
 * Types for public data (no auth required)
 */

import type { BaseResponse, BaseComposableParams, PaginationOnly } from '../common/base.types'

// ============================================
// FYI (For Your Information)
// ============================================

export interface FYIItem {
  id: number
  title: string
  description: string
  imageUrl?: string
  link?: string
  order?: number
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
  id: number
  name: string
  timingCategory: 'MONTHLY' | 'ANNUAL'
  description?: string
}

export type WinnerCategoryResponse = BaseResponse<WinnerCategory[]>

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
