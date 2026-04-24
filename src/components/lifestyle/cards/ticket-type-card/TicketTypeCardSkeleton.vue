<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  export interface TicketTypeCardSkeletonProps {
    /** Number of feature items to show in skeleton */
    featureCount?: number
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<TicketTypeCardSkeletonProps>(), {
    featureCount: 2,
  })
</script>

<template>
  <div
    data-slot="ticket-type-card-skeleton"
    :class="
      cn(
        'relative flex w-full max-w-82 animate-pulse flex-col gap-2 rounded-xl border border-slate-100 bg-white pt-3 pb-0',
        props.class,
      )
    "
  >
    <!-- Header Section -->
    <div class="flex w-full items-center gap-2 px-3">
      <!-- Title Skeleton -->
      <div class="h-5 flex-1 rounded bg-slate-200" />
      <!-- Checkbox Skeleton -->
      <div class="size-4 shrink-0 rounded-full bg-slate-200" />
    </div>

    <!-- Content Card -->
    <div
      class="flex w-full flex-col items-center justify-center gap-0.5 self-stretch rounded-b-xl bg-neutral-50 px-0 py-2"
    >
      <!-- Information Section -->
      <div class="flex w-full flex-col gap-3 px-3">
        <!-- Features List -->
        <div class="flex flex-col gap-1">
          <!-- Subtitle Skeleton -->
          <div class="h-4.5 w-40 rounded bg-slate-200" />

          <!-- Features Skeleton -->
          <div class="flex flex-col gap-1">
            <div v-for="index in featureCount" :key="index" class="flex items-center gap-1">
              <!-- Icon Skeleton -->
              <div class="size-4 shrink-0 rounded bg-slate-200" />
              <!-- Text Skeleton -->
              <div class="h-4.5 flex-1 rounded bg-slate-200" />
            </div>
          </div>
        </div>

        <!-- Detail Link Skeleton -->
        <div class="h-4.5 w-20 rounded bg-slate-200" />
      </div>
    </div>
  </div>
</template>
