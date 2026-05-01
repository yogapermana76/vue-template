import { computed, type CSSProperties } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { config } from '@/config'

// Desktop breakpoint (standard desktop/laptop screens)
// 1280px ensures iPad Pro (1024px) gets full width
const DESKTOP_BREAKPOINT = 1280

/**
 * Composable for responsive max-width behavior.
 * Only applies maxWidth on desktop viewports (>= 1280px).
 * Mobile, tablet, and iPad Pro devices get full width.
 */
export function useResponsiveMaxWidth() {
  // Check if viewport is desktop (>= 1280px)
  // Mobile: < 768px, Tablet: 768px - 1023px, iPad Pro: 1024px - 1279px, Desktop: >= 1280px
  const isDesktop = useMediaQuery(`(min-width: ${DESKTOP_BREAKPOINT}px)`)

  // Computed style that only includes maxWidth on desktop
  const responsiveMaxWidthStyle = computed<CSSProperties | undefined>(() => {
    if (!isDesktop.value) return undefined
    return { maxWidth: `${config.ui.maxWidth}px` }
  })

  // Just the maxWidth value for desktop, undefined for mobile/tablet
  const responsiveMaxWidth = computed(() => {
    return isDesktop.value ? `${config.ui.maxWidth}px` : undefined
  })

  // Number value for components that accept number props
  const responsiveMaxWidthNumber = computed(() => {
    return isDesktop.value ? config.ui.maxWidth : undefined
  })

  return {
    isDesktop,
    responsiveMaxWidthStyle,
    responsiveMaxWidth,
    responsiveMaxWidthNumber,
  }
}
