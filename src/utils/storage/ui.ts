/**
 * UI Preferences Storage Utility
 * Specialized helpers for UI-related preferences
 */

import { UI_STORAGE_KEYS } from './keys'

/**
 * UI preferences storage utility
 * Handles theme preferences and other UI-related settings
 *
 * @example
 * ```ts
 * // Set theme preference
 * uiStorage.setThemePreference('dark')
 *
 * // Get theme preference
 * const theme = uiStorage.getThemePreference() // Type: string | null
 *
 * // Set follow system theme
 * uiStorage.setFollowSystemTheme(true)
 *
 * // Get follow system theme
 * const followSystem = uiStorage.getFollowSystemTheme() // Type: boolean | null
 * ```
 */
export const uiStorage = {
  // ============================================
  // Theme Preferences
  // ============================================

  /**
   * Set theme preference (e.g., 'light', 'dark')
   */
  setThemePreference(val: string): void {
    localStorage.setItem(UI_STORAGE_KEYS.THEME_PREFERENCE, val)
  },

  /**
   * Get theme preference
   */
  getThemePreference(): string | null {
    return localStorage.getItem(UI_STORAGE_KEYS.THEME_PREFERENCE)
  },

  /**
   * Remove theme preference
   */
  removeThemePreference(): void {
    localStorage.removeItem(UI_STORAGE_KEYS.THEME_PREFERENCE)
  },

  /**
   * Set whether theme should follow system preference
   */
  setFollowSystemTheme(val: boolean): void {
    localStorage.setItem(UI_STORAGE_KEYS.THEME_FOLLOW_SYSTEM, JSON.stringify(val))
  },

  /**
   * Get whether theme should follow system preference
   */
  getFollowSystemTheme(): boolean | null {
    const item = localStorage.getItem(UI_STORAGE_KEYS.THEME_FOLLOW_SYSTEM)
    if (!item) return null
    try {
      return JSON.parse(item) as boolean
    } catch {
      return null
    }
  },

  /**
   * Remove follow system theme setting
   */
  removeFollowSystemTheme(): void {
    localStorage.removeItem(UI_STORAGE_KEYS.THEME_FOLLOW_SYSTEM)
  },

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Clear all UI preferences
   */
  clearPreferences(): void {
    localStorage.removeItem(UI_STORAGE_KEYS.THEME_PREFERENCE)
    localStorage.removeItem(UI_STORAGE_KEYS.THEME_FOLLOW_SYSTEM)
  },
}
