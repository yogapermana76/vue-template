<script setup lang="ts">
  import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
  import {
    YearPickerRoot,
    YearPickerHeader,
    YearPickerHeading,
    YearPickerNext,
    YearPickerPrev,
    YearPickerGrid,
    YearPickerGridBody,
    YearPickerGridRow,
    YearPickerCell,
    YearPickerCellTrigger,
  } from 'reka-ui'
  import type { DateValue } from 'reka-ui'
  import { navButtonClasses, pickerCellTriggerClass } from './composables/useCalendarClasses'

  defineProps<{
    placeholderProps: Record<string, unknown>
  }>()

  const emit = defineEmits<{
    'update:modelValue': [date: DateValue | DateValue[] | undefined]
  }>()
</script>

<template>
  <!-- Year picker overlay (shown first) -->
  <div class="py-2">
    <YearPickerRoot
      v-bind="placeholderProps"
      :years-per-page="12"
      class="w-full"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <template #default="{ grid: yearGrid }">
        <YearPickerHeader class="mb-3 flex items-center justify-between">
          <YearPickerPrev :class="navButtonClasses">
            <ChevronLeft class="size-4" />
          </YearPickerPrev>
          <YearPickerHeading
            v-slot="{ headingValue }"
            class="text-sm font-semibold text-neutral-700"
          >
            {{ headingValue }}
          </YearPickerHeading>
          <YearPickerNext :class="navButtonClasses">
            <ChevronRight class="size-4" />
          </YearPickerNext>
        </YearPickerHeader>
        <YearPickerGrid class="w-full">
          <YearPickerGridBody>
            <YearPickerGridRow
              v-for="(row, rowIndex) in yearGrid.rows"
              :key="rowIndex"
              class="mb-2 flex gap-2"
            >
              <YearPickerCell
                v-for="yearDate in row"
                :key="yearDate.toString()"
                :date="yearDate"
                class="flex-1"
              >
                <YearPickerCellTrigger :year="yearDate" :class="pickerCellTriggerClass" />
              </YearPickerCell>
            </YearPickerGridRow>
          </YearPickerGridBody>
        </YearPickerGrid>
      </template>
    </YearPickerRoot>
  </div>
</template>
