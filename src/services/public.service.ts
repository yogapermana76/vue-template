/**
 * Public Service - Handles public API calls (no auth required)
 */

import { publicHttp } from './http'
import { PublicEndpoint } from './endpoints'
import type { BaseResponse } from '@/types'

interface PublicParams {
  page?: number
  size?: number
  [key: string]: unknown
}

export const publicService = {
  async fyi(params?: PublicParams): Promise<BaseResponse> {
    const { data } = await publicHttp.get<BaseResponse>(PublicEndpoint.FYI, { params })
    return data
  },

  async faq(params?: PublicParams): Promise<BaseResponse> {
    const { data } = await publicHttp.get<BaseResponse>(PublicEndpoint.FAQ, { params })
    return data
  },

  async category(params?: PublicParams): Promise<BaseResponse> {
    const { data } = await publicHttp.get<BaseResponse>(PublicEndpoint.CATEGORY_WINNER, {
      params,
    })
    return data
  },

  async winnerTnc(params?: PublicParams): Promise<BaseResponse> {
    const { data } = await publicHttp.get<BaseResponse>(PublicEndpoint.WINNER_TNC, { params })
    return data
  },
}
