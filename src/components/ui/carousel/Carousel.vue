<script setup lang="ts">
  import { onMounted, onBeforeUnmount } from 'vue'
  import { useEmblaCarousel } from '@/composables/useEmblaCarousel'
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
  <!-- Carousel wrapper: relative + overflow-hidden for clipping -->
  <div :class="cn('relative overflow-hidden', props.class)">
    <!-- Embla container: flex + h-full for proper stretching -->
    <div ref="containerRef" class="flex h-full">
      <slot />
    </div>
  </div>
</template>
