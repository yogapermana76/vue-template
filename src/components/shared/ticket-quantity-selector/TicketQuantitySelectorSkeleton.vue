<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Skeleton } from '@/components/ui/skeleton'

  interface Props {
    class?: HTMLAttributes['class']
  }

  defineProps<Props>()
</script>

<template>
  <div :class="cn('flex w-full flex-row items-center justify-between gap-2', $props.class)">
    <!-- Label & price -->
    <div class="flex flex-col gap-1">
      <Skeleton class="h-3.5 w-52 rounded" />
      <Skeleton class="h-3.5 w-36 rounded" />
    </div>

    <!-- Number stepper -->
    <div class="flex flex-row items-center gap-2">
      <Skeleton class="h-7 w-7 rounded-full" />
      <Skeleton class="h-4 w-5 rounded" />
      <Skeleton class="h-7 w-7 rounded-full" />
    </div>
  </div>
</template>
