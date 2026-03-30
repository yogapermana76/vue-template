/**
 * Carousel State Synchronization Composable
 *
 * Reusable logic for managing carousel state in consumer components.
 * Handles synchronization between carousel component and local state.
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles state sync logic
 * - Open/Closed: Can be extended without modification
 * - Dependency Inversion: Depends on abstract carousel interface
 *
 * Benefits:
 * - Eliminates code duplication across carousel implementations
 * - Type-safe state management
 * - Easy to test
 * - Easy to maintain
 *
 * Usage:
 * ```typescript
 * const { carouselRef, currentIndex, handlePrevious, handleNext, handleDotClick } = useCarouselState()
 *
 * // In template:
 * <Carousel ref="carouselRef">...</Carousel>
 * <CarouselPrevious @click="handlePrevious" />
 * <CarouselNext @click="handleNext" />
 * <CarouselIndicators :selected="currentIndex" @dot-click="handleDotClick" />
 * ```
 */

import { ref, watch, nextTick } from 'vue'

/**
 * Carousel ref interface - properties used by state sync
 *
 * Represents the exposed API from Carousel.vue component.
 * Only declares properties that this composable actually uses.
 * (Loose coupling - doesn't depend on full Carousel implementation)
 */
interface CarouselRef {
  selectedIndex?: number
  canScrollPrev?: boolean
  canScrollNext?: boolean
  scrollPrev?: () => void
  scrollNext?: () => void
  scrollTo?: (index: number) => void
}

/**
 * State synchronization composable for carousel components
 *
 * Features:
 * - Automatic index tracking from carousel
 * - Navigation methods with state sync
 * - Indicator click handlers
 * - Type-safe ref management
 *
 * @returns Carousel state management hook
 */
export function useCarouselState() {
  // Carousel component ref
  const carouselRef = ref<CarouselRef | null>(null)

  // Local state - current slide index
  const currentIndex = ref(0)

  /**
   * Watch carousel selected index and sync with local state
   *
   * Why immediate: true:
   * - Ensures state is correct on component mount
   * - Handles cases where carousel might be pre-selected
   *
   * Why Math.round():
   * - Embla provides fractional indices during scroll
   * - We need whole numbers for indicators
   */
  watch(
    () => carouselRef.value?.selectedIndex,
    newIndex => {
      if (newIndex !== undefined) {
        currentIndex.value = Math.round(newIndex)
      }
    },
    { immediate: true },
  )

  /**
   * Navigate to previous slide with state sync
   *
   * Flow:
   * 1. Call carousel scrollPrev()
   * 2. Wait for Vue to process DOM changes (nextTick)
   * 3. Sync local state from carousel's selectedIndex
   *
   * This ensures UI feedback is immediate
   */
  const handlePrevious = () => {
    carouselRef.value?.scrollPrev?.()
    nextTick(() => {
      const idx = carouselRef.value?.selectedIndex
      if (idx !== undefined) {
        currentIndex.value = Math.round(idx)
      }
    })
  }

  /**
   * Navigate to next slide with state sync
   *
   * Flow:
   * 1. Call carousel scrollNext()
   * 2. Wait for Vue to process DOM changes (nextTick)
   * 3. Sync local state from carousel's selectedIndex
   *
   * This ensures UI feedback is immediate
   */
  const handleNext = () => {
    carouselRef.value?.scrollNext?.()
    nextTick(() => {
      const idx = carouselRef.value?.selectedIndex
      if (idx !== undefined) {
        currentIndex.value = Math.round(idx)
      }
    })
  }

  /**
   * Navigate to specific slide via indicator click
   *
   * Flow:
   * 1. Update local state immediately for instant UI feedback
   * 2. Call carousel scrollTo()
   * 3. Wait for Vue DOM updates (nextTick)
   * 4. Re-sync from carousel (in case scrollTo failed or came from external source)
   *
   * Why update local state first:
   * - Indicator highlights update immediately (no perceived delay)
   * - Better perceived performance
   *
   * Why re-sync after scrollTo:
   * - Defensive: handles carousel not responding
   * - Maintains single source of truth (carousel state)
   */
  const handleDotClick = async (index: number) => {
    currentIndex.value = index
    if (carouselRef.value?.scrollTo) {
      carouselRef.value.scrollTo(index)
      await nextTick()
      const idx = carouselRef.value?.selectedIndex
      if (idx !== undefined) {
        currentIndex.value = Math.round(idx)
      }
    }
  }

  return {
    // Refs for template binding
    carouselRef,
    currentIndex,

    // Methods for event handlers
    handlePrevious,
    handleNext,
    handleDotClick,
  }
}
