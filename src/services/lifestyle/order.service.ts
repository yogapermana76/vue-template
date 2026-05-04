/**
 * Lifestyle Order Service
 * Handles order-related API calls for Lifestyle
 */

import { http, type HttpConfig } from '../http'
import { LifestyleOrderEndpoint } from './endpoints'
import type {
  LifestyleGetOrderHistoryParams,
  LifestyleGetOrderHistoryResponse,
  LifestyleGetOrderDetailParams,
  LifestyleGetOrderDetailResponse,
  LifestyleGetInvoiceParams,
  LifestyleGetInvoiceResponse,
  LifestyleCancelOrderRequest,
  LifestyleCancelOrderResponse,
  LifestyleDownloadInvoiceResponse,
} from '@/types/services/lifestyle'

export const lifestyleOrderService = {
  /**
   * Get order history
   */
  async getHistory(
    params?: LifestyleGetOrderHistoryParams,
  ): Promise<LifestyleGetOrderHistoryResponse> {
    const { data } = await http.get<LifestyleGetOrderHistoryResponse>(
      LifestyleOrderEndpoint.HISTORY,
      { params },
    )
    return data
  },

  /**
   * Get order detail
   */
  async getDetail(params: LifestyleGetOrderDetailParams): Promise<LifestyleGetOrderDetailResponse> {
    const { data } = await http.get<LifestyleGetOrderDetailResponse>(
      LifestyleOrderEndpoint.DETAIL,
      { params },
    )
    return data
  },

  /**
   * Get invoice
   */
  async getInvoice(params: LifestyleGetInvoiceParams): Promise<LifestyleGetInvoiceResponse> {
    const { data } = await http.get<LifestyleGetInvoiceResponse>(LifestyleOrderEndpoint.INVOICE, {
      params,
    })
    return data
  },

  /**
   * Cancel order
   */
  async cancel(
    request: LifestyleCancelOrderRequest,
    options?: Pick<HttpConfig, 'showErrorToast'>,
  ): Promise<LifestyleCancelOrderResponse> {
    const config: HttpConfig = {
      showErrorToast: options?.showErrorToast ?? true,
    }
    const { data } = await http.post<LifestyleCancelOrderResponse>(
      LifestyleOrderEndpoint.CANCEL,
      request,
      config,
    )
    return data
  },

  /**
   * Download invoice
   */
  async downloadInvoice(orderId: string): Promise<LifestyleDownloadInvoiceResponse> {
    const { data } = await http.get<LifestyleDownloadInvoiceResponse>(
      LifestyleOrderEndpoint.DOWNLOAD_INVOICE,
      { params: { orderId } },
    )
    return data
  },
}
