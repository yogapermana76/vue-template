<script setup lang="ts">
  import { config } from '@/config'

  type PositionType = 'fixed' | 'sticky' | 'normal'

  interface Props {
    /** Footer position: fixed at bottom, sticky (stays visible on scroll), or normal flow */
    position?: PositionType
    /** Custom CSS classes */
    class?: string
  }

  const { position = 'fixed', class: customClass } = defineProps<Props>()
</script>

<template>
  <!-- Footer Container -->
  <footer
    :class="[
      'flex w-full flex-col items-start gap-3 rounded-t-md border border-neutral-200 bg-white px-4 py-3',
      position === 'fixed' && 'fixed inset-x-0 bottom-0 z-40 mx-auto',
      position === 'sticky' && 'sticky inset-x-0 bottom-0 z-40 mx-auto',
      position === 'normal' && '',
      customClass,
    ]"
    :style="
      position === 'fixed' || position === 'sticky'
        ? { maxWidth: `${config.ui.maxWidth}px` }
        : undefined
    "
  >
    <!-- Slot for custom content -->
    <slot />
  </footer>
</template>
