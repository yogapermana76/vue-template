<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Divider } from '@/components/ui/divider'

  const props = defineProps<{
    class?: HTMLAttributes['class']
  }>()
</script>

<template>
  <Divider data-slot="item-separator" orientation="horizontal" :class="cn('my-0', props.class)" />
</template>
