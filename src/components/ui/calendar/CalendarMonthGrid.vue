<script setup lang="ts">
  import type { DateValue } from 'reka-ui'
  import {
    CalendarCell,
    CalendarCellTrigger,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHead,
    CalendarGridRow,
    CalendarHeadCell,
  } from 'reka-ui'
  import { dateValueToISO } from '@/utils/date'
  import { cellClass } from './composables/useCalendarClasses'

  defineProps<{
    month: { value: DateValue; rows: DateValue[][] }
    weekDays: string[]
    holidayMap: Map<string, string>
  }>()
</script>

<template>
  <CalendarGrid class="w-full">
    <CalendarGridHead>
      <CalendarGridRow class="flex w-full">
        <CalendarHeadCell
          v-for="day in weekDays"
          :key="day"
          class="flex-1 py-1.5 text-center text-xs font-medium text-neutral-500"
        >
          {{ day }}
        </CalendarHeadCell>
      </CalendarGridRow>
    </CalendarGridHead>

    <CalendarGridBody>
      <CalendarGridRow
        v-for="(weekDates, index) in month.rows"
        :key="`week-${index}`"
        class="mt-1 flex w-full"
      >
        <CalendarCell
          v-for="weekDate in weekDates"
          :key="weekDate.toString()"
          :date="weekDate"
          class="relative flex-1 py-1"
        >
          <CalendarCellTrigger
            :day="weekDate"
            :month="month.value"
            :class="cellClass(holidayMap.has(dateValueToISO(weekDate)))"
          />
        </CalendarCell>
      </CalendarGridRow>
    </CalendarGridBody>
  </CalendarGrid>
</template>
