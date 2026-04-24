/**
 * Lifestyle Booking Types
 * Types for booking management in Lifestyle API
 */

import type { BaseResponse } from '@/types/common/base.types'

// ============================================
// Booking Entities
// ============================================

export interface LifestyleBookingParticipant {
  name: string
  email?: string
  phone: string
  identityNumber?: string
  [key: string]: unknown // For dynamic form fields
}

export interface LifestyleBookingTicket {
  programTicketCategoryId: number
  quantity: number
  participants: LifestyleBookingParticipant[]
}

export interface LifestyleBookingDetail {
  bookingId: string
  programId: number
  programName: string
  visitDate: string
  tickets: LifestyleBookingTicket[]
  totalAmount: number
  status: string
  createdAt: string
  expiresAt: string
}

// ============================================
// Request Types
// ============================================

export interface LifestyleCreateBookingRequest {
  programId: number
  visitDate: string // YYYY-MM-DD
  tickets: LifestyleBookingTicket[]
}

export interface LifestyleCheckBookingStatusParams {
  bookingId: string
}

// ============================================
// Response Types
// ============================================

export type LifestyleCreateBookingResponse = BaseResponse<LifestyleBookingDetail>

export type LifestyleCheckBookingStatusResponse = BaseResponse<LifestyleBookingDetail>

export type LifestyleGetBookingDetailResponse = BaseResponse<LifestyleBookingDetail>
