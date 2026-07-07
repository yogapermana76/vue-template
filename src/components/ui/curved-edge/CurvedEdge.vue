<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  interface Props {
    class?: HTMLAttributes['class']
  }

  const props = defineProps<Props>()
</script>

<template>
  <div :class="cn('absolute bottom-0 left-0 h-4 w-full rounded-t-sm bg-white', props.class)" />
</template>
