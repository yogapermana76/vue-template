<script setup lang="ts">
  import { computed, inject, ref, watch, type HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { SWIPEABLE_TABS_INJECTION_KEY, type SwipeableTabsContext } from './types'

  interface Props {
    value: string
    class?: HTMLAttributes['class']
    lazy?: boolean
    noPadding?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    lazy: false,
    noPadding: false,
  })

  const context = inject<SwipeableTabsContext>(SWIPEABLE_TABS_INJECTION_KEY)
  if (!context) throw new Error('SwipeableTabPanel must be used within SwipeableTabs')

  const isActive = computed(() => context.activeTab.value === props.value)

  const hasBeenActive = ref(isActive.value)
  watch(isActive, active => {
    if (active) hasBeenActive.value = true
  })

  const shouldRender = computed(() => !props.lazy || hasBeenActive.value)

  // Scroll-flow mode: collapse inactive panels when not dragging to prevent affecting wrapper height
  const shouldCollapse = computed(
    () => context.scrollFlow && !isActive.value && !context.isDragging.value,
  )

  const panelWidth = computed(() => `${100 / context.tabs.length}%`)
</script>

<template>
  <div
    :class="
      cn(
        'h-full w-full shrink-0',
        !context.scrollFlow && 'overflow-y-auto overscroll-contain',
        shouldCollapse && 'pointer-events-none max-h-0 overflow-hidden opacity-0',
        !noPadding && 'p-4',
        props.class,
      )
    "
    :style="{ width: panelWidth }"
    :data-state="isActive ? 'active' : 'inactive'"
    data-slot="swipeable-tab-panel"
  >
    <template v-if="shouldRender">
      <slot :is-active="isActive" />
    </template>
  </div>
</template>
