/**
 * Lifestyle Payment Service
 * Handles payment-related API calls for Lifestyle
 */

import { http, type HttpConfig } from '../http'
import { LifestylePaymentEndpoint } from './endpoints'
import type {
  LifestyleGetPaymentMethodsParams,
  LifestyleGetPaymentMethodsResponse,
  LifestyleCreatePaymentRequest,
  LifestyleCreatePaymentResponse,
  LifestyleCheckPaymentStatusParams,
  LifestyleCheckPaymentStatusResponse,
  LifestyleGetPaymentDetailResponse,
  LifestyleGetPaymentInstructionParams,
  LifestyleGetPaymentInstructionResponse,
  LifestyleCancelPaymentResponse,
} from '@/types/services/lifestyle'

export const lifestylePaymentService = {
  /**
   * Get available payment methods
   */
  async getPaymentMethods(
    params?: LifestyleGetPaymentMethodsParams,
  ): Promise<LifestyleGetPaymentMethodsResponse> {
    const { data } = await http.get<LifestyleGetPaymentMethodsResponse>(
      LifestylePaymentEndpoint.METHODS,
      { params },
    )
    return data
  },

  /**
   * Create a new payment
   */
  async create(
    request: LifestyleCreatePaymentRequest,
    options?: Pick<HttpConfig, 'showErrorToast'>,
  ): Promise<LifestyleCreatePaymentResponse> {
    const config: HttpConfig = {
      showErrorToast: options?.showErrorToast ?? true,
    }
    const { data } = await http.post<LifestyleCreatePaymentResponse>(
      LifestylePaymentEndpoint.CREATE,
      request,
      config,
    )
    return data
  },

  /**
   * Check payment status
   */
  async checkStatus(
    params: LifestyleCheckPaymentStatusParams,
  ): Promise<LifestyleCheckPaymentStatusResponse> {
    const { data } = await http.get<LifestyleCheckPaymentStatusResponse>(
      LifestylePaymentEndpoint.STATUS,
      { params },
    )
    return data
  },

  /**
   * Get payment detail
   */
  async getDetail(paymentId: string): Promise<LifestyleGetPaymentDetailResponse> {
    const { data } = await http.get<LifestyleGetPaymentDetailResponse>(
      LifestylePaymentEndpoint.DETAIL,
      { params: { paymentId } },
    )
    return data
  },

  /**
   * Get payment instruction
   */
  async getInstruction(
    params: LifestyleGetPaymentInstructionParams,
  ): Promise<LifestyleGetPaymentInstructionResponse> {
    const { data } = await http.get<LifestyleGetPaymentInstructionResponse>(
      LifestylePaymentEndpoint.INSTRUCTION,
      { params },
    )
    return data
  },

  /**
   * Cancel payment
   */
  async cancel(
    paymentId: string,
    options?: Pick<HttpConfig, 'showErrorToast'>,
  ): Promise<LifestyleCancelPaymentResponse> {
    const config: HttpConfig = {
      showErrorToast: options?.showErrorToast ?? true,
    }
    const { data } = await http.post<LifestyleCancelPaymentResponse>(
      LifestylePaymentEndpoint.CANCEL,
      { paymentId },
      config,
    )
    return data
  },
}
