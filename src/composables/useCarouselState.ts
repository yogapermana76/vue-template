// Sync carousel state changes to local currentIndex

import { ref, watch, nextTick } from 'vue'

// Carousel ref interface - only properties we need
interface CarouselRef {
  selectedIndex?: number
  canScrollPrev?: boolean
  canScrollNext?: boolean
  scrollPrev?: () => void
  scrollNext?: () => void
  scrollTo?: (index: number) => void
}

// Manage carousel state and navigation
export function useCarouselState() {
  // Carousel component ref
  const carouselRef = ref<CarouselRef | null>(null)

  // Local state - current slide index
  const currentIndex = ref(0)

  // Sync carousel index to local state (round fractional values)
  watch(
    () => carouselRef.value?.selectedIndex,
    newIndex => {
      if (newIndex !== undefined) {
        currentIndex.value = Math.round(newIndex)
      }
    },
    { immediate: true },
  )

  // Navigate to previous slide (includes state sync)
  const handlePrevious = () => {
    carouselRef.value?.scrollPrev?.()
    nextTick(() => {
      const idx = carouselRef.value?.selectedIndex
      if (idx !== undefined) {
        currentIndex.value = Math.round(idx)
      }
    })
  }

  // Navigate to next slide (includes state sync)
  const handleNext = () => {
    carouselRef.value?.scrollNext?.()
    nextTick(() => {
      const idx = carouselRef.value?.selectedIndex
      if (idx !== undefined) {
        currentIndex.value = Math.round(idx)
      }
    })
  }

  // Navigate to specific slide via indicator click (immediate UI feedback + carousel sync)
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
