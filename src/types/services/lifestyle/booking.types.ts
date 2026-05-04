/**
 * Lifestyle Booking Types
 * Types for booking management in Lifestyle API
 */

import type { BaseResponse } from '@/types/common/base.types'

// ============================================
// Booking Entities
// ============================================

/** Order information form for each visitor */
export interface OrderInformationForm {
  [key: string]: string | undefined
}

/** Ticket order item */
export interface LifestyleBookingTicket {
  /** Ticket type ID */
  ticketId: number
  /** Number of tickets */
  ticketAmount: number
  /** Visitor information forms */
  orderInformationForm: OrderInformationForm[]
}

/** Buyer information */
export interface BuyerInfo {
  /** Buyer full name */
  fullName: string
  /** Buyer email */
  email: string
  /** Buyer phone number */
  phoneNumber: string
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

/**
 * Create booking/order request
 * Maps to the API request body structure
 */
export interface LifestyleCreateBookingRequest {
  /** Program/Event ID */
  programId: number
  /** Program category/ticket type ID */
  programCategoryId: number
  /** Whether booking for self or others */
  isBookOrSelf: boolean
  /** Agreement to terms and conditions */
  isAgreeWithPolicy: boolean
  /** Start visit date (YYYY-MM-DD) */
  startVisitDate: string | null
  /** Start visit time (HH:mm:ss) */
  startVisitTime: string | null
  /** End visit date (YYYY-MM-DD) */
  endVisitDate: string | null
  /** End visit time (HH:mm:ss) */
  endVisitTime: string | null
  /** List of tickets being ordered */
  listTicket: LifestyleBookingTicket[]
  /** Buyer information */
  buyerInfo: BuyerInfo
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

// ============================================
// Ticket Availability Types
// ============================================

/** Price breakdown for a ticket */
export interface TicketPriceDetail {
  /** Base price before taxes/fees */
  basePrice: number
  /** Partnership cost */
  partnershipCost: number
  /** Listing price */
  listingPrice: number
  /** Platform service cost */
  platformCost: number
  /** Entertainment tax */
  entertainmentTax: number
  /** PPN tax (VAT) */
  ppnTax: number
  /** Discount value */
  discountValue: number
  /** Discount type (percentage, fixed, etc) */
  discountCostType: string | null
  /** Discount percentage */
  discount: number
  /** Final price including all taxes and fees */
  finalPrice: number
}

/** Available ticket information */
export interface AvailableTicket {
  /** Ticket ID */
  ticketId: number
  /** Ticket name (e.g., "Adult", "Child", "VIP") */
  ticketName: string
  /** Program ticket category ID */
  programTicketCategoryId: number
  /** Start visit date */
  startVisitDate: string
  /** Start visit time */
  startVisitTime: string
  /** End visit date */
  endVisitDate: string
  /** End visit time */
  endVisitTime: string
  /** Price details */
  priceDetail: TicketPriceDetail
  /** Total quota for this ticket type */
  quota: number
  /** Number of tickets already used */
  quotaUsed: number
  /** Remaining available tickets */
  remainingQuota: number
}

export type LifestyleGetAvailableTicketsResponse = BaseResponse<AvailableTicket[]>

// ============================================
// Program Detail Types
// ============================================

export interface ProgramContact {
  name: string
  type: string
  value: string
  sortOrder: number
}

export interface ProgramImage {
  pathUrl: string
  pathDownload: string
}

export interface ProgramSchedule {
  dayName: string
  dayNum: number
  startTime: string | null
  endTime: string | null
  active: boolean
  lastTicketRedemptionTime: string | null
}

export interface ProgramDetailData {
  programId: number
  programName: string
  programScheduleCategory: 'DAILY' | 'DATE_RANGE'
  programScheduleCategoryFlag: 'DAILY' | 'DATE_RANGE'
  contact: ProgramContact[]
  facilities: unknown[]
  infoSection: unknown | null
  termsAndConditions: string
  timezone: string
  description: string
  programAttendanceMode: string
  programCategory: string
  title: string
  address: string
  mapsUrl: string
  imagesUrl: ProgramImage[]
  // For DAILY programs
  schedules?: ProgramSchedule[]
  // For DATE_RANGE programs
  startDatetime?: string
  endDatetime?: string
  saleTicketStartDatetime?: string
  saleTicketEndDatetime?: string
}

export type ProgramDetailResponse = BaseResponse<ProgramDetailData>

// ============================================
// Visit Date Types
// ============================================

export interface VisitDateDataDaily {
  visitDate: {
    saleStartDatetime: string
  }
  schedules: ProgramSchedule[]
  holidays: unknown[]
}

export interface VisitDateDataDateRange {
  visitDates: string[]
}

export type VisitDateResponse = BaseResponse<VisitDateDataDaily | VisitDateDataDateRange>

// ============================================
// Ticket Category Types
// ============================================

export interface TicketInformation {
  description: string
  benefitTickets: string[]
  validTicketDate: number | null
  listEffectiveDay: number[] | null
  ticketRedemption: string
  listEffectiveDate: unknown[] | null
  termsAndConditions: string
  additionalInformation: string[]
}

export interface TicketCategory {
  programTicketCategoryId: number
  ticketCategory: string
  information: TicketInformation
  discountValue: number
  discountCostType: string | null
  amountDiscount: number
  beforeDiscountPrice: number
  afterDiscount: number
  finalPrice: number
  basePrice: number
  quotaUsed: number
  remainingQuota: number
  earliestStartSaleDatetime: string
  latestEndSaleDatetime: string | null
}

export type TicketCategoryResponse = BaseResponse<TicketCategory[]>

// ============================================
// Ticket Detail Types
// ============================================

export interface TicketCategoryDetail {
  programTicketCategoryId: number
  programName: string
  ticketCategory: string
  information: TicketInformation
  pathUrl: string
}

export type TicketCategoryDetailResponse = BaseResponse<TicketCategoryDetail>

// ============================================
// Check Condition Types
// ============================================

export interface CheckConditionData {
  totalOwnedTickets: number
  maxTicketRulesTrx: boolean
  maxTicketTrx: number
  maxTicketRulesAccount: boolean
  maxTicketAccount: number
}

export type CheckConditionResponse = BaseResponse<CheckConditionData>

// ============================================
// Category Ticket List Types
// ============================================

export interface CategoryTicket {
  ticketId: number
  ticketName: string
  programTicketCategoryId: number
  startVisitDate: string
  startVisitTime: string
  endVisitDate: string
  endVisitTime: string
  saleStartDatetime: string
  saleEndDatetime: string
  priceDetail: TicketPriceDetail
  quota: number
  quotaUsed: number
  remainingQuota: number
}

export type CategoryTicketListResponse = BaseResponse<CategoryTicket[]>
