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

  const updateTabWidths = () => {
    if (tabBarRef.value) {
      context.setContainerWidth(tabBarRef.value.offsetWidth)
    }
    const widths = tabRefs.value.map(el => el?.offsetWidth || 0)
    context.setTabWidths(widths)
  }

  onMounted(() => {
    updateTabWidths()
    window.addEventListener('resize', updateTabWidths)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateTabWidths)
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
    :class="cn('border-border bg-background relative flex w-full shrink-0 border-b', props.class)"
    data-slot="swipeable-tab-bar"
  >
    <button
      v-for="(tab, index) in context.tabs"
      :key="tab.key"
      :ref="el => setTabRef(el as HTMLElement, index)"
      type="button"
      :class="
        cn(
          'relative flex-1 px-4 py-3 text-center text-sm font-medium transition-colors',
          context.activeTab.value === tab.key
            ? 'text-primary-600 font-semibold'
            : 'text-neutral-400 hover:text-neutral-600',
        )
      "
      @click="handleTabClick(tab.key)"
    >
      <span class="relative inline-flex items-center justify-center gap-1">
        <slot :tab="tab" :is-active="context.activeTab.value === tab.key">
          {{ tab.label }}
        </slot>
      </span>
    </button>

    <!-- Animated Indicator -->
    <div
      :class="
        cn(
          'bg-primary-500 absolute bottom-0 h-1 rounded-t-full',
          !context.isDragging.value && 'transition-all duration-300 ease-out',
          props.indicatorClass,
        )
      "
      :style="context.indicatorStyle.value"
    />
  </div>
</template>
