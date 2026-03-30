<script setup lang="ts">
  import { cn } from '@/utils/cn'

  interface Props {
    class?: string
  }

  const props = defineProps<Props>()
</script>

<template>
  <div :class="cn('flex', props.class)">
    <slot />
  </div>
</template>
