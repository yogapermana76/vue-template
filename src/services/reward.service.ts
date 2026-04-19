/**
 * Reward Service
 * Handles reward-related API calls (requires auth)
 */

import { http, type HttpConfig } from './http'
import { RewardEndpoint } from './endpoints'
import type {
  RewardGiftInstantlyResponse,
  RewardRedeemableResponse,
  RewardDetailResponse,
  RewardCategoryResponse,
  UserGiftInstantlyResponse,
  UserGiftInstantlyDetailResponse,
  LastAddressResponse,
  ExchangeResponse,
  ExchangePointDetailResponse,
  VerifyInfoResponse,
  RewardPagesParams,
  RewardDetailParams,
  UserGiftInstantlyParams,
  UserGiftInstantlyDetailParams,
  ExchangeRequest,
  ExchangePointDetailParams,
} from '@/types'

export const rewardService = {
  /**
   * Get available gift instantly rewards
   */
  async giftInstantly(params?: RewardPagesParams): Promise<RewardGiftInstantlyResponse> {
    const { data } = await http.get<RewardGiftInstantlyResponse>(RewardEndpoint.GIFT_INSTANTLY, {
      params,
    })
    return data
  },

  /**
   * Get redeemable rewards
   */
  async redeemable(params?: RewardPagesParams): Promise<RewardRedeemableResponse> {
    const { data } = await http.get<RewardRedeemableResponse>(RewardEndpoint.REDEEMABLE, { params })
    return data
  },

  /**
   * Get redeemable reward detail
   */
  async redeemableDetail(params: RewardDetailParams): Promise<RewardDetailResponse> {
    const { data } = await http.get<RewardDetailResponse>(RewardEndpoint.REDEEMABLE_DETAIL, {
      params,
    })
    return data
  },

  /**
   * Get gift instantly detail (item detail)
   */
  async giftInstantlyDetail(params: RewardDetailParams): Promise<RewardDetailResponse> {
    const { data } = await http.get<RewardDetailResponse>(RewardEndpoint.GIFT_INSTANTLY_DETAIL, {
      params,
    })
    return data
  },

  /**
   * Get user's gift instantly rewards (claimed rewards)
   */
  async userGiftInstantly(params?: UserGiftInstantlyParams): Promise<UserGiftInstantlyResponse> {
    const { data } = await http.get<UserGiftInstantlyResponse>(RewardEndpoint.USER_GIFT_INSTANTLY, {
      params,
    })
    return data
  },

  /**
   * Get user's gift instantly detail
   */
  async userGiftInstantlyDetail(
    params: UserGiftInstantlyDetailParams,
  ): Promise<UserGiftInstantlyDetailResponse> {
    const { data } = await http.get<UserGiftInstantlyDetailResponse>(
      RewardEndpoint.GIFT_INSTANTLY_DETAIL,
      { params },
    )
    return data
  },

  /**
   * Exchange points for reward
   */
  async exchange(
    request: ExchangeRequest,
    options?: Pick<HttpConfig, 'showErrorToast'>,
  ): Promise<ExchangeResponse> {
    const config: HttpConfig = {
      showErrorToast: options?.showErrorToast ?? true,
    }
    const { data } = await http.post<ExchangeResponse>(RewardEndpoint.EXCHANGE, request, config)
    return data
  },

  /**
   * Get last used address (for prefilling forms)
   */
  async lastAddress(): Promise<LastAddressResponse> {
    const { data } = await http.get<LastAddressResponse>(RewardEndpoint.LAST_ADDRESS)
    return data
  },

  /**
   * Get reward categories
   */
  async categories(): Promise<RewardCategoryResponse> {
    const { data } = await http.get<RewardCategoryResponse>(RewardEndpoint.CATEGORY)
    return data
  },

  /**
   * Get exchange point detail
   */
  async exchangePointDetail(
    params: ExchangePointDetailParams,
  ): Promise<ExchangePointDetailResponse> {
    const { data } = await http.get<ExchangePointDetailResponse>(
      RewardEndpoint.EXCHANGE_POINT_DETAIL,
      { params },
    )
    return data
  },

  /**
   * Get verify info
   */
  async verifyInfo(): Promise<VerifyInfoResponse> {
    const config: HttpConfig = {
      showErrorToast: false,
    }
    const { data } = await http.get<VerifyInfoResponse>(RewardEndpoint.VERIFY_INFO, config)
    return data
  },
}
