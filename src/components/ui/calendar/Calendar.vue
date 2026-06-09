<script setup lang="ts">
  import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
  import {
    CalendarCell,
    CalendarCellTrigger,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHead,
    CalendarGridRow,
    CalendarHeadCell,
    CalendarHeader,
    CalendarHeading,
    CalendarNext,
    CalendarPrev,
    CalendarRoot,
    type CalendarRootEmits,
    type CalendarRootProps,
  } from 'reka-ui'
  import { cn } from '@/utils/cn'

  const props = defineProps<CalendarRootProps>()
  const emits = defineEmits<CalendarRootEmits>()
</script>

<template>
  <CalendarRoot
    v-bind="props"
    v-slot="{ grid, weekDays }"
    @update:model-value="value => emits('update:modelValue', value)"
  >
    <CalendarHeader class="flex items-center justify-between pb-3">
      <CalendarPrev
        :class="
          cn(
            'flex size-8 items-center justify-center rounded-md text-neutral-600 transition-colors outline-none',
            'hover:bg-neutral-100 hover:text-neutral-900',
            'focus-visible:ring-primary-500 focus-visible:ring-2',
            'disabled:pointer-events-none disabled:opacity-50',
          )
        "
      >
        <ChevronLeft class="size-5" />
      </CalendarPrev>

      <CalendarHeading class="text-sm font-semibold text-neutral-900" />

      <CalendarNext
        :class="
          cn(
            'flex size-8 items-center justify-center rounded-md text-neutral-600 transition-colors outline-none',
            'hover:bg-neutral-100 hover:text-neutral-900',
            'focus-visible:ring-primary-500 focus-visible:ring-2',
            'disabled:pointer-events-none disabled:opacity-50',
          )
        "
      >
        <ChevronRight class="size-5" />
      </CalendarNext>
    </CalendarHeader>

    <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="w-full">
      <CalendarGridHead>
        <CalendarGridRow class="flex">
          <CalendarHeadCell
            v-for="day in weekDays"
            :key="day"
            class="w-9 py-1.5 text-center text-xs font-medium text-neutral-500"
          >
            {{ day }}
          </CalendarHeadCell>
        </CalendarGridRow>
      </CalendarGridHead>

      <CalendarGridBody>
        <CalendarGridRow
          v-for="(weekDates, index) in month.rows"
          :key="`week-${index}`"
          class="flex"
        >
          <CalendarCell
            v-for="weekDate in weekDates"
            :key="weekDate.toString()"
            :date="weekDate"
            class="p-0"
          >
            <CalendarCellTrigger
              :day="weekDate"
              :month="month.value"
              :class="
                cn(
                  'flex size-9 items-center justify-center rounded-md text-sm transition-colors outline-none',
                  // Default state
                  'text-neutral-900 hover:bg-neutral-100',
                  // Focus state
                  'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:ring-offset-1',
                  // Selected state
                  'data-selected:bg-primary-600 data-selected:hover:bg-primary-700 data-selected:text-white',
                  // Today state
                  'data-today:text-primary-600 data-today:font-semibold data-selected:data-today:text-white',
                  // Outside view (other months)
                  'data-outside-view:text-neutral-300 data-outside-view:hover:bg-transparent',
                  // Disabled state
                  'data-disabled:pointer-events-none data-disabled:text-neutral-300',
                  // Unavailable state
                  'data-unavailable:pointer-events-none data-unavailable:text-neutral-300 data-unavailable:line-through',
                )
              "
            />
          </CalendarCell>
        </CalendarGridRow>
      </CalendarGridBody>
    </CalendarGrid>

    <!-- Footer slot -->
    <slot name="footer" />
  </CalendarRoot>
</template>
