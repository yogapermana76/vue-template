/**
 * User Service - Handles user-related API calls (requires auth)
 */

import { http } from './http'
import { UserEndpoint } from './endpoints'
import type { BaseResponse } from '@/types'

interface UserParams {
  page?: number
  size?: number
  [key: string]: unknown
}

export const userService = {
  async pointSummary(params?: UserParams): Promise<BaseResponse> {
    const { data } = await http.get<BaseResponse>(UserEndpoint.POINT_SUMMARY, { params })
    return data
  },

  async pointHistory(params?: UserParams): Promise<BaseResponse> {
    const { data } = await http.get<BaseResponse>(UserEndpoint.POINT_HISTORY, { params })
    return data
  },

  async pointDetail(params?: UserParams): Promise<BaseResponse> {
    const { data } = await http.get<BaseResponse>(UserEndpoint.POINT_DETAIL, { params })
    return data
  },

  async lotteryPromo(params?: UserParams): Promise<BaseResponse> {
    const { data } = await http.get<BaseResponse>(UserEndpoint.LOTTERY_PROMO, { params })
    return data
  },

  async voucherPages(params?: UserParams): Promise<BaseResponse> {
    const { data } = await http.get<BaseResponse>(UserEndpoint.VOUCHER_PAGES, { params })
    return data
  },

  async rewardLottery(params?: UserParams): Promise<BaseResponse> {
    const { data } = await http.get<BaseResponse>(UserEndpoint.REWARD_LOTTERY, { params })
    return data
  },

  async rewardGiftInstantly(params?: UserParams): Promise<BaseResponse> {
    const { data } = await http.get<BaseResponse>(UserEndpoint.REWARD_GIFT_INSTANTLY, {
      params,
    })
    return data
  },

  async rewardWinners(params?: UserParams): Promise<BaseResponse> {
    const { data } = await http.get<BaseResponse>(UserEndpoint.REWARD_WINNERS, { params })
    return data
  },
}
