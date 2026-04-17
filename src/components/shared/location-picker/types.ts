import type { HTMLAttributes } from 'vue'
import type { Province, City, District } from '@/types'

/** Location level in the hierarchy */
export type LocationLevel = 'province' | 'city' | 'district'

/** Generic location item that can be Province, City, or District */
export type LocationItem = Province | City | District

/**
 * Selected location IDs
 * All IDs are strings for consistency with API responses
 */
export interface SelectedLocation {
  /** Selected province ID (string) */
  provinceId?: string
  /** Selected city ID (string) */
  cityId?: string
  /** Selected district ID (string) */
  districtId?: string
}

/** LocationPicker component props */
export interface LocationPickerProps {
  /** Whether the picker is open */
  open: boolean
  /** Previously selected location */
  selectedLocation?: SelectedLocation
  /** Custom title */
  title?: string
  /** Custom class for the container */
  class?: HTMLAttributes['class']
}

/** LocationPicker component emits */
export interface LocationPickerEmits {
  /** Emitted when open state changes */
  'update:open': [value: boolean]
  /** Emitted when location is saved */
  save: [selection: SelectedLocation]
}

/** Grouped location items by first letter */
export interface LocationGroup<T = LocationItem> {
  letter: string
  items: T[]
}

/** LocationField component props */
export interface LocationFieldProps {
  /** v-model value */
  modelValue?: SelectedLocation
  /** Field label */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Picker modal title */
  pickerTitle?: string
  /** Show required indicator (*) */
  required?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Error message */
  error?: string | string[]
  /** Helper text */
  helper?: string
  /** Additional CSS classes */
  class?: HTMLAttributes['class']
  /** Province names map for display (id -> name) */
  provinceNames?: Record<string, string>
  /** City names map for display (id -> name) */
  cityNames?: Record<string, string>
  /** District names map for display (id -> name) */
  districtNames?: Record<string, string>
}
