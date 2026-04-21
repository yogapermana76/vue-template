import { computed, type CSSProperties } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { config } from '@/config'

// Desktop breakpoint (larger than tablet landscape)
const DESKTOP_BREAKPOINT = 1024

/**
 * Composable for responsive max-width behavior.
 * Only applies maxWidth on desktop viewports (>= 1024px).
 * Mobile and tablet devices get full width.
 */
export function useResponsiveMaxWidth() {
  // Check if viewport is desktop (>= 1024px)
  // Mobile: < 768px, Tablet: 768px - 1023px, Desktop: >= 1024px
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
