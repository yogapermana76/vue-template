/**
 * Authentication Storage Utility
 * Specialized helpers for auth-related data (tokens, user info, session management)
 */

import { AUTH_STORAGE_KEYS } from './keys'

/**
 * Authentication storage utility
 * Specialized helpers for auth-related data (tokens, user info, session management)
 *
 * Handles:
 * - JWT token management (production)
 * - User profile data
 * - Auth query params from PLN Mobile app
 *
 * @example
 * ```ts
 * // Set token
 * authStorage.setToken('jwt-token-here')
 *
 * // Get token
 * const token = authStorage.getToken() // Type: string | null
 *
 * // Set user
 * authStorage.setUser({ id: 1, name: 'John' })
 *
 * // Get user with type
 * interface User { id: number; name: string }
 * const user = authStorage.getUser<User>() // Type: User | null
 *
 * // Clear session
 * authStorage.clearSession()
 * ```
 */
export const authStorage = {
  /**
   * Set JWT token to localStorage
   */
  setToken(val: string): void {
    sessionStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, val)
  },

  /**
   * Get JWT token from sessionStorage
   */
  getToken(): string | null {
    return sessionStorage.getItem(AUTH_STORAGE_KEYS.TOKEN)
  },

  /**
   * Set user object to sessionStorage
   * @param val - User object or null to remove
   */
  setUser(val: object | null): void {
    if (val === null) {
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER)
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(val))
    }
  },

  /**
   * Get user object from sessionStorage
   * @returns Parsed user object or null
   */
  getUser<T = object>(): T | null {
    const user = sessionStorage.getItem(AUTH_STORAGE_KEYS.USER)
    if (!user) return null
    try {
      return JSON.parse(user) as T
    } catch {
      return null
    }
  },

  /**
   * Set auth params from PLN Mobile app
   * @param val - Query params object or null to remove
   */
  setAuthFromApps(val: object | null): void {
    if (val === null) {
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.AUTH_FROM_APPS)
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEYS.AUTH_FROM_APPS, JSON.stringify(val))
    }
  },

  /**
   * Get auth params from PLN Mobile app
   * @returns Parsed auth params or null
   */
  getAuthFromApps<T = object>(): T | null {
    const auth = sessionStorage.getItem(AUTH_STORAGE_KEYS.AUTH_FROM_APPS)
    if (!auth) return null
    try {
      return JSON.parse(auth) as T
    } catch {
      return null
    }
  },

  /**
   * Clear all auth-related data from sessionStorage
   */
  clearSession(): void {
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN)
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER)
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.AUTH_FROM_APPS)
  },
}
