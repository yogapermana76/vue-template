/** * RewardBannerCardSkeleton * Skeleton loading state for RewardBannerCard component * Displays
animated placeholder with banner image and overlay card * * @component * @example *
<RewardBannerCardSkeleton />
*
<RewardBannerCardSkeleton class="mb-4" />
*/

<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'

  /**
   * Props for RewardBannerCardSkeleton component
   */
  interface RewardBannerCardSkeletonProps {
    /** Additional CSS classes to apply to the card */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<RewardBannerCardSkeletonProps>(), {})
</script>

<template>
  <div
    data-testid="reward-banner-card-skeleton"
    data-slot="reward-banner-card-skeleton"
    :class="
      cn('relative h-66 w-full overflow-visible rounded-sm border border-slate-200', props.class)
    "
    aria-busy="true"
    role="presentation"
  >
    <!-- Banner Image Skeleton -->
    <Skeleton class="h-32 w-full rounded-t-sm" />

    <!-- Overlay Card (positioned at bottom) -->
    <div
      class="absolute bottom-3 left-1/2 flex w-[calc(100%-16px)] -translate-x-1/2 flex-col items-center gap-0.5 rounded-sm bg-white py-3"
    >
      <!-- Content -->
      <div class="flex w-full flex-col gap-2 px-4">
        <!-- Title Skeleton -->
        <Skeleton class="h-4 w-24 rounded-sm" />

        <!-- Duration Skeleton -->
        <Skeleton class="h-3 w-32 rounded-sm" />

        <!-- Status Skeleton -->
        <Skeleton class="h-3 w-24 rounded-sm" />

        <!-- Points Skeleton -->
        <Skeleton class="mt-1 h-4 w-20 rounded-sm" />

        <!-- Button Skeleton -->
        <Skeleton class="mt-1 h-8 w-full rounded-sm" />
      </div>
    </div>
  </div>
</template>
