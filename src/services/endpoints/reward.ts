/**
 * Reward API Endpoints (requires auth)
 */
export const RewardEndpoint = {
  REWARD: '/v1/reward',
  REDEEMABLE: '/v1/reward/redeemable',
  REDEEMABLE_DETAIL: '/v1/reward/redeemable/gift-instantly/detail',
  GIFT_INSTANTLY: '/v1/reward/redeemable/gift-instantly',
  GIFT_INSTANTLY_DETAIL: '/v1/user/reward/gift-instantly/detail',
  USER_GIFT_INSTANTLY: '/v1/user/reward/gift-instantly',
  EXCHANGE: '/v1/reward/exchange',
  LAST_ADDRESS: '/v1/reward/last-address',
  CATEGORY: '/v1/reward/categories',
  EXCHANGE_POINT_DETAIL: '/v1/user/reward/exchange-point/detail',
  VERIFY_INFO: '/v1/user/reward/verify/info',
} as const
