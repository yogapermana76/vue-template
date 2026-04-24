<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'
  import { Divider } from '@/components/ui/divider'

  export interface TicketCategoryCardSkeletonProps {
    /** Number of benefit lines to show */
    benefitCount?: number
    /** Ticket variant - changes header background color */
    variant?: 'regular' | 'vip'
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<TicketCategoryCardSkeletonProps>(), {
    benefitCount: 2,
    variant: 'regular',
  })

  const headerBackgroundClass = props.variant === 'vip' ? 'bg-tertiary-600' : 'bg-primary-800'
</script>

<template>
  <div
    data-slot="ticket-category-card-skeleton"
    :class="
      cn(
        'relative flex w-full flex-col items-center gap-2 overflow-visible rounded-xl px-0 pt-2 pb-0',
        headerBackgroundClass,
        props.class,
      )
    "
  >
    <!-- Decorative gradient background (top) -->
    <div
      class="pointer-events-none absolute top-[-112.78px] left-40 isolate size-46 overflow-hidden"
      aria-hidden="true"
    >
      <!-- Gradient Vector 1 -->
      <div
        class="absolute top-1/2 left-1/2 h-[218.2px] w-[131.27px] -translate-x-[calc(50%-57px)] -translate-y-[calc(50%+94.15px)] opacity-20"
        :style="{
          background:
            'linear-gradient(131.12deg, rgba(255, 255, 255, 0.2) -8.15%, rgba(255, 255, 255, 0) 17.97%, rgba(255, 255, 255, 0.4) 44.1%, rgba(255, 255, 255, 0) 65.95%, rgba(255, 255, 255, 0.7) 80.47%, rgba(255, 255, 255, 0) 102.74%)',
          transform: 'rotate(14.31deg)',
        }"
      />

      <!-- Gradient Vector 2 (border) -->
      <div
        class="absolute top-1/2 left-1/2 h-[218.2px] w-[131.27px] -translate-x-[calc(50%-54.13px)] -translate-y-[calc(50%+101.68px)] opacity-70"
        :style="{ transform: 'rotate(14.31deg)' }"
      />
    </div>

    <!-- Header Section -->
    <div class="relative z-10 flex w-full items-center justify-between px-6">
      <!-- Ticket Category Skeleton -->
      <Skeleton class="h-6 w-24 rounded bg-white/20" />

      <!-- Detail Link Skeleton -->
      <Skeleton class="h-4.5 w-8 rounded bg-white/20" />
    </div>

    <!-- Content Card -->
    <div
      class="bg-primary-50 relative z-20 flex w-full flex-col items-center justify-center gap-0.5 self-stretch rounded-xl px-0 py-3"
    >
      <!-- Information Section -->
      <div class="flex w-full flex-col gap-1 px-4">
        <!-- Section Title Skeleton -->
        <Skeleton class="h-4.5 w-40 rounded" />

        <!-- Benefits List Skeleton -->
        <div class="flex flex-col gap-1">
          <div v-for="i in benefitCount" :key="i" class="flex items-center gap-1">
            <!-- Checkmark Icon Skeleton -->
            <Skeleton class="size-4 shrink-0 rounded" />
            <!-- Benefit Text Skeleton -->
            <Skeleton class="h-4.5 flex-1 rounded" />
          </div>
        </div>
      </div>

      <!-- Divider with circles (ticket perforation effect) -->
      <div class="relative h-5 w-full">
        <!-- Left Circle -->
        <div
          :class="
            cn(
              'absolute top-1/2 -left-2 size-5 -translate-y-1/2 rounded-full',
              headerBackgroundClass,
            )
          "
          aria-hidden="true"
        />

        <!-- Divider Line -->
        <div class="flex h-full items-center">
          <Divider variant="dashed" orientation="horizontal" class="w-full" />
        </div>

        <!-- Right Circle -->
        <div
          :class="
            cn(
              'absolute top-1/2 -right-2 size-5 -translate-y-1/2 rounded-full',
              headerBackgroundClass,
            )
          "
          aria-hidden="true"
        />
      </div>

      <!-- Price & Button Section -->
      <div class="flex w-full items-center justify-between gap-2.5 px-4">
        <!-- Price Container Skeleton -->
        <div class="flex flex-col items-start justify-end gap-0.5">
          <!-- Final Price Skeleton -->
          <Skeleton class="h-6 w-22 rounded" />
        </div>

        <!-- Action Button Skeleton -->
        <Skeleton class="h-8 w-21.25 rounded-full" />
      </div>
    </div>
  </div>
</template>
