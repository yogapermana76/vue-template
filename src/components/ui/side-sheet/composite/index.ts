export { default as DetailSheet } from './DetailSheet.vue'
export { default as CrudFormSheet } from './CrudFormSheet.vue'
export { default as FormSection } from './FormSection.vue'
// DetailSection + DetailField moved to `@/components/shared` — they're
// now sheet-agnostic and consumed from dialogs, cards, and pages too.
export { DetailSection, DetailField } from '@/components/shared'
