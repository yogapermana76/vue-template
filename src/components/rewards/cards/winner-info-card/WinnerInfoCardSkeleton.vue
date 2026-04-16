/** * WinnerInfoCardSkeleton * Skeleton loading state for WinnerInfoCard component * Displays
animated placeholder with gradient background and icon placeholders * * @component * @example *
<WinnerInfoCardSkeleton />
*
<WinnerInfoCardSkeleton class="mb-4" />
*/

<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'

  /**
   * Props for WinnerInfoCardSkeleton component
   */
  interface WinnerInfoCardSkeletonProps {
    /** Additional CSS classes to apply to the card */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<WinnerInfoCardSkeletonProps>(), {})
</script>

<template>
  <div
    data-testid="winner-info-card-skeleton"
    :class="
      cn(
        'relative flex h-16 items-center gap-3 overflow-hidden rounded-sm bg-[linear-gradient(135deg,#1AB6BE_0%,#0E6AA7_100%)] px-4',
        props.class,
      )
    "
    aria-busy="true"
    role="presentation"
  >
    <!-- Icon Skeleton -->
    <Skeleton class="size-6 shrink-0 rounded-sm bg-white/20" />

    <!-- Content Skeleton -->
    <div class="flex flex-1 flex-col gap-1">
      <!-- Title Skeleton -->
      <Skeleton class="h-3 w-32 rounded-sm bg-white/20" />

      <!-- Description Skeleton -->
      <Skeleton class="h-2.5 w-40 rounded-sm bg-white/20" />
    </div>

    <!-- Arrow Icon Skeleton -->
    <Skeleton class="size-5 shrink-0 rounded-sm bg-white/20" />
  </div>
</template>
