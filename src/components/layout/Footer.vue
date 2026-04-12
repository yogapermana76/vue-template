<script setup lang="ts">
  import { computed } from 'vue'
  import { config } from '@/config'

  type PositionType = 'fixed' | 'sticky' | 'normal'

  interface Props {
    /** Footer position: fixed at bottom, sticky (stays visible on scroll), or normal flow */
    position?: PositionType
    /** Custom CSS classes */
    class?: string
  }

  const { position = 'fixed', class: customClass } = defineProps<Props>()

  // Base classes applied to all footer instances
  const baseClasses =
    'flex w-full flex-col items-start gap-3 rounded-t-md border border-neutral-200 bg-white px-4 py-3'

  // Position-based classes
  const positionClasses = computed(() => {
    const classMap: Record<PositionType, string> = {
      fixed: 'fixed inset-x-0 bottom-0 z-40 mx-auto',
      sticky: 'sticky inset-x-0 bottom-0 z-40 mx-auto',
      normal: '',
    }
    return classMap[position]
  })

  // Dynamic style for fixed/sticky positioning
  const footerStyle = computed(() => {
    if (position === 'fixed' || position === 'sticky') {
      return { maxWidth: `${config.ui.maxWidth}px` }
    }
    return undefined
  })
</script>

<template>
  <footer :class="[baseClasses, positionClasses, customClass]" :style="footerStyle">
    <slot />
  </footer>
</template>
