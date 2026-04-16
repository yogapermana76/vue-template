/**
 * Point Service
 * Handles point/coin related API calls (requires auth)
 */

import { http } from './http'
import { PointEndpoint } from './endpoints'
import type {
  PointSummaryResponse,
  PointHistoryResponse,
  PointDetailResponse,
  PointHistoryParams,
  PointDetailParams,
} from '@/types'

export const pointService = {
  /**
   * Get point summary (balance and expiry)
   */
  async summary(): Promise<PointSummaryResponse> {
    const { data } = await http.get<PointSummaryResponse>(PointEndpoint.SUMMARY)
    return data
  },

  /**
   * Get point history with pagination
   */
  async history(params?: PointHistoryParams): Promise<PointHistoryResponse> {
    const { data } = await http.get<PointHistoryResponse>(PointEndpoint.HISTORY, { params })
    return data
  },

  /**
   * Get point transaction detail
   */
  async detail(params: PointDetailParams): Promise<PointDetailResponse> {
    const { data } = await http.get<PointDetailResponse>(PointEndpoint.DETAIL, { params })
    return data
  },
}
