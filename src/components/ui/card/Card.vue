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
      cn('shadow-card flex flex-col gap-6 rounded-md bg-white py-6 text-neutral-900', props.class)
    "
  >
    <slot />
  </div>
</template>
