<script setup lang="ts">
  import { inject, onMounted, onUnmounted, ref, type HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { SWIPEABLE_TABS_INJECTION_KEY, type SwipeableTabsContext } from './types'
  import type { TabItem } from '@/composables/ui'

  interface Props {
    class?: HTMLAttributes['class']
    indicatorClass?: HTMLAttributes['class']
  }

  const props = defineProps<Props>()

  const context = inject<SwipeableTabsContext>(SWIPEABLE_TABS_INJECTION_KEY)
  if (!context) {
    throw new Error('SwipeableTabBar must be used within SwipeableTabs')
  }

  const tabBarRef = ref<HTMLElement | null>(null)
  const tabRefs = ref<HTMLElement[]>([])

  const setTabRef = (el: HTMLElement | null, index: number) => {
    if (el) {
      tabRefs.value[index] = el
    }
  }

  const updateMeasurements = () => {
    if (tabBarRef.value) {
      context.setContainerWidth(tabBarRef.value.offsetWidth)
    }
    // Use offsetLeft for accurate position (includes padding)
    const offsets = tabRefs.value.map(el => el?.offsetLeft || 0)
    const widths = tabRefs.value.map(el => el?.offsetWidth || 0)
    context.setTabOffsets(offsets)
    context.setTabWidths(widths)
  }

  onMounted(() => {
    updateMeasurements()
    window.addEventListener('resize', updateMeasurements)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateMeasurements)
  })

  const handleTabClick = (key: string) => {
    context.setActiveTab(key)
  }

  defineSlots<{
    default?: (props: { tab: TabItem; isActive: boolean }) => unknown
  }>()
</script>

<template>
  <div
    ref="tabBarRef"
    :class="
      cn(
        'sticky top-0 z-40 flex w-full shrink-0 gap-5 border-b border-slate-200 bg-white px-4',
        props.class,
      )
    "
    data-slot="swipeable-tab-bar"
  >
    <button
      v-for="(tab, index) in context.tabs"
      :key="tab.key"
      :ref="el => setTabRef(el as HTMLElement, index)"
      type="button"
      :class="
        cn(
          'body-m-semibold relative shrink-0 py-3 transition-colors',
          context.activeTab.value === tab.key
            ? 'text-primary-700'
            : 'text-slate-500 hover:text-slate-600',
        )
      "
      @click="handleTabClick(tab.key)"
    >
      <span class="inline-flex items-center gap-1">
        <slot :tab="tab" :is-active="context.activeTab.value === tab.key">
          {{ tab.label }}
        </slot>
      </span>
    </button>

    <!-- Animated Indicator -->
    <div
      :class="
        cn(
          'bg-primary-600 absolute bottom-0 h-1 rounded-t-sm',
          !context.isDragging.value && 'transition-all duration-300 ease-out',
          props.indicatorClass,
        )
      "
      :style="context.indicatorStyle.value"
    />
  </div>
</template>
