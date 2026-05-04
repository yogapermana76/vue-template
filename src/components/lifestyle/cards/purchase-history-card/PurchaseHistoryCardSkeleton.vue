<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'
  import { Divider } from '@/components/ui/divider'

  export interface PurchaseHistoryCardSkeletonProps {
    /** Show payment deadline skeleton */
    showPaymentDeadline?: boolean
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<PurchaseHistoryCardSkeletonProps>(), {
    showPaymentDeadline: false,
  })
</script>

<template>
  <div
    data-slot="purchase-history-card-skeleton"
    :class="cn('flex w-full flex-col gap-2', props.class)"
  >
    <!-- Header: Date & Status -->
    <div class="flex items-center justify-between">
      <!-- Date Skeleton -->
      <Skeleton class="h-5 w-28" />
      <!-- Status Badge Skeleton -->
      <Skeleton class="h-5.5 w-20 rounded-full" />
    </div>

    <!-- Content: Image & Info -->
    <div class="flex items-start gap-4">
      <!-- Event Image Skeleton -->
      <Skeleton class="size-20 shrink-0 rounded-xl" />

      <!-- Event Info Skeleton -->
      <div class="flex min-h-20 flex-1 flex-col justify-between gap-2">
        <!-- Title Skeleton (2 lines) -->
        <div class="flex flex-col gap-1">
          <Skeleton class="h-5 w-full" />
          <Skeleton class="h-5 w-3/4" />
        </div>

        <!-- Subtitle Skeleton -->
        <Skeleton class="h-4.5 w-40" />

        <!-- Ticket Info Skeleton -->
        <Skeleton class="h-4.5 w-32" />
      </div>
    </div>

    <!-- Divider -->
    <Divider />

    <!-- Footer: Payment Info & Action -->
    <div class="flex items-center justify-end gap-2.5">
      <!-- Payment Deadline Skeleton -->
      <div v-if="showPaymentDeadline" class="flex flex-1 flex-col gap-1">
        <Skeleton class="h-4.5 w-24" />
        <Skeleton class="h-6 w-20" />
      </div>

      <!-- Action Button Skeleton -->
      <Skeleton class="h-8 w-22.5 rounded-full" />
    </div>
  </div>
</template>
