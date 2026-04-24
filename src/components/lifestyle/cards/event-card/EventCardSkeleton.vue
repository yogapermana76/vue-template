/** * EventCardSkeleton * Skeleton loading state for EventCard component * Displays animated
placeholder for event card with image and content sections * * @component * @example *
<EventCardSkeleton />
* *
<EventCardSkeleton class="mb-4" />
*/

<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'

  /**
   * Props for EventCardSkeleton component
   */
  interface EventCardSkeletonProps {
    /** Additional CSS classes to apply to the card */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<EventCardSkeletonProps>(), {})
</script>

<template>
  <div
    data-testid="event-card-skeleton"
    :class="
      cn('flex w-full flex-col overflow-hidden rounded-xl border border-neutral-200', props.class)
    "
    aria-busy="true"
    role="presentation"
  >
    <!-- Image Skeleton -->
    <Skeleton class="h-42.75 w-full rounded-none" />

    <!-- Content Section -->
    <div class="flex items-start justify-between gap-0.5 bg-white px-4 py-3">
      <!-- Title Section -->
      <div class="flex flex-1 flex-col gap-0.5">
        <!-- Location Skeleton -->
        <Skeleton class="h-4.5 w-16 rounded-sm" />
        <!-- Title Skeleton -->
        <Skeleton class="h-5 w-full max-w-45.75 rounded-sm" />
      </div>

      <!-- Price Section -->
      <div class="flex flex-col items-end justify-center gap-0.5">
        <!-- Discount Badge Skeleton (optional, shown for variety) -->
        <Skeleton class="h-3.5 w-16 rounded-sm" />
        <!-- Price Skeleton -->
        <Skeleton class="h-6 w-20 rounded-sm" />
      </div>
    </div>
  </div>
</template>
