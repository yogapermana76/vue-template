/**
 * Lifestyle Ticket Types
 * Types for ticket management (My Ticket) in Lifestyle API
 */

import type { BaseResponse } from '@/types/common/base.types'

// ============================================
// Ticket Entities
// ============================================

export interface LifestyleTicketParticipant {
  name: string
  email?: string
  phone: string
  identityNumber?: string
}

export interface LifestyleTicket {
  ticketId: string
  ticketNumber: string
  orderId: string
  programId: number
  programName: string
  programLocation: string
  ticketCategory: string
  participant: LifestyleTicketParticipant
  visitDate: string
  qrCode: string
  status: string
  isUsed: boolean
  usedAt?: string
  createdAt: string
}

export interface LifestyleETicket {
  ticketId: string
  eTicketUrl: string
  qrCode: string
}

// ============================================
// Request Types
// ============================================

export interface LifestyleGetMyTicketsParams {
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}

export interface LifestyleGetTicketDetailParams {
  ticketId: string
}

export interface LifestyleDownloadETicketParams {
  ticketId: string
}

export interface LifestyleGetTicketByOrderParams {
  orderId: string
}

// ============================================
// Response Types
// ============================================

export type LifestyleGetMyTicketsResponse = BaseResponse<{
  tickets: LifestyleTicket[]
  total: number
}>

export type LifestyleGetTicketDetailResponse = BaseResponse<LifestyleTicket>

export type LifestyleDownloadETicketResponse = BaseResponse<LifestyleETicket>

export type LifestyleGetTicketByOrderResponse = BaseResponse<LifestyleTicket[]>
