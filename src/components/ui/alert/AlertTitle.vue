<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  const props = defineProps<{
    class?: HTMLAttributes['class']
  }>()
</script>

<template>
  <div data-slot="alert-title" :class="cn('text-xs leading-4.5 font-semibold', props.class)">
    <slot />
  </div>
</template>
