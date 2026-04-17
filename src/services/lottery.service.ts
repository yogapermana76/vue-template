/**
 * Lottery Service
 * Handles lottery-related API calls (requires auth)
 */

import { http, type HttpConfig } from './http'
import { LotteryEndpoint } from './endpoints'
import type {
  LotteryRedeemablePagesResponse,
  LotteryDetailResponse,
  LotteryPromoResponse,
  UserLotteryListResponse,
  UserLotteryDetailResponse,
  LotteryRedeemResponse,
  LotteryRedeemablePagesParams,
  LotteryDetailParams,
  LotteryPromoParams,
  UserLotteryListParams,
  UserLotteryDetailParams,
  LotteryRedeemRequest,
} from '@/types'

export const lotteryService = {
  /**
   * Get redeemable lottery pages
   */
  async redeemablePages(
    params?: LotteryRedeemablePagesParams,
  ): Promise<LotteryRedeemablePagesResponse> {
    const { data } = await http.get<LotteryRedeemablePagesResponse>(
      LotteryEndpoint.REDEEMABLE_PAGES,
      { params },
    )
    return data
  },

  /**
   * Get lottery detail
   */
  async detail(params: LotteryDetailParams): Promise<LotteryDetailResponse> {
    const { data } = await http.get<LotteryDetailResponse>(LotteryEndpoint.DETAIL, { params })
    return data
  },

  /**
   * Get lottery promo pages (user's eligible lotteries)
   */
  async promo(params?: LotteryPromoParams): Promise<LotteryPromoResponse> {
    const { data } = await http.get<LotteryPromoResponse>(LotteryEndpoint.PROMO, { params })
    return data
  },

  /**
   * Get user lottery list (user's lottery history)
   */
  async userList(params?: UserLotteryListParams): Promise<UserLotteryListResponse> {
    const { data } = await http.get<UserLotteryListResponse>(LotteryEndpoint.USER_LIST, { params })
    return data
  },

  /**
   * Get user lottery detail
   */
  async userDetail(params: UserLotteryDetailParams): Promise<UserLotteryDetailResponse> {
    const { data } = await http.get<UserLotteryDetailResponse>(LotteryEndpoint.USER_DETAIL, {
      params,
    })
    return data
  },

  /**
   * Redeem lottery (exchange points for lottery entry)
   */
  async redeem(
    request: LotteryRedeemRequest,
    options?: Pick<HttpConfig, 'showErrorToast'>,
  ): Promise<LotteryRedeemResponse> {
    const config: HttpConfig = {
      showErrorToast: options?.showErrorToast ?? true,
    }
    const { data } = await http.post<LotteryRedeemResponse>(LotteryEndpoint.REDEEM, request, config)
    return data
  },
}
