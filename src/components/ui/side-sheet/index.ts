// Base — accepts `direction: 'left' | 'right'`.
export { default as SideSheet } from './SideSheet.vue'

// Presets over SideSheet (hardcoded direction).
export { default as RightSheet } from './RightSheet.vue'
export { default as LeftSheet } from './LeftSheet.vue'

export { default as SheetHeader } from './SheetHeader.vue'

export type {
  SheetDirection,
  SheetFooterPosition,
  SheetHeaderVariant,
  SheetWidth,
  SideSheetProps,
  SidePresetProps,
} from './types'

// Composite-tier (patterns built on top of the primitives above)
export * from './composite'
