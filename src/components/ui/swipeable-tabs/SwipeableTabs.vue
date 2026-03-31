<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { provide } from 'vue'
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
    fullHeight: false,
    fullHeightOffset: '7.5rem',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    change: [value: string]
  }>()

  const swipeableTabs = useSwipeableTabs({
    tabs: props.tabs,
    defaultTab: props.modelValue || props.defaultTab,
    swipeThreshold: props.swipeThreshold,
    swipeVelocityThreshold: props.swipeVelocityThreshold,
  })

  // Wrap setActiveTab to sync with v-model
  const setActiveTab = (key: string) => {
    swipeableTabs.setActiveTab(key)
    emit('update:modelValue', key)
    emit('change', key)
  }

  // Wrap setActiveIndex to sync with v-model
  const setActiveIndex = (index: number) => {
    swipeableTabs.setActiveIndex(index)
    emit('update:modelValue', swipeableTabs.activeTab.value)
    emit('change', swipeableTabs.activeTab.value)
  }

  const context: SwipeableTabsContext = {
    tabs: props.tabs,
    activeTab: swipeableTabs.activeTab,
    activeIndex: swipeableTabs.activeIndex,
    translateX: swipeableTabs.translateX,
    isDragging: swipeableTabs.isDragging,
    indicatorStyle: swipeableTabs.indicatorStyle,
    setActiveTab,
    setActiveIndex,
    onDragStart: swipeableTabs.onDragStart,
    onDrag: swipeableTabs.onDrag,
    onDragEnd: swipeableTabs.onDragEnd,
    getTabWidth: swipeableTabs.getTabWidth,
    setContainerWidth: swipeableTabs.setContainerWidth,
    setTabWidths: swipeableTabs.setTabWidths,
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
    :class="cn('swipeable-tabs flex flex-col', fullHeight && 'overflow-hidden', props.class)"
    :style="fullHeight ? { height: `calc(100dvh - ${fullHeightOffset})` } : undefined"
    data-slot="swipeable-tabs"
  >
    <slot />
  </div>
</template>
