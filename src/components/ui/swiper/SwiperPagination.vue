<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  export interface SwiperPaginationProps {
    /** Unique identifier for this pagination instance (must match swiper's pagination.el) */
    id: string
    /** Additional CSS classes for container */
    class?: HTMLAttributes['class']
    /** Variant for different bullet styles */
    variant?: 'default' | 'large' | 'small'
  }

  const props = withDefaults(defineProps<SwiperPaginationProps>(), {
    variant: 'default',
  })
</script>

<template>
  <div
    :id="id"
    :class="cn('swiper-pagination-container flex justify-start gap-1', props.class)"
    :data-variant="variant"
    data-swiper-pagination
  ></div>
</template>

<style scoped>
  /* Default variant - white bullets */
  .swiper-pagination-container :deep(.swiper-pagination-bullet) {
    width: 0.5rem;
    height: 0.5rem;
    background-color: white;
    opacity: 0.4;
    border-radius: 9999px;
    transition: all 200ms ease-in-out;
    margin: 0 0.125rem;
  }

  .swiper-pagination-container :deep(.swiper-pagination-bullet-active) {
    width: 2rem;
    opacity: 1;
  }

  /* Large variant */
  .swiper-pagination-container[data-variant='large'] :deep(.swiper-pagination-bullet) {
    width: 0.75rem;
    height: 0.75rem;
  }

  .swiper-pagination-container[data-variant='large'] :deep(.swiper-pagination-bullet-active) {
    width: 2.5rem;
  }

  /* Small variant */
  .swiper-pagination-container[data-variant='small'] :deep(.swiper-pagination-bullet) {
    width: 0.375rem;
    height: 0.375rem;
  }

  .swiper-pagination-container[data-variant='small'] :deep(.swiper-pagination-bullet-active) {
    width: 1.5rem;
  }
</style>
