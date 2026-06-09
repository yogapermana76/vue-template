<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  interface Props {
    class?: HTMLAttributes['class']
    align?: 'left' | 'center' | 'right'
  }

  const props = withDefaults(defineProps<Props>(), {
    align: 'left',
  })
</script>

<template>
  <td
    data-slot="table-cell"
    :data-align="align"
    :class="
      cn(
        'relative border-b border-neutral-200 p-3 align-middle text-neutral-900',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        props.class,
      )
    "
  >
    <slot />
  </td>
</template>
