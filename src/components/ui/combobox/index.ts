// Primitive-tier: Headless components (with trigger slot for custom triggers)
export { default as SearchableSelect } from './SearchableSelect.vue'
export { default as MultiSelect } from './MultiSelect.vue'

// Composite-tier: Field components (with FormField wrapper for form usage)
export * from './composite'

// Types
export type { SearchableSelectProps } from './SearchableSelect.vue'
export type { MultiSelectProps } from './MultiSelect.vue'
export type { ComboboxOption, ComboboxGroup, ComboboxFilterFunction } from './types'
