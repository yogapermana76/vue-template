<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  export interface DatePickerCardSkeletonProps {
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  defineProps<DatePickerCardSkeletonProps>()
</script>

<template>
  <div
    :class="
      cn(
        'flex h-19.5 w-19.5 flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white p-2 px-3',
        $props.class,
      )
    "
  >
    <!-- Day Name Skeleton -->
    <div class="h-4.5 w-8.5 animate-pulse rounded bg-slate-200" />

    <!-- Date Number Skeleton -->
    <div class="h-5 w-4.75 animate-pulse rounded bg-slate-200" />

    <!-- Meta Info Skeleton -->
    <div class="flex items-center justify-center gap-1">
      <!-- Month Skeleton -->
      <div class="h-4 w-5 animate-pulse rounded bg-slate-200" />

      <!-- Dot Skeleton -->
      <div class="h-0.5 w-0.5 animate-pulse rounded-full bg-slate-200" />

      <!-- Year Skeleton -->
      <div class="h-4 w-6 animate-pulse rounded bg-slate-200" />
    </div>
  </div>
</template>
