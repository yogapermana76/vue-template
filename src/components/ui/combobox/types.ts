import type { BadgeVariants } from '../badge'

export interface ComboboxOption<T = string> {
  /** Unique value for the option */
  value: T
  /** Display label for the option */
  label: string
  /** Optional description text */
  description?: string
  /** Optional badge configuration for status options */
  badge?: {
    label: string
    variant?: BadgeVariants['variant']
  }
  /** Whether the option is disabled */
  disabled?: boolean
  /** Optional icon component or name */
  icon?: string | object
  /** Optional group identifier */
  group?: string
}

export interface ComboboxGroup<T = string> {
  /** Group identifier */
  id: string
  /** Group label */
  label: string
  /** Options in this group */
  options: ComboboxOption<T>[]
}

export type ComboboxFilterFunction<T = string> = (
  options: ComboboxOption<T>[],
  searchTerm: string,
) => ComboboxOption<T>[]
