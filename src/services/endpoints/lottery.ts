/**
 * Lottery API Endpoints (requires auth)
 */
export const LotteryEndpoint = {
  LOTTERY: '/v1/lottery',
  REDEEMABLE_PAGES: '/v1/lottery/redeemable/pages',
  DETAIL: '/v1/lottery/detail',
  REDEEM: '/v1/reward/lottery/redeem',
  PROMO: '/v1/user/reward/lottery/pages',
  USER_LIST: '/v1/user/reward/lottery/list',
  USER_DETAIL: '/v1/user/reward/lottery/detail',
} as const
