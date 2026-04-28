/**
 * Lifestyle Check Types
 * Types for validation and health check in Lifestyle API
 */

import type { BaseResponse } from '@/types/common/base.types'

// ============================================
// Check Entities
// ============================================

export interface LifestyleHealthCheck {
  status: string
  timestamp: string
  version: string
}

export interface LifestyleValidationResult {
  isValid: boolean
  message?: string
  errors?: string[]
}

// ============================================
// Request Types
// ============================================

export interface LifestyleValidatePromoCodeRequest {
  promoCode: string
  programId: number
  amount: number
}

export interface LifestyleValidateUserEligibilityRequest {
  programId: number
  userId: number
}

export interface LifestyleCheckConditionParams {
  programId: number
}

// ============================================
// Response Types
// ============================================

export interface LifestyleCheckConditionData {
  totalOwnedTickets: number
  maxTicketRulesTrx: boolean
  maxTicketTrx: number
  maxTicketRulesAccount: boolean
  maxTicketAccount: number
}

export type LifestyleHealthCheckResponse = BaseResponse<LifestyleHealthCheck>

export type LifestyleValidatePromoCodeResponse = BaseResponse<
  LifestyleValidationResult & {
    discountAmount?: number
    finalAmount?: number
  }
>

export type LifestyleValidateUserEligibilityResponse = BaseResponse<LifestyleValidationResult>

export type LifestyleSystemStatusResponse = BaseResponse<{
  isOnline: boolean
  message: string
}>

export type LifestyleCheckConditionResponse = BaseResponse<LifestyleCheckConditionData>
