import { computed } from 'vue'
import { config } from '@/config'
import { isNativeApp } from '@/utils/webview-detection'

/**
 * Composable for safe area padding.
 * Provides bottom padding when app is embedded in native mobile app webview.
 *
 * Automatically detects if running in native app webview or can be manually configured via config.
 *
 * Use this for:
 * - Fixed/sticky bottom elements (Footer, BottomSheet, etc.)
 * - Main content containers that need bottom spacing
 * - Any element that might be covered by native bottom navigation
 */
export function useSafeArea() {
  /**
   * Whether app is running in native app mode with bottom navigation
   * - If config.ui.mode is 'auto', auto-detect using user agent
   * - Otherwise, use the configured mode
   */
  const isWebview = computed(() => {
    if (config.ui.mode === 'auto') {
      return isNativeApp()
    }
    return config.ui.mode === 'native'
  })

  /**
   * Safe area bottom value in pixels
   */
  const safeAreaBottom = computed(() => {
    return isWebview.value ? config.ui.safeAreaBottom : 0
  })

  /**
   * Safe area bottom as CSS string (e.g., "80px")
   */
  const safeAreaBottomPx = computed(() => {
    return `${safeAreaBottom.value}px`
  })

  /**
   * CSS style object with paddingBottom
   */
  const safeAreaBottomStyle = computed(() => {
    if (!isWebview.value || safeAreaBottom.value === 0) return undefined
    return { paddingBottom: safeAreaBottomPx.value }
  })

  /**
   * CSS style object with bottom positioning
   * Use for fixed/sticky elements
   */
  const safeAreaBottomPosition = computed(() => {
    if (!isWebview.value || safeAreaBottom.value === 0) return undefined
    return { bottom: safeAreaBottomPx.value }
  })

  /**
   * Tailwind class for paddingBottom
   * Note: This returns inline style since Tailwind doesn't support dynamic values
   */
  const safeAreaBottomClass = computed(() => {
    return isWebview.value && safeAreaBottom.value > 0 ? `pb-[${safeAreaBottom.value}px]` : ''
  })

  return {
    isWebview,
    safeAreaBottom,
    safeAreaBottomPx,
    safeAreaBottomStyle,
    safeAreaBottomPosition,
    safeAreaBottomClass,
  }
}
