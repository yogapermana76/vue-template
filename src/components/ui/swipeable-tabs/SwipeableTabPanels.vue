<script setup lang="ts">
  import { inject, onMounted, onUnmounted, ref, type HTMLAttributes } from 'vue'
  import { useDrag } from '@vueuse/gesture'
  import { cn } from '@/utils/cn'
  import { SWIPEABLE_TABS_INJECTION_KEY, type SwipeableTabsContext } from './types'

  interface Props {
    class?: HTMLAttributes['class']
  }

  const props = defineProps<Props>()

  const context = inject<SwipeableTabsContext>(SWIPEABLE_TABS_INJECTION_KEY)
  if (!context) {
    throw new Error('SwipeableTabPanels must be used within SwipeableTabs')
  }

  const containerRef = ref<HTMLElement | null>(null)
  const panelContainerRef = ref<HTMLElement | null>(null)

  const updateContainerWidth = () => {
    if (containerRef.value) {
      context.setContainerWidth(containerRef.value.offsetWidth)
    }
  }

  onMounted(() => {
    updateContainerWidth()
    window.addEventListener('resize', updateContainerWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateContainerWidth)
  })

  // Setup drag gesture for horizontal swipes only
  useDrag(
    state => {
      const { movement, velocities, dragging, direction, first } = state
      const mx = movement[0]
      const my = movement[1]
      const vx = velocities[0]
      const dx = direction[0]

      // On first move, determine if it's horizontal or vertical
      // If vertical, cancel the gesture to allow scroll
      if (first && Math.abs(my) > Math.abs(mx)) {
        state.cancel()
        return
      }

      if (dragging) {
        if (!context.isDragging.value) {
          context.onDragStart()
        }
        context.onDrag(mx, vx)
      } else {
        // Use velocity with direction for determining swipe intent
        const velocityWithDirection = vx * (dx > 0 ? 1 : -1)
        context.onDragEnd(velocityWithDirection)
      }
    },
    {
      domTarget: panelContainerRef,
      eventOptions: { passive: false },
      filterTaps: true,
      pointer: { touch: true },
      threshold: 10,
    },
  )
</script>

<template>
  <div
    ref="containerRef"
    :class="cn('relative flex-1 overflow-hidden bg-white', props.class)"
    data-slot="swipeable-tab-panels"
  >
    <div
      ref="panelContainerRef"
      class="absolute inset-0 flex"
      :class="!context.isDragging.value && 'transition-transform duration-300 ease-out'"
      :style="{
        transform: `translateX(calc(-${(context.activeIndex.value * 100) / context.tabs.length}% + ${context.translateX.value}px))`,
        width: `${context.tabs.length * 100}%`,
      }"
    >
      <slot />
    </div>
  </div>
</template>
