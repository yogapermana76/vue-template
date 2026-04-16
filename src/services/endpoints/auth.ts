/**
 * Auth API Endpoints
 */
export const AuthEndpoint = {
  SYNC_ACCOUNT: '/v2/ext/plnm/sync-account', // Token exchange endpoint
  LOGIN_BASIC: '/login-basic', // Basic login (email/password)
  ME: '/me', // Get user profile
} as const
