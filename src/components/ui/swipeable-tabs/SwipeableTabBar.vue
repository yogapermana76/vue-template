<script setup lang="ts">
  import {
    inject,
    onMounted,
    onUnmounted,
    ref,
    watch,
    nextTick,
    computed,
    type HTMLAttributes,
  } from 'vue'
  import { cn } from '@/utils/cn'
  import { SWIPEABLE_TABS_INJECTION_KEY, type SwipeableTabsContext } from './types'
  import type { TabItem } from '@/composables/ui'

  interface Props {
    class?: HTMLAttributes['class']
    indicatorClass?: HTMLAttributes['class']
    /** Max number of tabs to apply equal width. Set > 0 to enable equal width for small tab counts. Default: 0 (content-based) */
    equalWidthMaxTabs?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    equalWidthMaxTabs: 0,
  })

  const context = inject<SwipeableTabsContext>(SWIPEABLE_TABS_INJECTION_KEY)
  if (!context) {
    throw new Error('SwipeableTabBar must be used within SwipeableTabs')
  }

  const tabBarRef = ref<HTMLElement | null>(null)
  const tabRefs = ref<HTMLElement[]>([])
  let resizeObserver: ResizeObserver | null = null

  // Computed
  const useEqualWidth = computed(() => context.tabs.length <= props.equalWidthMaxTabs)

  const containerClass = computed(() =>
    cn(
      'relative z-40 flex w-full shrink-0 border-b border-slate-200 bg-white px-4',
      useEqualWidth.value ? 'gap-0' : 'gap-5 overflow-x-auto scrollbar-none',
      props.class,
    ),
  )

  const indicatorClass = computed(() =>
    cn(
      'bg-primary-600 absolute bottom-0 h-1 rounded-t-sm',
      !context.isDragging.value && 'transition-all duration-300 ease-out',
      props.indicatorClass,
    ),
  )

  const getTabClass = (isActive: boolean) =>
    cn(
      'body-m-semibold relative py-3 transition-colors',
      useEqualWidth.value ? 'flex-1 text-center' : 'shrink-0',
      isActive ? 'text-primary-700' : 'text-slate-500 hover:text-slate-600',
    )

  // Methods
  const setTabRef = (el: HTMLElement | null, index: number) => {
    if (el) tabRefs.value[index] = el
  }

  const updateMeasurements = () => {
    if (tabBarRef.value) {
      context.setContainerWidth(tabBarRef.value.offsetWidth)
    }
    context.setTabOffsets(tabRefs.value.map(el => el?.offsetLeft ?? 0))
    context.setTabWidths(tabRefs.value.map(el => el?.offsetWidth ?? 0))
  }

  const scrollToActiveTab = (index: number) => {
    const tabBar = tabBarRef.value
    const activeTabEl = tabRefs.value[index]
    if (!tabBar || !activeTabEl) return

    const scrollTarget = activeTabEl.offsetLeft - (tabBar.offsetWidth - activeTabEl.offsetWidth) / 2
    tabBar.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' })
  }

  // Lifecycle
  onMounted(() => {
    updateMeasurements()
    window.addEventListener('resize', updateMeasurements)

    // Use ResizeObserver to detect tab content changes (e.g., when badges appear)
    resizeObserver = new ResizeObserver(() => {
      updateMeasurements()
    })

    // Observe all tab elements for size changes
    tabRefs.value.forEach(el => {
      if (el) resizeObserver?.observe(el)
    })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateMeasurements)
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  // Watchers
  watch(context.activeIndex, index => {
    nextTick(() => scrollToActiveTab(index))
  })

  defineSlots<{
    default?: (props: { tab: TabItem; isActive: boolean }) => unknown
  }>()
</script>

<template>
  <div ref="tabBarRef" :class="containerClass" data-slot="swipeable-tab-bar">
    <button
      v-for="(tab, index) in context.tabs"
      :key="tab.key"
      :ref="el => setTabRef(el as HTMLElement, index)"
      type="button"
      :class="getTabClass(context.activeTab.value === tab.key)"
      @click="context.setActiveTab(tab.key)"
    >
      <span class="inline-flex items-center gap-1">
        <slot :tab="tab" :is-active="context.activeTab.value === tab.key">
          {{ tab.label }}
        </slot>
      </span>
    </button>

    <!-- Indicator -->
    <div :class="indicatorClass" :style="context.indicatorStyle.value" />
  </div>
</template>
