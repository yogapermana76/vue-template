/**
 * Storage Keys
 * Centralized storage key definitions for type safety and consistency
 */

/**
 * Authentication-related storage keys
 */
export const AUTH_STORAGE_KEYS = {
  // Production auth (PLN Mobile webview)
  TOKEN: 'token', // JWT token from /v2/ext/plnm/sync-account
  USER: 'user', // User object from auth response
  AUTH_FROM_APPS: '_authFromApps', // Original query params from PLN Mobile
} as const

/**
 * Demo/Development authentication keys
 */
export const DEMO_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token', // Demo auth (used in demo pages only)
} as const

/**
 * UI preferences storage keys
 */
export const UI_STORAGE_KEYS = {
  THEME_PREFERENCE: 'theme-preference',
  THEME_FOLLOW_SYSTEM: 'theme-follow-system',
} as const

/**
 * All storage keys combined (for backward compatibility)
 */
export const STORAGE_KEYS = {
  ...AUTH_STORAGE_KEYS,
  ...DEMO_STORAGE_KEYS,
  ...UI_STORAGE_KEYS,
} as const
