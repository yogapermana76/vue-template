import { onMounted, onUnmounted, watch, type Ref } from 'vue'
import { setStatusBar, type StatusBarConfig } from '@/utils/native-bridge'
import { useColorMode } from '@vueuse/core'

/**
 * Config resolver type - supports static, reactive, or computed configs
 */
type StatusBarConfigResolver = StatusBarConfig | Ref<StatusBarConfig> | (() => StatusBarConfig)

/**
 * Composable for controlling native status bar appearance
 *
 * Automatically manages status bar style based on page background and theme.
 * Updates on mount and cleans up on unmount.
 *
 * @param config - Static config, Ref, or getter function for reactive updates
 *
 * @example
 * // Static configuration
 * useStatusBar({ style: 'dark', backgroundColor: '#ffffff' })
 *
 * @example
 * // Reactive configuration with computed
 * const mode = useColorMode()
 * useStatusBar(() => ({
 *   style: mode.value === 'dark' ? 'light' : 'dark',
 *   backgroundColor: mode.value === 'dark' ? '#0a0a0a' : '#ffffff'
 * }))
 *
 * @example
 * // Dynamic based on scroll (use useScrollStatusBar instead)
 * const { isScrolled } = useWindowScroll({ threshold: 100 })
 * useScrollStatusBar(isScrolled, 'light', 'dark')
 */
export function useStatusBar(config: StatusBarConfigResolver) {
  // Resolve config value regardless of type
  const resolveConfig = (): StatusBarConfig => {
    if (typeof config === 'function') return config()
    if ('value' in config) return config.value
    return config
  }

  // Apply status bar configuration
  const apply = () => setStatusBar(resolveConfig())

  onMounted(() => {
    // Apply initial state
    apply()

    // Setup reactive watcher if config is dynamic
    if (typeof config === 'function') {
      // Function: watch return value (tracks reactive dependencies automatically)
      watch(config, apply, { deep: true })
    } else if ('value' in config) {
      // Ref: watch the ref value
      watch(() => (config as Ref<StatusBarConfig>).value, apply, { deep: true })
    }
    // Static object: no watch needed
  })

  // Cleanup: restore default on unmount
  onUnmounted(() => {
    setStatusBar({ style: 'default' })
  })

  return {
    /** Manually update status bar */
    setStatusBar,
    /** Reapply current configuration */
    refresh: apply,
  }
}

/**
 * Preset configurations for common use cases
 * Use these to avoid magic strings and ensure consistency
 */
export const statusBarPresets = {
  /** Light page: white background with dark icons */
  light: { style: 'dark', backgroundColor: '#ffffff' } as const,

  /** Dark page: dark background with light icons */
  dark: { style: 'light', backgroundColor: '#0a0a0a' } as const,

  /** Brand primary: navy background with light icons */
  primary: { style: 'light', backgroundColor: '#0f172b' } as const,

  /** Transparent with dark icons (for light backgrounds) */
  transparentLight: { style: 'dark', backgroundColor: 'transparent' } as const,

  /** Transparent with light icons (for dark backgrounds) */
  transparentDark: { style: 'light', backgroundColor: 'transparent' } as const,

  /** Default system style */
  default: { style: 'default' } as const,
} satisfies Record<string, StatusBarConfig>

/**
 * Auto status bar - syncs with color mode (light/dark theme)
 *
 * Automatically switches between:
 * - Light mode: white background with dark icons
 * - Dark mode: dark background with light icons
 *
 * @example
 * // In your page component
 * useAutoStatusBar()
 */
export function useAutoStatusBar() {
  const mode = useColorMode()

  return useStatusBar(() =>
    mode.value === 'dark' ? statusBarPresets.dark : statusBarPresets.light,
  )
}

/**
 * Scroll-based status bar - changes style based on scroll position
 *
 * Common pattern for pages with transparent headers that transition on scroll.
 * Automatically switches status bar icons when scrolling past a threshold.
 *
 * @param scrolled - Reactive boolean indicating scroll state (use with useWindowScroll)
 * @param initialStyle - Icon style when not scrolled (default: 'light' = white icons)
 * @param scrolledStyle - Icon style when scrolled (default: 'dark' = black icons)
 *
 * @example
 * // Typical usage: dark gradient header → white content
 * const { isScrolled } = useWindowScroll({ threshold: 100 })
 * useScrollStatusBar(isScrolled, 'light', 'dark')
 * // Not scrolled: white icons on transparent (for dark gradient)
 * // Scrolled: black icons on white (for white content)
 *
 * @example
 * // Inverted: light header → dark content
 * const { isScrolled } = useWindowScroll({ threshold: 100 })
 * useScrollStatusBar(isScrolled, 'dark', 'light')
 */
export function useScrollStatusBar(
  scrolled: Ref<boolean>,
  initialStyle: StatusBarConfig['style'] = 'light',
  scrolledStyle: StatusBarConfig['style'] = 'dark',
) {
  return useStatusBar(() =>
    scrolled.value
      ? { style: scrolledStyle, backgroundColor: '#ffffff' }
      : { style: initialStyle, backgroundColor: 'transparent' },
  )
}
