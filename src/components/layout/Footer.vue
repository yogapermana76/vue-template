<script setup lang="ts">
  import { computed } from 'vue'
  import { useResponsiveMaxWidth, useSafeArea } from '@/composables/ui'

  type PositionType = 'fixed' | 'sticky' | 'static'

  interface Props {
    /** Footer position: fixed at bottom, sticky (stays visible on scroll), or static flow */
    position?: PositionType
    /** Custom CSS classes */
    class?: string
  }

  const { position = 'fixed', class: customClass } = defineProps<Props>()

  const { responsiveMaxWidthStyle } = useResponsiveMaxWidth()
  const { safeAreaBottomStyle } = useSafeArea()

  // Base classes applied to all footer instances
  const baseClasses =
    'flex w-full flex-col items-start gap-3 rounded-t-md border-t border-x border-neutral-200 bg-white px-4 py-3'

  // Position-based classes
  const positionClasses = computed(() => {
    const classMap: Record<PositionType, string> = {
      fixed: 'fixed inset-x-0 bottom-0 z-40 mx-auto',
      sticky: 'sticky inset-x-0 bottom-0 z-40 mx-auto',
      static: '',
    }
    return classMap[position]
  })

  // Dynamic style for fixed/sticky positioning with safe area
  const footerStyle = computed(() => {
    if (position === 'fixed' || position === 'sticky') {
      return {
        ...responsiveMaxWidthStyle.value,
        ...safeAreaBottomStyle.value,
      }
    }
    return undefined
  })
</script>

<template>
  <footer :class="[baseClasses, positionClasses, customClass]" :style="footerStyle">
    <slot />
  </footer>
</template>
