<script setup lang="ts">
  import type { HTMLAttributes, CSSProperties } from 'vue'
  import { provide, computed } from 'vue'
  import { useSwipeableTabs } from '@/composables/ui'
  import { cn } from '@/utils/cn'
  import {
    SWIPEABLE_TABS_INJECTION_KEY,
    type SwipeableTabsProps,
    type SwipeableTabsContext,
  } from './types'

  interface Props extends SwipeableTabsProps {
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<Props>(), {
    swipeThreshold: 50,
    swipeVelocityThreshold: 0.3,
    heightOffset: '0px',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    change: [value: string]
  }>()

  // Composable
  const swipeableTabs = useSwipeableTabs({
    tabs: props.tabs,
    defaultTab: props.modelValue || props.defaultTab,
    swipeThreshold: props.swipeThreshold,
    swipeVelocityThreshold: props.swipeVelocityThreshold,
  })

  // Computed
  const containerStyle = computed<CSSProperties>(() => ({
    height: `calc(100dvh - ${props.heightOffset})`,
  }))

  // Methods
  const setActiveTab = (key: string) => {
    swipeableTabs.setActiveTab(key)
    emit('update:modelValue', key)
    emit('change', key)
  }

  const setActiveIndex = (index: number) => {
    swipeableTabs.setActiveIndex(index)
    emit('update:modelValue', swipeableTabs.activeTab.value)
    emit('change', swipeableTabs.activeTab.value)
  }

  // Context
  const context: SwipeableTabsContext = {
    tabs: props.tabs,
    ...swipeableTabs,
    setActiveTab,
    setActiveIndex,
  }

  provide(SWIPEABLE_TABS_INJECTION_KEY, context)

  defineExpose({
    activeTab: swipeableTabs.activeTab,
    activeIndex: swipeableTabs.activeIndex,
    setActiveTab,
    setActiveIndex,
  })
</script>

<template>
  <div
    :class="cn('swipeable-tabs flex flex-col', props.class)"
    :style="containerStyle"
    data-slot="swipeable-tabs"
  >
    <slot />
  </div>
</template>
