/**
 * Storage Module
 * Centralized storage utilities for localStorage management
 *
 * ## Usage:
 * Use specific storage modules for better code organization:
 * - `authStorage` - Production authentication (JWT, user data, session)
 * - `demoStorage` - Demo/development authentication
 * - `uiStorage` - UI preferences (theme, settings)
 *
 * ## Storage Keys:
 * All storage keys are exported from './keys' for type safety
 *
 * @example
 * ```ts
 * import { authStorage, uiStorage } from '@/utils'
 *
 * // Auth operations
 * authStorage.setToken('jwt-token')
 * const user = authStorage.getUser()
 *
 * // UI preferences
 * uiStorage.setThemePreference('dark')
 * const theme = uiStorage.getThemePreference()
 * ```
 */

// Export all storage keys
export { STORAGE_KEYS, AUTH_STORAGE_KEYS, DEMO_STORAGE_KEYS, UI_STORAGE_KEYS } from './keys'

// Export storage modules
export { authStorage } from './auth'
export { demoStorage } from './demo'
export { uiStorage } from './ui'
