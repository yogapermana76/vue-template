<script setup lang="ts">
  import { cn } from '@/utils/cn'

  interface Props {
    /** Whether sidebar is collapsed */
    collapsed?: boolean
  }

  withDefaults(defineProps<Props>(), {
    collapsed: false,
  })
</script>

<template>
  <div :class="cn('border-border shrink-0 border-t p-4', collapsed && 'px-2')">
    <slot :collapsed="collapsed" />
  </div>
</template>
