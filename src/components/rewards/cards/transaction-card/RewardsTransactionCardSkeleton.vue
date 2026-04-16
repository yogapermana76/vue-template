/** * RewardsTransactionCardSkeleton * Skeleton loading state for RewardsTransactionCard component *
Displays animated placeholder with transaction details * * @component * @example *
<RewardsTransactionCardSkeleton />
*
<RewardsTransactionCardSkeleton class="mb-4" />
*/

<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'

  /**
   * Props for RewardsTransactionCardSkeleton component
   */
  interface RewardsTransactionCardSkeletonProps {
    /** Additional CSS classes to apply to the card */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<RewardsTransactionCardSkeletonProps>(), {})
</script>

<template>
  <div
    data-testid="rewards-transaction-card-skeleton"
    data-slot="rewards-transaction-card-skeleton"
    :class="
      cn(
        'flex flex-row items-start gap-2 rounded-sm border border-slate-200 bg-white p-3',
        props.class,
      )
    "
    aria-busy="true"
    role="presentation"
  >
    <!-- Left Icon Skeleton -->
    <Skeleton class="size-8 shrink-0 rounded-sm" />

    <!-- Information Section -->
    <div class="flex flex-1 flex-col items-start gap-1">
      <!-- Title Skeleton -->
      <Skeleton class="h-4 w-32 rounded-sm" />

      <!-- Date Skeleton -->
      <Skeleton class="h-3 w-40 rounded-sm" />
    </div>

    <!-- Points Section -->
    <div class="flex flex-row items-center gap-2">
      <!-- Points Skeleton -->
      <Skeleton class="h-3 w-12 rounded-sm" />

      <!-- Points Icon Skeleton -->
      <Skeleton class="size-4 shrink-0 rounded-sm" />
    </div>
  </div>
</template>
