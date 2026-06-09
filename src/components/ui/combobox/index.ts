// Headless components (with trigger slot for custom triggers)
export { default as SearchableSelect } from './SearchableSelect.vue'
export { default as MultiSelect } from './MultiSelect.vue'

// Field components (with FormField wrapper for form usage)
export { default as SearchableSelectField } from './composite/SearchableSelectField.vue'
export { default as MultiSelectField } from './composite/MultiSelectField.vue'

// Types
export type { SearchableSelectProps } from './SearchableSelect.vue'
export type { MultiSelectProps } from './MultiSelect.vue'
export type { SearchableSelectFieldProps } from './composite/SearchableSelectField.vue'
export type { MultiSelectFieldProps } from './composite/MultiSelectField.vue'
export type { ComboboxOption, ComboboxGroup, ComboboxFilterFunction } from './types'
