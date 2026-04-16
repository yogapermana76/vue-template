/**
 * Demo Authentication Storage Utility
 * Specialized helpers for demo/development authentication
 */

import { DEMO_STORAGE_KEYS } from './keys'

/**
 * Demo authentication storage utility
 * Used only in demo pages for development/testing purposes
 *
 * @example
 * ```ts
 * // Set demo token
 * demoStorage.setAuthToken('demo-token-here')
 *
 * // Get demo token
 * const token = demoStorage.getAuthToken() // Type: string | null
 *
 * // Remove demo token
 * demoStorage.removeAuthToken()
 * ```
 */
export const demoStorage = {
  /**
   * Set demo auth token to localStorage
   */
  setAuthToken(val: string): void {
    localStorage.setItem(DEMO_STORAGE_KEYS.AUTH_TOKEN, val)
  },

  /**
   * Get demo auth token from localStorage
   */
  getAuthToken(): string | null {
    return localStorage.getItem(DEMO_STORAGE_KEYS.AUTH_TOKEN)
  },

  /**
   * Remove demo auth token from localStorage
   */
  removeAuthToken(): void {
    localStorage.removeItem(DEMO_STORAGE_KEYS.AUTH_TOKEN)
  },
}
