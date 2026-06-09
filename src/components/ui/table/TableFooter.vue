<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  interface Props {
    class?: HTMLAttributes['class']
  }

  const props = defineProps<Props>()
</script>

<template>
  <tfoot
    data-slot="table-footer"
    :class="cn('border-t border-neutral-200 bg-neutral-50 font-medium', props.class)"
  >
    <slot />
  </tfoot>
</template>
