export type TabTone = 'primary' | 'success' | 'warning' | 'error' | 'neutral'

export interface TabItem<K extends string = string> {
  key: K
  label: string
  /** Optional count badge shown next to the label. */
  count?: number
  /** Optional accent for the count badge. Defaults to `neutral`. */
  countTone?: TabTone
}

// Tailwind classes for the count badge; shared by all tab variants.
export const TAB_COUNT_CLASSES: Record<TabTone, string> = {
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  error: 'bg-error-100 text-error-700',
  neutral: 'bg-neutral-100 text-neutral-700',
}
