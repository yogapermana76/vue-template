<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'

  // Container for carousel items with optional gap/padding
  interface Props {
    /** Gap between items (gap-2 | gap-3 | gap-4 | gap-6 | gap-8). Optional - no gap if not set */
    gap?: 'gap-2' | 'gap-3' | 'gap-4' | 'gap-6' | 'gap-8'

    /** Additional CSS classes for wrapper customization */
    class?: string
  }

  // Convert gap-X class to px-X for boundary padding (gap-4 → px-4, etc)
  // Works with responsive: "gap-4 md:gap-6 lg:gap-8" → "px-4 md:px-6 lg:px-8"
  const transformGapToPadding = (gapClasses: string): string => {
    return gapClasses.replace(/\bgap-/g, 'px-')
  }

  const props = withDefaults(defineProps<Props>(), {
    // No default gap - gap/padding only applied if explicitly specified
    // This respects user intent: carousel without gap specification = no spacing
  })

  /**
   * Compute responsive padding from gap classes
   *
   * Only returns padding if gap prop is provided.
   * This ensures:
   * - No unwanted spacing on full-width carousels
   * - No forced defaults
   * - Explicit control for developer
   *
   * Returns:
   * - Padding classes if gap is provided (e.g., "px-6")
   * - Empty string if gap is undefined (no padding)
   */
  const responsivePadding = computed(() => {
    if (!props.gap) return ''
    return transformGapToPadding(props.gap)
  })
</script>

<template>
  <!--
    Flex container for carousel items with optional CSS gap-based spacing

    Official Embla Carousel Implementation:
    - Uses flex gap (not margins or padding on items)
    - Gap property applied ONLY if specified by consumer
    - Works naturally with item flex-basis constraints

    Optional Spacing Behavior:
    - If gap prop provided: gap applies between items, padding created for boundaries
    - If gap prop omitted: NO gap, NO padding - items touch edge-to-edge
    - Responsive gaps: "gap-4 md:gap-6 lg:gap-8" supported

    Infinite Loop Padding (When Gap Specified):
    - For loop: true carousels, padding matches gap value
    - Creates breathing room for cloned boundary items
    - Prevents "dempet" (stuck) appearance at loop boundaries
    - Padding formula: full gap value for visual alignment

    CSS Classes When Gap Specified:
    - gap-X: Dynamic spacing between items (gap-2 through gap-8)
    - px-*: Horizontal padding for infinite loop boundaries
    - flex: Activates flexbox layout for horizontal scrolling
    - w-full: Takes full carousel container width

    Embla Integration:
    - flex-shrink-0 on items prevents shrinking below their basis
    - min-w-0 on items allows content wrapping
    - flex gap handles spacing - no CSS tricks needed
    - Works identically for loop: true and loop: false

    Usage Examples:
    - Multi-item with spacing: <CarouselContent gap="gap-6">
    - Full-width no spacing: <CarouselContent> (gap omitted)
    - Responsive: <CarouselContent gap="gap-4 md:gap-6">
  -->
  <div :class="cn('flex w-full', props.gap, responsivePadding, props.class)">
    <slot />
  </div>
</template>
