<script setup lang="ts">
  import { onMounted, onBeforeUnmount } from 'vue'
  import { useEmblaCarousel } from '@/composables/useEmblaCarousel'
  import { cn } from '@/utils/cn'

  /**
   * Carousel Component - Universal Embla Carousel wrapper
   *
   * Works with ANY carousel configuration:
   * - Infinite carousels (loop: true)
   * - Fixed-length carousels (loop: false)
   * - Auto-play and manual navigation
   * - Responsive single or multi-column layouts
   * - Thumbnail galleries and hero sections
   *
   * Container Best Practices:
   * - Fixed height (h-[300px] md:h-[400px]) ensures proper flex context
   * - Overflow hidden clips items outside carousel bounds
   * - Position relative enables absolute-positioned children (buttons, indicators)
   * - Direct containerRef child with flex h-full stretches items to full height
   *
   * Component Structure:
   * ```vue
   * <Carousel :autoplay="true" :loop="true">
   *   <CarouselContent :gap="gap">
   *     <CarouselItem :basis="basis"> Content </CarouselItem>
   *   </CarouselContent>
   *   <CarouselPrevious /> <!-- Absolute positioned -->
   *   <CarouselNext /> <!-- Absolute positioned -->
   *   <CarouselIndicators /> <!-- Absolute positioned at bottom -->
   * </Carousel>
   * ```
   *
   * Key Exposed API:
   * - containerRef: Direct access to Embla container for advanced usage
   * - selectedIndex: Current slide index (reactive)
   * - canScrollPrev / canScrollNext: Navigation state (reactive)
   * - scrollPrev() / scrollNext() / scrollTo(): Navigation methods
   * - scrollSnaps: Array of snap points for indicators
   */
  interface Props {
    /** Additional CSS classes applied to outer wrapper */
    class?: string

    /**
     * Enable automatic slide advancement
     * - Works with any carousel type (infinite or fixed)
     * - Stops on user interaction (drag, touch, click)
     * - Use autoplayDelay to control speed
     * @default false
     */
    autoplay?: boolean

    /**
     * Milliseconds between automatic slide advances
     * Typical values:
     * - 3000ms: Quick pace
     * - 5000ms: Balanced (recommended for hero banners)
     * - 6000ms: Leisurely pace (recommended for testimonials)
     * @default 4000
     */
    autoplayDelay?: number

    /**
     * Enable infinite carousel looping
     * - true: Clones items, creates seamless infinite cycle
     * - false: Stops at last slide, no wrapping
     * Spacing is consistent regardless of loop value
     * @default true
     */
    loop?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    autoplay: false,
    autoplayDelay: 4000,
    loop: true,
  })

  const {
    containerRef,
    init,
    destroy,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    scrollTo,
    selectedIndex,
    scrollSnaps,
  } = useEmblaCarousel({
    loop: props.loop,
    autoplay: {
      enabled: props.autoplay,
      delay: props.autoplayDelay,
    },
  })

  defineExpose({
    containerRef,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    scrollTo,
    selectedIndex,
    scrollSnaps,
  })

  onMounted(() => {
    init()
  })

  onBeforeUnmount(() => {
    destroy()
  })
</script>

<template>
  <!-- Container with overflow hidden - essential for carousel clipping -->
  <!-- Height configured via class prop - flexible for different use cases -->
  <!-- Position relative for absolute-positioned children (prev/next buttons, indicators) -->
  <div :class="cn('relative overflow-hidden', props.class)">
    <!-- Embla carousel container - must be direct child of scoped container -->
    <!-- flex + h-full ensures items stretch to container height -->
    <div ref="containerRef" class="flex h-full">
      <slot />
    </div>
  </div>
</template>
