/**
 * Lifestyle Auth Service
 * Handles authentication-related API calls for Lifestyle
 */

import { http, createHttpClient } from '../http'
import { LifestyleAuthEndpoint } from './endpoints'
import { config } from '@/config'
import type {
  LifestyleLoginBasicRequest,
  LifestyleLoginBasicResponse,
  LifestyleUserProfileResponse,
  LifestyleValidateSecurityCodeRequest,
  LifestyleValidateSecurityCodeResponse,
  LifestyleSemiLoginRequest,
  LifestyleSemiLoginResponse,
} from '@/types/services/lifestyle'

export const lifestyleAuthService = {
  /**
   * Login with email and password
   */
  async loginBasic(request: LifestyleLoginBasicRequest): Promise<LifestyleLoginBasicResponse> {
    const noAuthClient = createHttpClient(config.api.url.base, 'none')
    const { data } = await noAuthClient.post<LifestyleLoginBasicResponse>(
      LifestyleAuthEndpoint.LOGIN_BASIC,
      request,
    )
    return data
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<LifestyleUserProfileResponse> {
    const { data } = await http.get<LifestyleUserProfileResponse>(LifestyleAuthEndpoint.ME)
    return data
  },

  /**
   * Validate security code
   */
  async validateSecurityCode(
    request: LifestyleValidateSecurityCodeRequest,
  ): Promise<LifestyleValidateSecurityCodeResponse> {
    const { data } = await http.post<LifestyleValidateSecurityCodeResponse>(
      LifestyleAuthEndpoint.VALIDATE_SECURITY_CODE,
      request,
    )
    return data
  },

  /**
   * Semi login with refresh token
   */
  async semiLogin(request: LifestyleSemiLoginRequest): Promise<LifestyleSemiLoginResponse> {
    const { data } = await http.post<LifestyleSemiLoginResponse>(
      LifestyleAuthEndpoint.SEMI_LOGIN,
      request,
    )
    return data
  },
}
