import { ref, computed, onMounted, onUnmounted, toValue, type MaybeRefOrGetter } from 'vue'

export interface UseWindowScrollOptions {
  /**
   * Scroll threshold to trigger state change.
   * - Number: pixels (e.g., 100)
   * - String with 'px': pixels (e.g., '100px')
   * - String with '%': percentage of viewport height (e.g., '50%')
   * @default 50
   */
  threshold?: MaybeRefOrGetter<number | string>
}

/**
 * Parse threshold value to pixels
 */
const parseThreshold = (value: number | string): number => {
  if (typeof value === 'number') return value

  const trimmed = value.trim()

  if (trimmed.endsWith('%')) {
    const percent = parseFloat(trimmed)
    return (percent / 100) * window.innerHeight
  }

  if (trimmed.endsWith('px')) {
    return parseFloat(trimmed)
  }

  return parseFloat(trimmed) || 50
}

/**
 * Composable for tracking window scroll position
 *
 * @example
 * ```ts
 * const { isScrolled } = useWindowScroll()
 * // with pixel threshold
 * const { isScrolled } = useWindowScroll({ threshold: 100 })
 * // with percentage threshold (50% of viewport height)
 * const { isScrolled } = useWindowScroll({ threshold: '50%' })
 * ```
 */
export const useWindowScroll = (options: UseWindowScrollOptions = {}) => {
  const { threshold = 50 } = options

  const isScrolled = ref(false)
  const scrollY = ref(0)

  const thresholdPx = computed(() => parseThreshold(toValue(threshold)))

  const handleScroll = () => {
    scrollY.value = window.scrollY
    isScrolled.value = window.scrollY > thresholdPx.value
  }

  onMounted(() => {
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
