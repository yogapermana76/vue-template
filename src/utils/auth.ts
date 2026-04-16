import type { LocationQuery } from 'vue-router'
import { authStorage } from './storage/auth'

/**
 * Strip 'Bearer ' prefix from token
 */
export const normalizeToken = (token: string): string => {
  return token.startsWith('Bearer ') ? token.substring(7) : token
}

/**
 * Save query params to localStorage for token refresh
 */
export const saveAuthQueryParams = (query: LocationQuery): void => {
  if (query.token) {
    authStorage.setAuthFromApps(query)
  }
}
