<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed, ref } from 'vue'
  import { cn } from '@/utils/cn'

  interface Props {
    class?: HTMLAttributes['class']
    /** Maximum height for vertical scrolling. Enables sticky headers when set. */
    maxHeight?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    maxHeight: 'calc(100vh - 250px)',
  })

  const wrapperRef = ref<HTMLElement | null>(null)
  defineExpose({ wrapperRef })

  const wrapperStyle = computed(() =>
    props.maxHeight ? { maxHeight: props.maxHeight, overflowY: 'auto' as const } : {},
  )

  const wrapperClasses = computed(() =>
    cn('relative w-full overflow-x-auto', props.maxHeight && 'overflow-y-auto'),
  )
</script>

<template>
  <div ref="wrapperRef" data-slot="table-wrapper" :class="wrapperClasses" :style="wrapperStyle">
    <table
      data-slot="table"
      :class="cn('w-full caption-bottom border-separate border-spacing-0 text-sm', props.class)"
    >
      <slot />
    </table>
  </div>
</template>
