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
      'bg-background/95 supports-backdrop-filter:bg-background/60 border-t backdrop-blur',
      position === 'fixed' && 'fixed right-0 bottom-0 left-0 z-40 mx-auto',
      position === 'sticky' && 'sticky right-0 bottom-0 left-0 z-40 mx-auto',
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
