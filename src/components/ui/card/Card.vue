<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  const props = defineProps<{
    class?: HTMLAttributes['class']
  }>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'flex flex-col gap-6 rounded-sm border border-neutral-200 bg-white py-6 text-neutral-900 shadow-sm',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
