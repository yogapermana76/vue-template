<script setup lang="ts">
  import { Skeleton } from '@/components/ui/skeleton'
  import { RoundedOverlap } from '@/components/ui'
</script>

<template>
  <!-- Hero Banner Skeleton -->
  <div class="relative h-46.75 w-full">
    <Skeleton class="h-full w-full rounded-none" />
    <RoundedOverlap />
  </div>

  <!-- Content Skeleton -->
  <main class="flex flex-1 flex-col gap-6 px-4 pb-24">
    <!-- Title & Description Skeleton -->
    <div class="flex flex-col gap-1">
      <!-- Title Skeleton -->
      <Skeleton class="h-5 w-3/4" />

      <!-- Description Skeleton - Multiple lines -->
      <div class="mt-3 flex flex-col gap-2">
        <Skeleton class="h-3 w-full" />
        <Skeleton class="h-3 w-11/12" />
        <Skeleton class="h-3 w-full" />
        <Skeleton class="h-3 w-5/6" />
        <Skeleton class="h-3 w-3/4" />
      </div>
    </div>
  </main>
</template>
