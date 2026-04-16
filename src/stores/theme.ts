import { defineStore } from 'pinia'
import { computed, watchEffect } from 'vue'
import { useDark, useMediaQuery, useStorage } from '@vueuse/core'
import { UI_STORAGE_KEYS } from '@/utils'

type ThemeMode = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  // VueUse useDark handles storage + DOM automatically
  const isDark = useDark({
    storageKey: UI_STORAGE_KEYS.THEME_PREFERENCE,
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light',
  })

  // Use localStorage for follow system preference
  const followSystem = useStorage(UI_STORAGE_KEYS.THEME_FOLLOW_SYSTEM, true)

  const systemIsDark = useMediaQuery('(prefers-color-scheme: dark)')

  // Auto-apply system preference when following system
  watchEffect(() => {
    if (followSystem.value) {
      isDark.value = systemIsDark.value
    }
  })

  // Theme preference for UI display
  const theme = computed<ThemeMode>(() => {
    if (followSystem.value) return 'system'
    return isDark.value ? 'dark' : 'light'
  })

  const setTheme = (newTheme: ThemeMode) => {
    if (newTheme === 'system') {
      followSystem.value = true
    } else {
      followSystem.value = false
      isDark.value = newTheme === 'dark'
    }
  }

  const toggleDark = () => {
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
