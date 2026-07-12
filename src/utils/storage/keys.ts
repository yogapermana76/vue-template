/**
 * Authentication storage keys. Session-scoped (per-tab) so closing the
 * tab logs the user out.
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  ROLE: 'role',
  PERMISSION: 'permission',
  /** Last program the user picked in any switcher. */
  LAST_PROGRAM_ID: 'last_program_id',
} as const

/** UI preferences (localStorage; survives tab close). */
export const UI_STORAGE_KEYS = {
  THEME_PREFERENCE: 'theme-preference',
  THEME_FOLLOW_SYSTEM: 'theme-follow-system',
} as const
