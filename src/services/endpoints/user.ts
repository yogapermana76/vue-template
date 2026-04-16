/**
 * User API Endpoints (requires auth)
 */
export const UserEndpoint = {
  // Point endpoints
  POINT_SUMMARY: '/v1/user/point/summary',
  POINT_HISTORY: '/v1/user/point/history',
  POINT_DETAIL: '/v1/user/point/detail',

  // Lottery endpoints
  LOTTERY_PROMO: '/v1/user/lottery/promo',

  // Voucher endpoints
  VOUCHER_PAGES: '/v1/user/voucher/pages',

  // Reward endpoints
  REWARD_LOTTERY: '/v1/user/reward/lottery',
  REWARD_GIFT_INSTANTLY: '/v1/user/reward/gift-instantly/pages',
  REWARD_WINNERS: '/v1/user/reward/winner',
} as const
