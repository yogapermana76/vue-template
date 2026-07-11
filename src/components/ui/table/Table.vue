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

  /**
   * Always apply `scrollbar-thin` to the scroll wrapper. macOS switches
   * between overlay (thin) and classic (thick) scrollbars depending on the
   * "Show scroll bars" system setting + whether a mouse is connected,
   * which is why the table scrollbar can appear chunky then "get fixed" by
   * a reload. Locking the size here keeps the visual consistent across OS
   * states — see `.scrollbar-thin` in `main.css` for the full rationale.
   */
  const wrapperClasses = computed(() =>
    cn('relative w-full overflow-x-auto scrollbar-thin', props.maxHeight && 'overflow-y-auto'),
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
