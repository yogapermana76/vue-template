<script setup lang="ts">
  import { cn } from '@/utils/cn'

  interface Props {
    class?: string
    basis?: 'full' | '1/2' | '1/3' | '1/4' | '1/5'
  }

  const props = withDefaults(defineProps<Props>(), {
    basis: 'full',
  })

  const basisMap: Record<string, string> = {
    full: 'basis-full',
    '1/2': 'basis-1/2',
    '1/3': 'basis-1/3',
    '1/4': 'basis-1/4',
    '1/5': 'basis-1/5',
  }
</script>

<template>
  <div :class="cn('flex-shrink-0 pl-4 first:pl-0 md:pl-6', basisMap[props.basis], props.class)">
    <slot />
  </div>
</template>
