/**
 * Winner Service
 * Handles lottery/reward winner API calls (requires auth)
 */

import { http, publicHttp } from './http'
import { WinnerEndpoint } from './endpoints'
import type {
  WinnersResponse,
  WinnerCategoryResponse,
  WinnerTncListResponse,
  WinnersParams,
  WinnerCategoryParams,
  WinnerTncParams,
} from '@/types'

export const winnerService = {
  /**
   * Get winners list with pagination
   */
  async list(params?: WinnersParams): Promise<WinnersResponse> {
    const { data } = await http.get<WinnersResponse>(WinnerEndpoint.LIST, { params })
    return data
  },

  /**
   * Get winner categories
   */
  async categories(params?: WinnerCategoryParams): Promise<WinnerCategoryResponse> {
    const { data } = await publicHttp.get<WinnerCategoryResponse>(WinnerEndpoint.CATEGORY, {
      params,
    })
    return data
  },

  /**
   * Get winner terms & conditions
   */
  async tnc(params?: WinnerTncParams): Promise<WinnerTncListResponse> {
    const { data } = await publicHttp.get<WinnerTncListResponse>(WinnerEndpoint.TNC, { params })
    return data
  },
}
