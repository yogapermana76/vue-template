/**
 * Embla Carousel Composable
 *
 * Universal carousel composition for ANY carousel type:
 * - Infinite carousels (loop: true)
 * - Fixed-length carousels (loop: false)
 * - Auto-play carousels
 * - Manual navigation carousels
 * - Responsive carousels with dynamic spacing
 *
 * Best Practices Applied:
 * 1. Headless approach - no opinionated styling, full CSS control
 * 2. Semantic event handling - 'select', 'reInit', 'pointerDown' listeners
 * 3. Explicit state updates - call onSelect() after navigation for immediate feedback
 * 4. Responsive container - watchResize: true handles dynamic layout changes
 * 5. No containScroll - conflicts with proper spacing in all carousel types
 * 6. CSS-based spacing - gap classes (gap-4, gap-6) for consistent item spacing
 *
 * Configuration Guide:
 * - align: 'start' | 'center' | 'end' - where first item appears
 * - loop: true/false - infinite cycling
 * - skipSnaps: false - smooth snapping through all points (recommended)
 * - dragFree: false - pixel-perfect snapping (recommended)
 * - watchResize: true - responsive adjustments (always recommended)
 */

import { ref, computed } from 'vue'
import EmblaCarousel from 'embla-carousel'
import type { EmblaCarouselType } from 'embla-carousel'

/**
 * Configuration options for carousel behavior and layout
 */
interface UseEmblaCarouselOptions {
  /** Align first item: start (left/top), center, or end (right/bottom) */
  align?: 'start' | 'center' | 'end'

  /** Enable infinite looping - clones items to create seamless cycling */
  loop?: boolean

  /** Skip intermediate snap points for faster scrolling */
  skipSnaps?: boolean

  /** Allow free form dragging without snapping */
  dragFree?: boolean

  /** Optional auto-play configuration */
  autoplay?: {
    enabled: boolean
    delay: number
  }
}

/**
 * Main carousel composable
 * Returns ref, API methods, and computed state for carousel management
 *
 * CRITICAL: Instance-level state management
 * - Each composable call gets its own autoplay timer
 * - Multiple carousels work independently without interference
 * - No module-level state leakage between instances
 */
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
    loop: true,
    skipSnaps: false,
    dragFree: false,
    autoplay: {
      enabled: false,
      delay: 4000,
    },
    ...options,
  }

  /**
   * Initialize Embla Carousel with best practice configuration
   *
   * Configuration rationale:
   * - align: defaultOptions.align - flexible starting position
   * - loop: defaultOptions.loop - user controls looping behavior
   * - skipSnaps: false - ensures smooth snapping through every snap point
   * - dragFree: false - pixel-perfect snapping (better UX than free-form)
   * - watchResize: true - automatically adapts to container/window resize
   *
   * NOT included (why):
   * - containScroll - conflicts with spacing in loop and non-loop carousels
   * - CSS hacks - spacing handled purely via CSS gap classes
   * - Complex padding - keep it simple and maintainable
   */
  const init = () => {
    if (!containerRef.value) return

    // Embla Carousel Configuration Best Practices (Official Docs)
    // Source: https://github.com/davidjerleke/embla-carousel
    // Reference: website/src/content/v8/pages/api/options.mdx
    //
    // Configuration Rationale:
    // ========================
    // align: user-configurable (start/center/end) - flexible starting position
    // loop: user-configurable (true/false) - determines infinite vs fixed carousel
    // skipSnaps: false - per official docs, ensures smooth snapping through all points
    // dragFree: false - pixel-perfect snapping recommended for standard UX
    // watchResize: true - essential for responsive carousels (official best practice)
    //
    // NOT using containScroll (Official Documentation):
    // ==================================================
    // containScroll (default: 'trimSnaps') exists to "clear leading and trailing
    // empty space" in NON-LOOPING carousels only (official docs).
    //
    // Per official documentation:
    // - containScroll: false | 'trimSnaps' | 'keepSnaps'
    // - Default: 'trimSnaps'
    // - Purpose: Handle empty space at scroll area start/end
    // - WARNING: "When active, it will OVERRIDE alignments at start/end of carousel"
    //
    // With loop: true, there IS NO empty space (infinite cycling), so containScroll
    // causes unnecessary alignment overrides. CSS gap-based spacing handles all
    // infinite carousel spacing naturally and consistently.
    //
    // For non-looping carousels (loop: false), use:
    // - containScroll: false - consistent alignment (may have edge spacing)
    // - containScroll: 'trimSnaps' - removes edges but may misalign first/last
    // - containScroll: 'keepSnaps' - balanced: removes edges AND keeps all snaps
    emblaApi.value = EmblaCarousel(containerRef.value, {
      align: defaultOptions.align,
      loop: defaultOptions.loop,
      skipSnaps: defaultOptions.skipSnaps,
      dragFree: defaultOptions.dragFree,
      watchResize: true, // Official best practice for responsive carousels
    })

    scrollSnaps.value = emblaApi.value.scrollSnapList()
    onSelect()

    // Attach event listeners for state synchronization
    emblaApi.value.on('select', onSelect) // Triggered on every slide change
    emblaApi.value.on('reInit', onSelect) // Triggered when carousel reinitializes
    emblaApi.value.on('pointerDown', stopAutoplay) // Stop auto-play on user interaction

    // Auto-play if enabled
    if (defaultOptions.autoplay.enabled) {
      setupAutoplay()
    }
  }

  /**
   * Handle selection change event
   *
   * Called on every slide transition:
   * - Updates selectedIndex to current snap point
   * - Updates navigation button states (canScrollPrev/canScrollNext)
   *
   * Best Practice: This ensures parent components stay in sync with carousel state
   * for indicators, buttons, and other UI elements that depend on current slide
   */
  const onSelect = () => {
    if (!emblaApi.value) return
    // emblaApi.selectedScrollSnap() returns the current snap index
    // This is the authoritative source of carousel state
    selectedIndex.value = emblaApi.value.selectedScrollSnap()
    updateNavigation()
  }

  /**
   * Update navigation button states based on current position
   *
   * Best Practice: Keep button disabled states in sync with carousel position
   * - canScrollPrev: false when at first slide (or loop enabled)
   * - canScrollNext: false when at last slide (or loop enabled)
   */
  const updateNavigation = () => {
    if (!emblaApi.value) return
    canScrollPrev.value = emblaApi.value.canScrollPrev()
    canScrollNext.value = emblaApi.value.canScrollNext()
  }

  /**
   * Navigation methods - Core carousel control API
   *
   * Best Practice: Always call onSelect() after navigation to immediately
   * update parent component state. This ensures indicators, buttons, and
   * other dependent UI stay in sync with carousel position.
   */
  const scrollPrev = () => {
    emblaApi.value?.scrollPrev()
    onSelect() // Immediate state update
  }

  const scrollNext = () => {
    emblaApi.value?.scrollNext()
    onSelect() // Immediate state update
  }

  /**
   * Scroll to specific slide by index
   *
   * @param index - Target slide index (0-based)
   *
   * Best Practice: Add small delay before onSelect() to ensure
   * scroll animation starts before state update
   */
  const scrollTo = (index: number) => {
    emblaApi.value?.scrollTo(index)
    // Brief delay ensures scroll has started before state update
    setTimeout(() => onSelect(), 100)
  }

  /**
   * Auto-play implementation
   *
   * Best Practices:
   * - Stop on user interaction (pointerDown event)
   * - Respect loop settings - jump to 0 if loop enabled, else stop
   * - Use setInterval for predictable timing
   * - Always clear previous timer before creating new one
   */
  const setupAutoplay = () => {
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

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer)
      autoplayTimer = null
    }
  }

  /**
   * Computed properties - Derived state useful for parent components
   *
   * totalSlides: Total number of snappable positions
   * isBeginning: True when at first slide (useful for disabling prev button)
   * isEnd: True when at last slide (useful for disabling next button)
   */
  const totalSlides = computed(() => scrollSnaps.value.length)
  const isBeginning = computed(() => !canScrollPrev.value)
  const isEnd = computed(() => !canScrollNext.value)

  /**
   * Cleanup and destroy
   *
   * Best Practice: Always destroy carousel and clear timers in onBeforeUnmount
   * to prevent memory leaks and event listener accumulation
   */
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
