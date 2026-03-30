<script setup lang="ts">
  import { onMounted, onBeforeUnmount } from 'vue'
  import { useEmblaCarousel } from '@/composables/useEmblaCarousel'
  import { cn } from '@/utils/cn'

  interface Props {
    class?: string
    autoplay?: boolean
    autoplayDelay?: number
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
    selectedIndex,
    scrollSnaps,
  } = useEmblaCarousel({
    loop: true,
    autoplay: {
      enabled: true,
      delay: 4000,
    },
  })

  // Ensure containerRef is marked as used for TypeScript
  void containerRef

  defineExpose({
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
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
  <div :class="cn('overflow-hidden', props.class)">
    <div ref="containerRef" class="flex">
      <slot />
    </div>
  </div>
</template>
