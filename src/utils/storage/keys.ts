/**
 * Storage Keys
 * Centralized storage key definitions for the Loket module + UI prefs.
 */

/**
 * Loket module authentication storage keys.
 * All Loket auth artefacts live in sessionStorage (per-tab), so a browser
 * refresh keeps the ranger logged in but closing the tab logs them out.
 */
export const LOKET_STORAGE_KEYS = {
  ACCESS_TOKEN: 'loket_access_token',
  REFRESH_TOKEN: 'loket_refresh_token',
  USER: 'loket_user',
  ROLE: 'loket_role',
  /** Last program the user picked in any switcher — persisted so the scan flow (and other program-scoped pages) can auto-select it. */
  LAST_PROGRAM_ID: 'loket_last_program_id',
} as const

/**
 * UI preferences storage keys (localStorage; survives tab close).
 */
export const UI_STORAGE_KEYS = {
  THEME_PREFERENCE: 'theme-preference',
  THEME_FOLLOW_SYSTEM: 'theme-follow-system',
} as const
