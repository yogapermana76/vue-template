/**
 * Lifestyle Check Service
 * Handles validation and health check API calls for Lifestyle
 */

import { http } from '../http'
import { LifestyleCheckEndpoint } from './endpoints'
import type {
  LifestyleHealthCheckResponse,
  LifestyleValidatePromoCodeRequest,
  LifestyleValidatePromoCodeResponse,
  LifestyleValidateUserEligibilityRequest,
  LifestyleValidateUserEligibilityResponse,
  LifestyleSystemStatusResponse,
} from '@/types/services/lifestyle'

export const lifestyleCheckService = {
  /**
   * Health check
   */
  async health(): Promise<LifestyleHealthCheckResponse> {
    const { data } = await http.get<LifestyleHealthCheckResponse>(LifestyleCheckEndpoint.HEALTH)
    return data
  },

  /**
   * Validate promo code
   */
  async validatePromoCode(
    request: LifestyleValidatePromoCodeRequest,
  ): Promise<LifestyleValidatePromoCodeResponse> {
    const { data } = await http.post<LifestyleValidatePromoCodeResponse>(
      LifestyleCheckEndpoint.VALIDATE_PROMO_CODE,
      request,
    )
    return data
  },

  /**
   * Validate user eligibility
   */
  async validateUserEligibility(
    request: LifestyleValidateUserEligibilityRequest,
  ): Promise<LifestyleValidateUserEligibilityResponse> {
    const { data } = await http.post<LifestyleValidateUserEligibilityResponse>(
      LifestyleCheckEndpoint.VALIDATE_USER_ELIGIBILITY,
      request,
    )
    return data
  },

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<LifestyleSystemStatusResponse> {
    const { data } = await http.get<LifestyleSystemStatusResponse>(
      LifestyleCheckEndpoint.SYSTEM_STATUS,
    )
    return data
  },
}
