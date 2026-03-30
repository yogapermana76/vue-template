<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  interface Props {
    class?: HTMLAttributes['class']
  }

  const props = defineProps<Props>()
</script>

<template>
  <div
    :class="cn('flex flex-col gap-4 md:flex-row md:items-center md:justify-between', props.class)"
  >
    <slot />
  </div>
</template>
