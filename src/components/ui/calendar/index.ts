export { default as Calendar } from './Calendar.vue'
export { default as RangeCalendar, type RangeCalendarProps } from './RangeCalendar.vue'
export type { HolidayMarker } from './composables/useHolidayMap'

// Composites (patterns built on top of the primitives above)
export * from './composite'
