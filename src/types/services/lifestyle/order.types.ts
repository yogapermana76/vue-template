/**
 * Lifestyle Order Types
 * Types for order management in Lifestyle API
 */

import type { BaseResponse } from '@/types/common/base.types'

// ============================================
// Order Entities
// ============================================

export interface LifestyleOrderItem {
  programTicketCategoryId: number
  ticketCategory: string
  quantity: number
  price: number
  subtotal: number
}

export interface LifestyleOrder {
  orderId: string
  bookingId: string
  programId: number
  programName: string
  visitDate: string
  items: LifestyleOrderItem[]
  totalAmount: number
  discountAmount: number
  adminFee: number
  finalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
  updatedAt: string
}

export interface LifestyleInvoice {
  invoiceId: string
  orderId: string
  invoiceNumber: string
  invoiceUrl: string
  createdAt: string
}

// ============================================
// Request Types
// ============================================

export interface LifestyleGetOrderHistoryParams {
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}

export interface LifestyleGetOrderDetailParams {
  orderId: string
}

export interface LifestyleGetInvoiceParams {
  orderId: string
}

export interface LifestyleCancelOrderRequest {
  orderId: string
  reason?: string
}

// ============================================
// Response Types
// ============================================

export type LifestyleGetOrderHistoryResponse = BaseResponse<{
  orders: LifestyleOrder[]
  total: number
}>

export type LifestyleGetOrderDetailResponse = BaseResponse<LifestyleOrder>

export type LifestyleGetInvoiceResponse = BaseResponse<LifestyleInvoice>

export type LifestyleCancelOrderResponse = BaseResponse<{ success: boolean }>

export type LifestyleDownloadInvoiceResponse = BaseResponse<{
  invoiceUrl: string
}>
