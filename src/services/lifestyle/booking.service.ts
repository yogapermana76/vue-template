/**
 * Lifestyle Booking Service
 * Handles booking-related API calls for Lifestyle
 */

import { http, type HttpConfig } from '../http'
import { LifestyleBookingEndpoint } from './endpoints'
import type {
  LifestyleCreateBookingRequest,
  LifestyleCreateBookingResponse,
  LifestyleCheckBookingStatusParams,
  LifestyleCheckBookingStatusResponse,
  LifestyleGetBookingDetailResponse,
} from '@/types/services/lifestyle'

export const lifestyleBookingService = {
  /**
   * Create a new booking
   */
  async create(
    request: LifestyleCreateBookingRequest,
    options?: Pick<HttpConfig, 'showErrorToast'>,
  ): Promise<LifestyleCreateBookingResponse> {
    const config: HttpConfig = {
      showErrorToast: options?.showErrorToast ?? true,
    }
    const { data } = await http.post<LifestyleCreateBookingResponse>(
      LifestyleBookingEndpoint.CREATE,
      request,
      config,
    )
    return data
  },

  /**
   * Check booking status
   */
  async checkStatus(
    params: LifestyleCheckBookingStatusParams,
  ): Promise<LifestyleCheckBookingStatusResponse> {
    const { data } = await http.get<LifestyleCheckBookingStatusResponse>(
      LifestyleBookingEndpoint.STATUS,
      { params },
    )
    return data
  },

  /**
   * Get booking detail
   */
  async getDetail(bookingId: string): Promise<LifestyleGetBookingDetailResponse> {
    const { data } = await http.get<LifestyleGetBookingDetailResponse>(
      LifestyleBookingEndpoint.DETAIL,
      { params: { bookingId } },
    )
    return data
  },
}
