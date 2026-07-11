export type SheetFooterPosition = 'sticky' | 'static'
export type SheetWidth = 'sm' | 'md' | 'lg' | 'xl'
export type SheetHeaderVariant = 'plain' | 'tinted' | 'hero'
export type SheetDirection = 'left' | 'right'

export interface SideSheetProps {
  /** Which edge the sheet slides in from. */
  direction?: SheetDirection
  /** Whether the sheet is open */
  open?: boolean
  /** Allow dismissing by backdrop click or escape key */
  dismissible?: boolean
  /** Title of the sheet (rendered by built-in header) */
  title?: string
  /** Description text below the title */
  description?: string
  /** Show close button in header */
  showClose?: boolean
  /** Show back arrow at top-left of header. Emits `back` when clicked. */
  showBack?: boolean
  /** Header visual variant */
  headerVariant?: SheetHeaderVariant
  /** Skip built-in header (consumer renders own via #header slot or DetailSheet band) */
  hideHeader?: boolean
  /** Width preset */
  width?: SheetWidth
  /** Class overrides */
  contentClass?: string
  contentSlotClass?: string
  headerClass?: string
  /** Footer configuration */
  hasFooter?: boolean
  footerPosition?: SheetFooterPosition
  footerClass?: string
  /** Mark as a nested sheet pushed on top of a parent sheet. */
  nested?: boolean
}

// Presets omit `direction` — the wrapper hard-codes it.
export type SidePresetProps = Omit<SideSheetProps, 'direction'>
