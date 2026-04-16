/** * RewardPrizeCardSkeleton * Skeleton loading state for RewardPrizeCard component * Displays
animated placeholder with image and prize information * * @component * @example *
<RewardPrizeCardSkeleton />
*
<RewardPrizeCardSkeleton class="mb-4" />
*/

<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'

  /**
   * Props for RewardPrizeCardSkeleton component
   */
  interface RewardPrizeCardSkeletonProps {
    /** Additional CSS classes to apply to the card */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<RewardPrizeCardSkeletonProps>(), {})
</script>

<template>
  <div
    data-testid="reward-prize-card-skeleton"
    :class="
      cn('flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-3', props.class)
    "
    aria-busy="true"
    role="presentation"
  >
    <!-- Prize Image Skeleton -->
    <Skeleton class="size-16 shrink-0 rounded-lg" />

    <!-- Prize Info -->
    <div class="flex flex-1 flex-col gap-1">
      <!-- Title Skeleton -->
      <Skeleton class="h-4 w-24 rounded-sm" />

      <!-- Date Skeleton -->
      <Skeleton class="h-3 w-32 rounded-sm" />
    </div>
  </div>
</template>
