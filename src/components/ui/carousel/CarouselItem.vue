<script setup lang="ts">
  import { cn } from '@/utils/cn'

  // Carousel item wrapper - requires flex-shrink-0 and basis to work properly
  interface Props {
    /** Item width: full | 1/2 | 1/3 | 1/4 | 1/5 (default: full) */
    basis?: 'full' | '1/2' | '1/3' | '1/4' | '1/5'

    /** Additional CSS classes for item customization */
    class?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    basis: 'full',
  })

  // Map basis values to Tailwind classes
  const basisMap: Record<string, string> = {
    full: 'basis-full', // 100% width
    '1/2': 'basis-1/2', // 50% width
    '1/3': 'basis-1/3', // 33.333% width
    '1/4': 'basis-1/4', // 25% width
    '1/5': 'basis-1/5', // 20% width
  }
</script>

<template>
  <!--
    flex-shrink-0: prevent items from shrinking
    min-w-0: allow text truncation inside items
    basisMap[basis]: item width

    These work together to let Embla accurately:
    - Calculate snap positions
    - Detect scroll boundaries
    - Handle responsive resizing
    - Work with both infinite and fixed carousels

    Custom properties from parent are merged in without affecting
    the critical shrink/width properties
  -->
  <div :class="cn('min-w-0 shrink-0', basisMap[props.basis], props.class)">
    <slot />
  </div>
</template>
