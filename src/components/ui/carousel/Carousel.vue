<script setup lang="ts">
  import { onMounted, onBeforeUnmount } from 'vue'
  import { useEmblaCarousel } from '@/composables/carousel'
  import { cn } from '@/utils/cn'

  // Embla carousel wrapper - supports loop, autoplay, responsive layouts
  interface Props {
    /** Additional CSS classes applied to outer wrapper */
    class?: string

    /** Enable automatic slide advancement. Stops on user interaction */
    autoplay?: boolean

    /** Delay between auto advances in ms (default: 4000ms) */
    autoplayDelay?: number

    /** Enable infinite looping (default: true) */
    loop?: boolean

    /** Carousel alignment: start | center | end (default: start) */
    align?: 'start' | 'center' | 'end'

    /** Text direction for RTL support: ltr | rtl (default: ltr) */
    direction?: 'ltr' | 'rtl'
  }

  const props = withDefaults(defineProps<Props>(), {
    autoplay: false,
    autoplayDelay: 4000,
    loop: true,
    align: 'start',
    direction: 'ltr',
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
    align: props.align,
    direction: props.direction,
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
  <!-- Carousel wrapper: relative + overflow-hidden for clipping, dir for RTL -->
  <div :class="cn('relative overflow-hidden', props.class)" :dir="props.direction">
    <!-- Embla container: flex + h-full for proper stretching -->
    <div ref="containerRef" class="flex h-full">
      <slot />
    </div>
  </div>
</template>
