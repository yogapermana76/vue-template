import { ref, onMounted, onUnmounted } from 'vue'

export interface UseWindowScrollOptions {
  /**
   * Scroll threshold in pixels to trigger state change
   * @default 50
   */
  threshold?: number
}

/**
 * Composable for tracking window scroll position
 *
 * @example
 * ```ts
 * const { isScrolled } = useWindowScroll()
 * // or with custom threshold
 * const { isScrolled } = useWindowScroll({ threshold: 100 })
 * ```
 */
export const useWindowScroll = (options: UseWindowScrollOptions = {}) => {
  const { threshold = 50 } = options

  const isScrolled = ref(false)
  const scrollY = ref(0)

  const handleScroll = () => {
    scrollY.value = window.scrollY
    isScrolled.value = window.scrollY > threshold
  }

  onMounted(() => {
    // Check initial scroll position
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    isScrolled,
    scrollY,
  }
}
