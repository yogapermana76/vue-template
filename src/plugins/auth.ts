/**
 * Auth Initialization Plugin
 * Handles initial auth setup before app mount
 */

import type { LocationQuery } from 'vue-router'
import { useAuthService } from '@/composables/services'
import { saveAuthQueryParams } from '@/utils/auth'
import { authStorage } from '@/utils/storage/auth'

/**
 * Check if token has changed compared to stored token
 */
const hasTokenChanged = (
  storedParams: LocationQuery | null,
  newToken: string | undefined,
): boolean => {
  if (!newToken) return false
  if (!storedParams) return true
  return storedParams.token !== newToken
}

/**
 * Initialize auth from URL params or localStorage
 * Call this before app mount to ensure auth state is ready
 */
export const setupAuth = () => {
  const { restoreSession, authenticate } = useAuthService()

  // Get token from current URL
  const urlParams = new URLSearchParams(window.location.search)
  const newToken = urlParams.get('token') || undefined

  // Get stored params from localStorage
  const storedParams = authStorage.getAuthFromApps<LocationQuery>()
  const tokenChanged = hasTokenChanged(storedParams, newToken)

  // Always restore session from localStorage first (instant)
  restoreSession()

  // If token changed, save new params and authenticate via API (non-blocking)
  if (tokenChanged && newToken) {
    // Build query object from URL params
    const query: LocationQuery = {}
    urlParams.forEach((value, key) => {
      query[key] = value
    })

    saveAuthQueryParams(query)
    authenticate(newToken)
  }
}
