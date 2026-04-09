import { computed, ref, watch, type Ref, type ComputedRef } from 'vue'

export interface TabItem {
  key: string
  label: string
}

export interface UseSwipeableTabsOptions {
  tabs: TabItem[]
  defaultTab?: string
  swipeThreshold?: number
  swipeVelocityThreshold?: number
}

export interface UseSwipeableTabsReturn {
  activeTab: Ref<string>
  activeIndex: ComputedRef<number>
  translateX: Ref<number>
  isDragging: Ref<boolean>
  indicatorStyle: ComputedRef<{ left: string; width: string }>
  setActiveTab: (key: string) => void
  setActiveIndex: (index: number) => void
  onDragStart: () => void
  onDrag: (deltaX: number, velocity: number) => void
  onDragEnd: (velocity: number) => void
  getTabWidth: () => number
  setContainerWidth: (width: number) => void
  setTabWidths: (widths: number[]) => void
  setTabOffsets: (offsets: number[]) => void
}

export function useSwipeableTabs(options: UseSwipeableTabsOptions): UseSwipeableTabsReturn {
  const { tabs, defaultTab, swipeThreshold = 50, swipeVelocityThreshold = 0.3 } = options

  const activeTab = ref(defaultTab || tabs[0]?.key || '')
  const activeIndex = computed(() => tabs.findIndex(tab => tab.key === activeTab.value))
  const translateX = ref(0)
  const isDragging = ref(false)
  const containerWidth = ref(0)
  const tabWidths = ref<number[]>([])
  const tabOffsets = ref<number[]>([])

  const getTabWidth = () => {
    if (containerWidth.value === 0) return 0
    return containerWidth.value / tabs.length
  }

  const setContainerWidth = (width: number) => {
    containerWidth.value = width
  }

  const setTabWidths = (widths: number[]) => {
    tabWidths.value = widths
  }

  const setTabOffsets = (offsets: number[]) => {
    tabOffsets.value = offsets
  }

  // Indicator uses offsetLeft directly - simple and accurate
  const indicatorStyle = computed(() => {
    if (tabWidths.value.length === 0 || tabOffsets.value.length === 0) {
      return { left: '0px', width: '0px' }
    }

    const currentWidth = tabWidths.value[activeIndex.value] || 0
    const currentLeft = tabOffsets.value[activeIndex.value] || 0

    // Calculate drag progress
    const dragProgress = containerWidth.value > 0 ? -translateX.value / containerWidth.value : 0

    // Interpolate position during drag
    let left = currentLeft
    if (dragProgress > 0 && activeIndex.value < tabs.length - 1) {
      const nextLeft = tabOffsets.value[activeIndex.value + 1] || 0
      left = currentLeft + dragProgress * (nextLeft - currentLeft)
    } else if (dragProgress < 0 && activeIndex.value > 0) {
      const prevLeft = tabOffsets.value[activeIndex.value - 1] || 0
      left = currentLeft + dragProgress * (currentLeft - prevLeft)
    }

    return {
      left: `${left}px`,
      width: `${currentWidth}px`,
    }
  })

  const setActiveTab = (key: string) => {
    activeTab.value = key
    translateX.value = 0
  }

  const setActiveIndex = (index: number) => {
    if (index >= 0 && index < tabs.length) {
      activeTab.value = tabs[index].key
      translateX.value = 0
    }
  }

  const onDragStart = () => {
    isDragging.value = true
  }

  const onDrag = (deltaX: number, _velocity: number) => {
    // Limit drag to prevent over-scrolling
    const maxDrag = containerWidth.value
    const minDrag = -containerWidth.value

    // Add resistance at boundaries
    let newTranslateX = deltaX

    // At first tab, add resistance when swiping right
    if (activeIndex.value === 0 && deltaX > 0) {
      newTranslateX = deltaX * 0.3
    }

    // At last tab, add resistance when swiping left
    if (activeIndex.value === tabs.length - 1 && deltaX < 0) {
      newTranslateX = deltaX * 0.3
    }

    translateX.value = Math.max(minDrag, Math.min(maxDrag, newTranslateX))
  }

  const onDragEnd = (velocity: number) => {
    isDragging.value = false

    const shouldSwipe =
      Math.abs(translateX.value) > swipeThreshold || Math.abs(velocity) > swipeVelocityThreshold

    if (shouldSwipe) {
      if (translateX.value < 0 && activeIndex.value < tabs.length - 1) {
        // Swipe left - go to next tab
        setActiveIndex(activeIndex.value + 1)
      } else if (translateX.value > 0 && activeIndex.value > 0) {
        // Swipe right - go to previous tab
        setActiveIndex(activeIndex.value - 1)
      } else {
        // Bounce back
        translateX.value = 0
      }
    } else {
      // Bounce back
      translateX.value = 0
    }
  }

  // Reset translateX when activeTab changes externally
  watch(activeTab, () => {
    if (!isDragging.value) {
      translateX.value = 0
    }
  })

  return {
    activeTab,
    activeIndex,
    translateX,
    isDragging,
    indicatorStyle,
    setActiveTab,
    setActiveIndex,
    onDragStart,
    onDrag,
    onDragEnd,
    getTabWidth,
    setContainerWidth,
    setTabWidths,
    setTabOffsets,
  }
}
