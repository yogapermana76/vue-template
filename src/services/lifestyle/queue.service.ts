/**
 * Lifestyle Queue Service
 * Handles queue-related API calls for Lifestyle
 */

import { http, type HttpConfig } from '../http'
import { LifestyleQueueEndpoint } from './endpoints'
import type {
  LifestyleJoinQueueRequest,
  LifestyleJoinQueueResponse,
  LifestyleGetQueueInfoParams,
  LifestyleGetQueueInfoResponse,
  LifestyleGetQueueStatusParams,
  LifestyleGetQueueStatusResponse,
  LifestyleCancelQueueRequest,
  LifestyleCancelQueueResponse,
} from '@/types/services/lifestyle'

export const lifestyleQueueService = {
  /**
   * Join queue
   */
  async join(
    request: LifestyleJoinQueueRequest,
    options?: Pick<HttpConfig, 'showErrorToast'>,
  ): Promise<LifestyleJoinQueueResponse> {
    const config: HttpConfig = {
      showErrorToast: options?.showErrorToast ?? true,
    }
    const { data } = await http.post<LifestyleJoinQueueResponse>(
      LifestyleQueueEndpoint.JOIN,
      request,
      config,
    )
    return data
  },

  /**
   * Get queue info
   */
  async getInfo(params: LifestyleGetQueueInfoParams): Promise<LifestyleGetQueueInfoResponse> {
    const { data } = await http.get<LifestyleGetQueueInfoResponse>(LifestyleQueueEndpoint.INFO, {
      params,
    })
    return data
  },

  /**
   * Get queue status
   */
  async getStatus(params: LifestyleGetQueueStatusParams): Promise<LifestyleGetQueueStatusResponse> {
    const { data } = await http.get<LifestyleGetQueueStatusResponse>(
      LifestyleQueueEndpoint.STATUS,
      { params },
    )
    return data
  },

  /**
   * Cancel queue
   */
  async cancel(
    request: LifestyleCancelQueueRequest,
    options?: Pick<HttpConfig, 'showErrorToast'>,
  ): Promise<LifestyleCancelQueueResponse> {
    const config: HttpConfig = {
      showErrorToast: options?.showErrorToast ?? true,
    }
    const { data } = await http.post<LifestyleCancelQueueResponse>(
      LifestyleQueueEndpoint.CANCEL,
      request,
      config,
    )
    return data
  },
}
