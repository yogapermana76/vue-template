import { nextTick, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'

export interface UseAnimatedTabIndicatorOptions {
  containerRef: Ref<HTMLElement | null>
  tabRefs: Ref<HTMLElement[]>
  activeIndex: Ref<number>
  /** Auto-scroll the active tab into view on change. Defaults to true. */
  autoScroll?: boolean
}

export interface IndicatorRect {
  left: number
  width: number
}

// Tracks the offset/width of the active tab so a floating indicator can glide
// between tabs. Also handles ResizeObserver + window resize + auto-scroll.
export function useAnimatedTabIndicator(options: UseAnimatedTabIndicatorOptions) {
  const { containerRef, tabRefs, activeIndex, autoScroll = true } = options
  const indicator = ref<IndicatorRect>({ left: 0, width: 0 })
  let resizeObserver: ResizeObserver | null = null

  const update = () => {
    const el = tabRefs.value[activeIndex.value]
    if (!el) return
    indicator.value = { left: el.offsetLeft, width: el.offsetWidth }
  }

  const scrollIntoView = () => {
    const container = containerRef.value
    const el = tabRefs.value[activeIndex.value]
    if (!container || !el) return
    const target = el.offsetLeft - (container.offsetWidth - el.offsetWidth) / 2
    container.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }

  watch(activeIndex, () =>
    nextTick(() => {
      update()
      if (autoScroll) scrollIntoView()
    }),
  )

  onMounted(() => {
    nextTick(update)
    if (containerRef.value) {
      resizeObserver = new ResizeObserver(update)
      resizeObserver.observe(containerRef.value)
      tabRefs.value.forEach(el => el && resizeObserver?.observe(el))
    }
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
    window.removeEventListener('resize', update)
  })

  return { indicator, update }
}
