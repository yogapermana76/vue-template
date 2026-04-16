/** * ExpandableItemSkeleton * Skeleton loading state for ExpandableItem component * Displays
animated placeholder with accordion-like structure * * @component * @example *
<ExpandableItemSkeleton />
* *
<ExpandableItemSkeleton class="mb-4" />
*/

<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'

  /**
   * Props for ExpandableItemSkeleton component
   */
  interface ExpandableItemSkeletonProps {
    /** Additional CSS classes to apply to the container */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<ExpandableItemSkeletonProps>(), {})
</script>

<template>
  <div
    data-testid="expandable-item-skeleton"
    :class="
      cn(
        'flex w-full flex-col gap-2.5 rounded-2xl border border-slate-300 bg-white p-3',
        props.class,
      )
    "
    aria-busy="true"
    role="presentation"
  >
    <!-- Header with Icon and Title -->
    <div class="flex w-full items-center gap-3 p-0">
      <!-- Icon Skeleton -->
      <Skeleton class="size-5 shrink-0 rounded-sm" />

      <!-- Question/Title Skeleton -->
      <Skeleton class="h-4 flex-1 rounded-sm" />

      <!-- Chevron Icon Skeleton -->
      <Skeleton class="size-4 shrink-0 rounded-sm" />
    </div>

    <!-- Content/Answer Skeleton -->
    <!-- <div class="flex flex-col gap-2 pl-0">
      <Skeleton class="h-3 w-full rounded-sm" />
      <Skeleton class="h-3 w-11/12 rounded-sm" />
      <Skeleton class="h-3 w-10/12 rounded-sm" />
    </div> -->
  </div>
</template>
