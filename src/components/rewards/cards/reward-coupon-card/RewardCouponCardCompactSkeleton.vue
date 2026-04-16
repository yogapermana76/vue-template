/** * RewardCouponCardCompactSkeleton * Skeleton loading state for RewardCouponCardCompact component
* Displays animated placeholder in compact format * * @component * @example *
<RewardCouponCardCompactSkeleton />
*
<RewardCouponCardCompactSkeleton class="mb-4" />
*/

<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'

  /**
   * Props for RewardCouponCardCompactSkeleton component
   */
  interface RewardCouponCardCompactSkeletonProps {
    /** Additional CSS classes to apply to the card */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<RewardCouponCardCompactSkeletonProps>(), {})
</script>

<template>
  <div
    data-testid="reward-coupon-card-compact-skeleton"
    data-slot="reward-coupon-card-compact-skeleton"
    :class="
      cn(
        'relative flex h-auto w-full flex-col rounded-sm border border-slate-200 bg-white',
        props.class,
      )
    "
    aria-busy="true"
    role="presentation"
  >
    <!-- Image Container Skeleton (aspect-2/1) -->
    <div class="relative aspect-2/1 w-full overflow-hidden rounded-t-sm">
      <Skeleton class="h-full w-full rounded-t-sm" />
    </div>

    <!-- Content Container -->
    <div class="flex flex-col gap-2 p-3">
      <!-- Title Skeleton -->
      <Skeleton class="h-4 w-28 rounded-sm" />

      <!-- Status Text Skeleton -->
      <Skeleton class="h-3 w-32 rounded-sm" />

      <!-- Points Skeleton -->
      <Skeleton class="mt-1 h-4 w-24 rounded-sm" />

      <!-- Button Skeleton -->
      <Skeleton class="mt-2 h-8 w-full rounded-sm" />
    </div>
  </div>
</template>
