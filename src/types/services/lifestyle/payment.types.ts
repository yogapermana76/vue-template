/**
 * Lifestyle Payment Types
 * Types for payment management in Lifestyle API
 */

import type { BaseResponse } from '@/types/common/base.types'

// ============================================
// Payment Entities
// ============================================

export interface LifestylePaymentMethod {
  id: number
  name: string
  code: string
  type: string
  iconUrl: string
  isActive: boolean
  adminFee: number
}

export interface LifestylePaymentDetail {
  paymentId: string
  bookingId: string
  amount: number
  adminFee: number
  totalAmount: number
  paymentMethodCode: string
  paymentMethodName: string
  status: string
  paymentUrl?: string
  vaNumber?: string
  qrCode?: string
  expiresAt: string
  paidAt?: string
  createdAt: string
}

export interface LifestylePaymentInstruction {
  title: string
  steps: string[]
}

// ============================================
// Request Types
// ============================================

export interface LifestyleCreatePaymentRequest {
  bookingId: string
  paymentMethodCode: string
}

export interface LifestyleCheckPaymentStatusParams {
  paymentId: string
}

export interface LifestyleGetPaymentMethodsParams {
  amount?: number
}

export interface LifestyleGetPaymentInstructionParams {
  paymentMethodCode: string
}

// ============================================
// Response Types
// ============================================

export type LifestyleGetPaymentMethodsResponse = BaseResponse<LifestylePaymentMethod[]>

export type LifestyleCreatePaymentResponse = BaseResponse<LifestylePaymentDetail>

export type LifestyleCheckPaymentStatusResponse = BaseResponse<LifestylePaymentDetail>

export type LifestyleGetPaymentDetailResponse = BaseResponse<LifestylePaymentDetail>

export type LifestyleGetPaymentInstructionResponse = BaseResponse<LifestylePaymentInstruction>

export type LifestyleCancelPaymentResponse = BaseResponse<{ success: boolean }>
