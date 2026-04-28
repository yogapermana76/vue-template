/**
 * Booking Transformer Utilities
 * Transform UI state to API request format and vice versa
 */

import type {
  LifestyleCreateBookingRequest,
  LifestyleBookingTicket,
  BuyerInfo,
  OrderInformationForm,
} from '@/types/services/lifestyle/booking.types'
import type { VisitorInfo } from '@/components/lifestyle/sections/order'

// ============================================================================
// UI to API Transformers
// ============================================================================

/**
 * Transform visitor info to order information form
 */
export function transformVisitorToOrderForm(visitor: VisitorInfo): OrderInformationForm {
  return {
    name: visitor.name,
    nik: visitor.phone, // Assuming NIK maps to phone for now
    // Add other dynamic fields as needed
  }
}

/**
 * Create booking request from UI state
 */
export interface CreateBookingParams {
  programId: number
  programCategoryId: number
  selectedDate: string | null
  selectedTime?: { start: string; end: string } | null
  ticketTypes: Array<{
    ticketId: number
    quantity: number
  }>
  visitors: VisitorInfo[]
  buyer: {
    name: string
    email: string
    phone: string
  }
  isBookForSelf: boolean
  agreedToTerms: boolean
}

/**
 * Transform UI booking params to API request format
 */
export function transformToBookingRequest(
  params: CreateBookingParams,
): LifestyleCreateBookingRequest {
  const {
    programId,
    programCategoryId,
    selectedDate,
    selectedTime,
    ticketTypes,
    visitors,
    buyer,
    isBookForSelf,
    agreedToTerms,
  } = params

  // Group visitors by ticket type if needed
  // For now, we'll distribute visitors across ticket types
  const listTicket: LifestyleBookingTicket[] = ticketTypes
    .filter(ticket => ticket.quantity > 0)
    .map(ticket => {
      // Get visitors for this ticket type (simplified)
      const ticketVisitors = visitors.slice(0, ticket.quantity)

      return {
        ticketId: ticket.ticketId,
        ticketAmount: ticket.quantity,
        orderInformationForm: ticketVisitors.map(transformVisitorToOrderForm),
      }
    })

  return {
    programId,
    programCategoryId,
    isBookOrSelf: isBookForSelf,
    isAgreeWithPolicy: agreedToTerms,
    startVisitDate: selectedDate,
    startVisitTime: selectedTime?.start || null,
    endVisitDate: selectedDate, // Same as start for single-day events
    endVisitTime: selectedTime?.end || null,
    listTicket,
    buyerInfo: {
      fullName: buyer.name,
      email: buyer.email,
      phoneNumber: buyer.phone,
    },
  }
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate booking request before submission
 */
export function validateBookingRequest(request: LifestyleCreateBookingRequest): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Validate program IDs
  if (!request.programId || request.programId <= 0) {
    errors.push('Program ID is required')
  }

  if (!request.programCategoryId || request.programCategoryId <= 0) {
    errors.push('Program category ID is required')
  }

  // Validate policy agreement
  if (!request.isAgreeWithPolicy) {
    errors.push('You must agree to the terms and conditions')
  }

  // Validate tickets
  if (!request.listTicket || request.listTicket.length === 0) {
    errors.push('At least one ticket must be selected')
  }

  // Validate each ticket
  request.listTicket.forEach((ticket, index) => {
    if (ticket.ticketAmount <= 0) {
      errors.push(`Ticket ${index + 1}: Amount must be greater than 0`)
    }

    if (ticket.orderInformationForm.length === 0) {
      errors.push(`Ticket ${index + 1}: At least one visitor information is required`)
    }

    // Validate visitor information
    ticket.orderInformationForm.forEach((form, formIndex) => {
      if (!form.name || form.name.trim() === '') {
        errors.push(`Ticket ${index + 1}, Visitor ${formIndex + 1}: Name is required`)
      }

      if (!form.nik || form.nik.trim() === '') {
        errors.push(`Ticket ${index + 1}, Visitor ${formIndex + 1}: NIK is required`)
      }
    })
  })

  // Validate buyer info
  if (!request.buyerInfo.email || request.buyerInfo.email.trim() === '') {
    errors.push('Buyer email is required')
  }

  if (!request.buyerInfo.phoneNumber || request.buyerInfo.phoneNumber.trim() === '') {
    errors.push('Buyer phone number is required')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
