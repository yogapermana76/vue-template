import { defineStore } from 'pinia'
import { computed, watchEffect } from 'vue'
import { useDark, useMediaQuery, useStorage } from '@vueuse/core'
import { UI_STORAGE_KEYS } from '@/utils'
import { config } from '@/config'

type ThemeMode = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  // Configuration: Get from config file
  const DISABLE_DARK_MODE = config.ui.disableDarkMode

  // VueUse useDark handles storage + DOM automatically
  const isDark = useDark({
    storageKey: UI_STORAGE_KEYS.THEME_PREFERENCE,
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light',
  })

  // Force light mode if DISABLE_DARK_MODE is enabled
  if (DISABLE_DARK_MODE) {
    isDark.value = false
  }

  // Use localStorage for follow system preference (disabled when DISABLE_DARK_MODE is true)
  const followSystem = useStorage(UI_STORAGE_KEYS.THEME_FOLLOW_SYSTEM, !DISABLE_DARK_MODE)

  const systemIsDark = useMediaQuery('(prefers-color-scheme: dark)')

  // Auto-apply system preference when following system (only if dark mode is not disabled)
  watchEffect(() => {
    if (DISABLE_DARK_MODE) {
      isDark.value = false
    } else if (followSystem.value) {
      isDark.value = systemIsDark.value
    }
  })

  // Theme preference for UI display
  const theme = computed<ThemeMode>(() => {
    if (DISABLE_DARK_MODE) return 'light'
    if (followSystem.value) return 'system'
    return isDark.value ? 'dark' : 'light'
  })

  const setTheme = (newTheme: ThemeMode) => {
    if (DISABLE_DARK_MODE) {
      // When dark mode is disabled, always stay in light mode
      isDark.value = false
      followSystem.value = false
      return
    }

    if (newTheme === 'system') {
      followSystem.value = true
    } else {
      followSystem.value = false
      isDark.value = newTheme === 'dark'
    }
  }

  const toggleDark = () => {
    if (DISABLE_DARK_MODE) {
      // When dark mode is disabled, prevent toggling
      return
    }

    followSystem.value = false
    isDark.value = !isDark.value
  }

  return {
    theme,
    setTheme,
    isDark,
    toggleDark,
  }
})
