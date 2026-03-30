<script setup lang="ts">
  /**
   * CarouselPrevious Button Component
   *
   * Universal navigation button for ANY carousel:
   * - Works with infinite loops (disabled when loop enabled)
   * - Works with fixed carousels (disabled at first slide)
   * - Optional (not required for carousel function)
   * - Fully styleable and skinnable
   *
   * Best Practices:
   * - Position absolute so it overlays carousel content
   * - Uses semantic button with SR-only label for accessibility
   * - Icon from Lucide Vue for consistency
   * - Respects disabled prop from parent carousel
   *
   * Integration:
   * Parent carousel should:
   * 1. Pass :disabled="!canScrollPrev" from composition
   * 2. Bind @click to scrollPrev() method
   */
  import { ChevronLeft } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'

  /**
   * Props
   * @prop disabled - Whether button is disabled (no more slides to left)
   * @prop positionClass - Custom positioning classes (default: top-1/2 for centered)
   */
  interface Props {
    disabled?: boolean
    positionClass?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    positionClass: 'top-1/2',
  })

  const emit = defineEmits<{
    click: []
  }>()
</script>

<template>
  <Button
    variant="outline"
    size="icon"
    :disabled="disabled"
    :class="['absolute left-2 z-10 -translate-y-1/2 rounded-full', props.positionClass]"
    @click="emit('click')"
  >
    <ChevronLeft class="size-4" />
    <span class="sr-only">Previous slide</span>
  </Button>
</template>
