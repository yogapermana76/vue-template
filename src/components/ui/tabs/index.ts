// Shared primitives
export { default as TabButton } from './TabButton.vue'
export type { TabItem, TabTone } from './types'
export { TAB_COUNT_CLASSES } from './types'

// Composables
export {
  useAnimatedTabIndicator,
  type UseAnimatedTabIndicatorOptions,
  type IndicatorRect,
} from './useAnimatedTabIndicator'

// Tab bar variants
export { default as UnderlineTabs } from './UnderlineTabs.vue'
export { default as AnimatedUnderlineTabs } from './AnimatedUnderlineTabs.vue'

// Backward-compat type aliases (previously named per-component).
export type { TabItem as UnderlineTabItem } from './types'
export type { TabItem as AnimatedUnderlineTabItem } from './types'
