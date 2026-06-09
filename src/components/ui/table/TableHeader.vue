<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  interface Props {
    class?: HTMLAttributes['class']
  }

  const props = defineProps<Props>()
</script>

<template>
  <thead data-slot="table-header" :class="cn('border-b border-neutral-200', props.class)">
    <slot />
  </thead>
</template>
