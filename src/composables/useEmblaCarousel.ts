/**
 * Embla Carousel Composable
 *
 * Reusable composition for carousel functionality
 */

import { ref, computed, onMounted } from 'vue'
import EmblaCarousel from 'embla-carousel'
import type { EmblaCarouselType, EmblaEventEmitterType } from 'embla-carousel'

interface UseEmblaCarouselOptions {
  align?: 'start' | 'center' | 'end'
  loop?: boolean
  skipSnaps?: boolean
  dragFree?: boolean
  autoplay?: {
    enabled: boolean
    delay: number
  }
}

export function useEmblaCarousel(options: UseEmblaCarouselOptions = {}) {
  const containerRef = ref<HTMLElement | null>(null)
  const emblaApi = ref<EmblaCarouselType | undefined>()
  const selectedIndex = ref(0)
  const scrollSnaps = ref<number[]>([])
  const canScrollPrev = ref(false)
  const canScrollNext = ref(true)

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

  // Initialize carousel
  const init = () => {
    if (!containerRef.value) return

    emblaApi.value = EmblaCarousel(containerRef.value, {
      align: defaultOptions.align,
      loop: defaultOptions.loop,
      skipSnaps: defaultOptions.skipSnaps,
      dragFree: defaultOptions.dragFree,
    })

    scrollSnaps.value = emblaApi.value.scrollSnapList()
    onSelect()

    // Add event listeners
    emblaApi.value.on('select', onSelect)
    emblaApi.value.on('reInit', onSelect)

    // Auto-play if enabled
    if (defaultOptions.autoplay.enabled) {
      setupAutoplay()
    }
  }

  // Handle selection change
  const onSelect = () => {
    if (!emblaApi.value) return
    selectedIndex.value = emblaApi.value.selectedIndex()
    updateNavigation()
  }

  // Update navigation buttons state
  const updateNavigation = () => {
    if (!emblaApi.value) return
    canScrollPrev.value = emblaApi.value.canScrollPrev()
    canScrollNext.value = emblaApi.value.canScrollNext()
  }

  // Navigation methods
  const scrollPrev = () => emblaApi.value?.scrollPrev()
  const scrollNext = () => emblaApi.value?.scrollNext()
  const scrollTo = (index: number) => emblaApi.value?.scrollTo(index)

  // Auto-play setup
  let autoplayTimer: ReturnType<typeof setInterval> | null = null

  const setupAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer)

    autoplayTimer = setInterval(() => {
      if (emblaApi.value?.canScrollNext()) {
        emblaApi.value.scrollNext()
      } else if (defaultOptions.loop) {
        emblaApi.value?.scrollTo(0)
      }
    }, defaultOptions.autoplay.delay)
  }

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer)
      autoplayTimer = null
    }
  }

  // Computed properties
  const totalSlides = computed(() => scrollSnaps.value.length)
  const isBeginning = computed(() => !canScrollPrev.value)
  const isEnd = computed(() => !canScrollNext.value)

  // Cleanup
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
