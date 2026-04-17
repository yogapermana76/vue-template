/**
 * HTTP Client
 * Central export for all HTTP-related functionality
 */

import { config } from '@/config'
import { createHttpClient } from './client'

// Pre-configured clients
export const http = createHttpClient(config.api.url.base, 'jwt')
export const publicHttp = createHttpClient(config.api.url.base, 'none')

// Export factory for custom clients
export { createHttpClient } from './client'

// Export utilities
export { refreshTokenWithQueue } from './token-refresh'

// Export types
export type { HttpConfig } from './interceptors'
