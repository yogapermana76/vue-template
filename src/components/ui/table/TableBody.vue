<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  interface Props {
    class?: HTMLAttributes['class']
  }

  const props = defineProps<Props>()
</script>

<template>
  <tbody data-slot="table-body" :class="cn('divide-y divide-neutral-200', props.class)">
    <slot />
  </tbody>
</template>
