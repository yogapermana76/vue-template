<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { today, getLocalTimeZone } from '@internationalized/date'
  import type { DateValue } from '@internationalized/date'
  import type { DateValue as RekaDateValue } from 'reka-ui'
  import { CalendarRoot, type CalendarRootEmits, type CalendarRootProps } from 'reka-ui'
  import { parseISO, getDaysInMonth, isAfter, isBefore } from 'date-fns'
  import { dateValueToISO } from '@/utils/date'
  import CalendarHolidayLegend from './CalendarHolidayLegend.vue'
  import CalendarHeader from './CalendarHeader.vue'
  import CalendarYearPicker from './CalendarYearPicker.vue'
  import CalendarMonthPicker from './CalendarMonthPicker.vue'
  import CalendarMonthGrid from './CalendarMonthGrid.vue'
  import { useHolidayMap, type HolidayMarker } from './composables/useHolidayMap'

  export type { HolidayMarker }

  interface Props extends CalendarRootProps {
    holidays?: HolidayMarker[]
  }

  // Destructure holidays so it's not forwarded to CalendarRoot via v-bind
  const { holidays, ...calendarProps } = defineProps<Props>()
  const emits = defineEmits<CalendarRootEmits>()

  const { holidayMap } = useHolidayMap(() => holidays)

  type PickerMode = 'month' | 'year' | null
  const pickerMode = ref<PickerMode>(null)
  const internalPlaceholder = ref<DateValue | undefined>(undefined)

  // Cast needed: Volar cannot verify ZonedDateTime #private field compatibility
  // between @internationalized/date and reka-ui's re-exported DateValue.
  const placeholderProps = computed(() =>
    internalPlaceholder.value ? { placeholder: internalPlaceholder.value as RekaDateValue } : {},
  )

  function onPlaceholderChange(date: DateValue) {
    internalPlaceholder.value = date
  }

  function openYearPicker() {
    if (pickerMode.value === 'year') {
      pickerMode.value = null
      return
    }
    if (!internalPlaceholder.value) {
      internalPlaceholder.value = today(getLocalTimeZone())
    }
    pickerMode.value = 'year'
  }

  function onYearSelected(date: DateValue | DateValue[] | undefined) {
    if (!date || Array.isArray(date)) return
    internalPlaceholder.value = date
    pickerMode.value = 'month'
  }

  function onMonthSelected(date: DateValue | DateValue[] | undefined) {
    if (!date || Array.isArray(date)) return
    internalPlaceholder.value = date
    pickerMode.value = null
  }

  function holidaysForGrid(grid: { value: { year: number; month: number } }[]): HolidayMarker[] {
    if (!holidays?.length || !grid.length) return []
    return holidays.filter(h => {
      const hStart = parseISO(h.startDate)
      const hEnd = parseISO(h.endDate)
      return grid.some(({ value: { year, month } }) => {
        // First and last day of the displayed month
        const monthStart = parseISO(dateValueToISO({ year, month, day: 1 }))
        const monthEnd = parseISO(dateValueToISO({ year, month, day: getDaysInMonth(monthStart) }))
        // Holiday overlaps if it starts before/on month end AND ends after/on month start
        return !isAfter(hStart, monthEnd) && !isBefore(hEnd, monthStart)
      })
    })
  }
</script>

<template>
  <CalendarRoot
    v-bind="{ ...calendarProps, ...placeholderProps }"
    v-slot="{ grid, weekDays }"
    locale="id-ID"
    @update:placeholder="onPlaceholderChange"
    @update:model-value="value => emits('update:modelValue', value)"
  >
    <CalendarHeader :picker-mode="pickerMode" @open-year-picker="openYearPicker" />

    <!-- Year picker overlay (shown first) -->
    <CalendarYearPicker
      v-if="pickerMode === 'year'"
      :placeholder-props="placeholderProps"
      @update:model-value="onYearSelected"
    />

    <!-- Month picker overlay (shown after year is selected) -->
    <CalendarMonthPicker
      v-else-if="pickerMode === 'month'"
      :placeholder-props="placeholderProps"
      @update:model-value="onMonthSelected"
      @back-to-year="pickerMode = 'year'"
    />

    <!-- Calendar grid (hidden when picker overlay is open) -->
    <template v-else>
      <CalendarMonthGrid
        v-for="month in grid"
        :key="month.value.toString()"
        :month="month"
        :week-days="weekDays"
        :holiday-map="holidayMap"
      />

      <!-- Holiday legend — filtered to only show holidays visible in the current month view -->
      <CalendarHolidayLegend v-if="holidays?.length" :holidays="holidaysForGrid(grid)" />

      <!-- Footer slot -->
      <slot name="footer" />
    </template>
  </CalendarRoot>
</template>
