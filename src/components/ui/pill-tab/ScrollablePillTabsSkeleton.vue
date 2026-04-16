/** * ScrollablePillTabsSkeleton * Skeleton loading state for ScrollablePillTabs component *
Displays animated placeholder for horizontally scrollable pill tabs * * @component * @example *
<ScrollablePillTabsSkeleton :count="5" />
* *
<ScrollablePillTabsSkeleton :count="8" class="mb-4" />
*/

<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'
  import { PillTabSkeleton } from '.'

  /**
   * Props for ScrollablePillTabsSkeleton component
   */
  interface ScrollablePillTabsSkeletonProps {
    /** Number of skeleton tab items to display */
    count?: number
    /** Container class */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<ScrollablePillTabsSkeletonProps>(), {
    count: 5,
  })

  /**
   * Generate random widths for skeleton pills
   */
  const widthClasses = computed(() => {
    const widths = ['w-16', 'w-20', 'w-24', 'w-32', 'w-40', 'w-48', 'w-56']
    const result = []
    for (let i = 0; i < props.count; i++) {
      const randomWidth = widths[Math.floor(Math.random() * widths.length)]
      result.push(randomWidth)
    }
    return result
  })
</script>

<template>
  <div
    data-testid="scrollable-pill-tabs-skeleton"
    :class="
      cn(
        'flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        props.class,
      )
    "
    role="presentation"
  >
    <PillTabSkeleton v-for="(_, index) in count" :key="index" :class="widthClasses[index]" />
  </div>
</template>
