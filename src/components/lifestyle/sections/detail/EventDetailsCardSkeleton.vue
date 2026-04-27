<script setup lang="ts">
  import { Skeleton } from '@/components/ui/skeleton'

  interface Props {
    itemCount?: number
    class?: string
  }

  withDefaults(defineProps<Props>(), {
    itemCount: 3,
    class: '',
  })
</script>

<template>
  <div :class="['bg-primary-50 flex flex-col items-start gap-4 rounded-sm p-3', $props.class]">
    <div v-for="index in itemCount" :key="index" class="flex w-full items-start gap-2">
      <!-- Icon Skeleton -->
      <Skeleton class="size-5 shrink-0 rounded-full" />

      <!-- Text Container Skeleton -->
      <div class="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <!-- Label Skeleton -->
        <Skeleton class="h-4 w-20" />

        <!-- Value Skeleton -->
        <Skeleton class="h-5 w-3/4" />

        <!-- Secondary Value Skeleton (show for 2nd and 3rd items) -->
        <Skeleton v-if="index > 1" class="h-4.5 w-1/2" />

        <!-- Action Button Skeleton (show for last item) -->
        <Skeleton v-if="index === itemCount" class="mt-1 h-4.5 w-16" />
      </div>
    </div>
  </div>
</template>
