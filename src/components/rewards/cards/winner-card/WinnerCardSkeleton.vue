/** * WinnerCardSkeleton * Skeleton loading state for WinnerCard component * Displays animated
placeholder with variant support (featured, highlighted, default) * * @component * @example *
<WinnerCardSkeleton />
*
<WinnerCardSkeleton variant="featured" />
*
<WinnerCardSkeleton variant="highlighted" />
*/

<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'
  import {
    winnerCardVariants,
    winnerCardHeaderVariants,
    winnerCardContentVariants,
    type WinnerCardVariants,
  } from './winnerCardVariants'

  /**
   * Props for WinnerCardSkeleton component
   */
  interface WinnerCardSkeletonProps {
    /** Card variant style */
    variant?: WinnerCardVariants['variant']
    /** Additional CSS classes to apply to the card container */
    class?: HTMLAttributes['class']
    /** Additional CSS classes to apply to the content section */
    contentClass?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<WinnerCardSkeletonProps>(), {
    variant: 'default',
  })
</script>

<template>
  <div
    data-testid="winner-card-skeleton"
    data-slot="winner-card-skeleton"
    :class="cn(winnerCardVariants({ variant: props.variant }), props.class)"
    aria-busy="true"
    role="presentation"
  >
    <!-- Header Skeleton -->
    <div :class="winnerCardHeaderVariants({ variant: props.variant })">
      <!-- Rank Label Skeleton -->
      <Skeleton class="h-3 w-24 rounded-sm" />

      <!-- Prize Skeleton -->
      <div class="flex flex-row items-center gap-1">
        <Skeleton class="size-3 shrink-0 rounded-sm" />
        <Skeleton class="h-3 w-16 rounded-sm" />
      </div>
    </div>

    <!-- Content Skeleton -->
    <div :class="cn(winnerCardContentVariants({ variant: props.variant }), props.contentClass)">
      <!-- Winner Info Container -->
      <div class="flex flex-col gap-1">
        <!-- Winner Name Skeleton -->
        <Skeleton class="h-4 w-28 rounded-sm" />

        <!-- Email/Details Skeletons -->
        <Skeleton class="h-3 w-40 rounded-sm" />
        <Skeleton class="h-3 w-32 rounded-sm" />
      </div>

      <!-- Prize Image Skeleton (if featured) -->
      <div class="flex justify-center">
        <Skeleton class="size-20 shrink-0 rounded-lg" />
      </div>
    </div>
  </div>
</template>
