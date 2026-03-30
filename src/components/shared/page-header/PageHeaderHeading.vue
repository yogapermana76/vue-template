<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  interface Props {
    class?: HTMLAttributes['class']
  }

  const props = defineProps<Props>()
</script>

<template>
  <h1 :class="cn('text-display-xs md:text-display-sm', props.class)">
    <slot />
  </h1>
</template>
