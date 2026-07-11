<script setup lang="ts">
  /**
   * Range calendar primitive — sibling of `Calendar.vue`.
   *
   * Wraps reka-ui's `RangeCalendarRoot` with our design-system styling
   * (rounded cells, primary highlight, month header controls). Kept
   * *presentation-only*: no popover, no input, no external state — those
   * concerns live in higher-level composites like `DateRangePickerField`.
   *
   * Usage:
   *   <RangeCalendar v-model="range" :number-of-months="2" locale="id-ID" />
   *
   * The reason this exists as its own component (rather than living inline
   * inside `DateRangePickerField`) is so it can be reused headlessly in
   * modals, inline filters, or wizard steps without dragging the popover
   * + input shell along.
   */
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import type { DateRange } from 'reka-ui'
  import {
    RangeCalendarRoot,
    RangeCalendarGrid,
    RangeCalendarGridBody,
    RangeCalendarGridHead,
    RangeCalendarGridRow,
    RangeCalendarHeadCell,
    RangeCalendarHeader,
    RangeCalendarHeading,
    RangeCalendarNext,
    RangeCalendarPrev,
    RangeCalendarCell,
    RangeCalendarCellTrigger,
  } from 'reka-ui'
  import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'

  export interface RangeCalendarProps {
    /** Range value (v-model). */
    modelValue?: DateRange
    /** BCP-47 locale for month/weekday headings. Default: 'id-ID'. */
    locale?: string
    /** Number of month grids shown side-by-side. Default: 2. */
    numberOfMonths?: number
    /** Day the week starts on (0 = Sunday, 1 = Monday, …). Default: 1. */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    /** Weekday header format. Default: 'short'. */
    weekdayFormat?: 'narrow' | 'short' | 'long'
    /** Additional class on the root grid wrapper. */
    class?: HTMLAttributes['class']
    /** Disable calendar interaction entirely. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<RangeCalendarProps>(), {
    locale: 'id-ID',
    numberOfMonths: 2,
    weekStartsOn: 1,
    weekdayFormat: 'short',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: DateRange]
  }>()

  const value = computed<DateRange>({
    get: () => props.modelValue ?? { start: undefined, end: undefined },
    set: v => emit('update:modelValue', v),
  })
</script>

<template>
  <RangeCalendarRoot
    v-slot="{ weekDays, grid }"
    :model-value="value"
    :locale="locale"
    :number-of-months="numberOfMonths"
    :week-starts-on="weekStartsOn"
    :weekday-format="weekdayFormat"
    :disabled="disabled"
    :class="cn('flex flex-col gap-4 sm:flex-row', props.class)"
    @update:model-value="v => (value = v)"
  >
    <div v-for="month in grid" :key="month.value.toString()" class="flex flex-col gap-3">
      <RangeCalendarHeader class="flex items-center justify-between px-1">
        <RangeCalendarPrev
          class="flex size-7 items-center justify-center rounded-md text-neutral-600 transition hover:bg-neutral-100"
        >
          <ChevronLeft class="size-4" />
        </RangeCalendarPrev>
        <RangeCalendarHeading class="body-m-semibold text-neutral-950 capitalize" />
        <RangeCalendarNext
          class="flex size-7 items-center justify-center rounded-md text-neutral-600 transition hover:bg-neutral-100"
        >
          <ChevronRight class="size-4" />
        </RangeCalendarNext>
      </RangeCalendarHeader>

      <RangeCalendarGrid class="w-full border-collapse select-none">
        <RangeCalendarGridHead>
          <RangeCalendarGridRow class="flex">
            <RangeCalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="text-xxs flex w-9 items-center justify-center font-medium text-neutral-500 uppercase"
            >
              {{ day }}
            </RangeCalendarHeadCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody>
          <RangeCalendarGridRow
            v-for="(weekDates, idx) in month.rows"
            :key="`week-${idx}`"
            class="flex w-full"
          >
            <RangeCalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              class="relative size-9 p-0 text-center text-sm text-neutral-950 data-outside-view:text-neutral-300"
            >
              <RangeCalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                class="hover:bg-primary-100 data-selection-end:bg-primary-600 data-selection-start:bg-primary-600 data-selection-end:hover:bg-primary-700 data-selection-start:hover:bg-primary-700 data-highlighted:bg-primary-100 data-selected:bg-primary-100 flex size-9 items-center justify-center rounded-full transition data-disabled:pointer-events-none data-disabled:opacity-40 data-selection-end:text-white data-selection-start:text-white"
              />
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </div>
  </RangeCalendarRoot>
</template>
