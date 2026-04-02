import { ref, computed } from 'vue'

/**
 * Composable for managing scrollable header with transparent-to-solid background effect
 *
 * Usage:
 * ```typescript
 * const { scrollableRef, isHeaderScrolled, headerClass, handleScroll } = useScrollableHeader()
 * ```
 *
 * In template:
 * ```vue
 * <Header :class="headerClass" positioning="sticky" />
 * <div ref="scrollableRef" @scroll="handleScroll">...</div>
 * ```
 */
export const useScrollableHeader = () => {
  const scrollableRef = ref<HTMLElement | null>(null)
  const isHeaderScrolled = ref(false)

  /**
   * Handle scroll event to detect when user scrolls
   */
  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement
    isHeaderScrolled.value = target.scrollTop > 0
  }

  /**
   * Dynamic header classes based on scroll state
   * - Transparent when no scroll
   * - Solid background when scrolled
   */
  const headerClass = computed(() => ({
    '!bg-transparent': !isHeaderScrolled.value,
    '!bg-background/95 backdrop-blur supports-backdrop-filter:!bg-background/60':
      isHeaderScrolled.value,
  }))

  return {
    scrollableRef,
    isHeaderScrolled,
    headerClass,
    handleScroll,
  }
}
