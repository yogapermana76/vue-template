/**
 * Public API Endpoints (No auth required)
 */
export const PublicEndpoint = {
  // Reward endpoints
  FYI: '/v1/public/reward/fyi',
  FAQ: '/v1/public/reward/faq',
  CATEGORY_WINNER: '/v1/public/reward/periode/winner/list',
  INFO_WINNER: '/v1/public/reward/info/winner/list',
  WINNER_TNC: '/v1/public/reward/winner/tnc',
} as const
