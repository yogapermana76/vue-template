<script setup lang="ts">
  /**
   * CarouselNext Button Component
   *
   * Universal navigation button for ANY carousel:
   * - Works with infinite loops (disabled when loop enabled)
   * - Works with fixed carousels (disabled at last slide)
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
   * 1. Pass :disabled="!canScrollNext" from composition
   * 2. Bind @click to scrollNext() method
   */
  import { ChevronRight } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'

  /**
   * Props
   * @prop disabled - Whether button is disabled (no more slides to right)
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
    :class="['absolute right-2 z-10 -translate-y-1/2 rounded-full', props.positionClass]"
    @click="emit('click')"
  >
    <ChevronRight class="size-4" />
    <span class="sr-only">Next slide</span>
  </Button>
</template>
