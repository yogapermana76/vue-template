import type { InjectionKey, ComputedRef, Ref } from 'vue'
import type { TabItem } from '@/composables/ui'

export interface SwipeableTabsProps {
  tabs: TabItem[]
  defaultTab?: string
  modelValue?: string
  swipeThreshold?: number
  swipeVelocityThreshold?: number
  /** Offset from viewport height (e.g., '3.5rem' for header, '5rem' for bottom nav). Default: '0px' */
  heightOffset?: string
}

export interface SwipeableTabsContext {
  tabs: TabItem[]
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

export const SWIPEABLE_TABS_INJECTION_KEY: InjectionKey<SwipeableTabsContext> =
  Symbol('swipeable-tabs')
