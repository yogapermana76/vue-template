// Embla carousel wrapper - handles infinite loops, autoplay, navigation

import { ref, computed } from 'vue'
import EmblaCarousel from 'embla-carousel'
import type { EmblaCarouselType } from 'embla-carousel'

// Configuration options for behavior: alignment, looping, snapping, autoplay
interface UseEmblaCarouselOptions {
  /** Start alignment: start | center | end */
  align?: 'start' | 'center' | 'end'
  /** Text direction: ltr | rtl */
  direction?: 'ltr' | 'rtl'
  /** Enable infinite looping */
  loop?: boolean
  /** Skip intermediate snap points */
  skipSnaps?: boolean
  /** Allow free-form dragging */
  dragFree?: boolean
  /** Auto-play settings */
  autoplay?: {
    enabled: boolean
    delay: number
  }
}

// Initialize Embla with configuration: each call gets its own timer instance
export function useEmblaCarousel(options: UseEmblaCarouselOptions = {}) {
  const containerRef = ref<HTMLElement | null>(null)
  const emblaApi = ref<EmblaCarouselType | undefined>()
  const selectedIndex = ref(0)
  const scrollSnaps = ref<number[]>([])
  const canScrollPrev = ref(false)
  const canScrollNext = ref(true)

  // Instance-level state: Each composable call has its own timer
  // CRITICAL FIX: Moved from module-level to prevent multiple carousels interfering
  let autoplayTimer: ReturnType<typeof setInterval> | null = null

  const defaultOptions = {
    align: 'start' as const,
    direction: 'ltr' as const,
    loop: true,
    skipSnaps: false,
    dragFree: false,
    autoplay: {
      enabled: false,
      delay: 4000,
    },
    ...options,
  }

  // Create carousel: align (start/center/end), loop (true/false), watchResize (always true)
  const init = (): void => {
    if (!containerRef.value) return

    // Embla best practice: watchResize true for responsive layouts, no containScroll
    emblaApi.value = EmblaCarousel(containerRef.value, {
      align: defaultOptions.align,
      loop: defaultOptions.loop,
      skipSnaps: defaultOptions.skipSnaps,
      dragFree: defaultOptions.dragFree,
      watchResize: true,
    })

    // Track snap points and sync state
    scrollSnaps.value = emblaApi.value.scrollSnapList()
    onSelect()

    // Listeners: select (slide change), reInit (resize), pointerDown (stop autoplay)
    emblaApi.value.on('select', onSelect)
    emblaApi.value.on('reInit', onSelect)
    emblaApi.value.on('pointerDown', stopAutoplay)

    // Start autoplay if enabled
    if (defaultOptions.autoplay.enabled) {
      setupAutoplay()
    }
  }

  // Update selected index and nav button states
  const onSelect = (): void => {
    if (!emblaApi.value) return
    // Current snap index is authoritative carousel state
    selectedIndex.value = emblaApi.value.selectedScrollSnap()
    updateNavigation()
  }

  // Update prev/next button disabled states
  const updateNavigation = (): void => {
    if (!emblaApi.value) return
    canScrollPrev.value = emblaApi.value.canScrollPrev()
    canScrollNext.value = emblaApi.value.canScrollNext()
  }

  // Navigation: call onSelect() after move for immediate state update
  const scrollPrev = (): void => {
    emblaApi.value?.scrollPrev()
    onSelect() // Immediate state update
  }

  const scrollNext = (): void => {
    emblaApi.value?.scrollNext()
    onSelect() // Immediate state update
  }

  // Scroll to index with delay (allow animation to start)
  const scrollTo = (index: number): void => {
    emblaApi.value?.scrollTo(index)
    // Brief delay ensures animation starts before state update
    setTimeout(() => onSelect(), 100)
  }

  // Auto-play: advance slide at interval, stop on user interaction
  const setupAutoplay = (): void => {
    if (autoplayTimer) clearInterval(autoplayTimer)

    autoplayTimer = setInterval(() => {
      if (emblaApi.value?.canScrollNext()) {
        emblaApi.value.scrollNext()
      } else if (defaultOptions.loop) {
        // If loop enabled and at end, jump back to beginning
        emblaApi.value?.scrollTo(0)
      }
      // If no more slides and loop disabled, auto-play stops naturally
    }, defaultOptions.autoplay.delay)
  }

  // Clear timer
  const stopAutoplay = (): void => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer)
      autoplayTimer = null
    }
  }

  // Computed properties
  const totalSlides = computed(() => scrollSnaps.value.length)
  const isBeginning = computed(() => !canScrollPrev.value)
  const isEnd = computed(() => !canScrollNext.value)

  // Cleanup: destroy carousel and clear timers
  const destroy = () => {
    emblaApi.value?.destroy()
    stopAutoplay()
  }

  return {
    // Refs
    containerRef,
    emblaApi,
    selectedIndex,
    scrollSnaps,
    canScrollPrev,
    canScrollNext,

    // Methods
    init,
    scrollPrev,
    scrollNext,
    scrollTo,
    stopAutoplay,
    destroy,

    // Computed
    totalSlides,
    isBeginning,
    isEnd,
  }
}
