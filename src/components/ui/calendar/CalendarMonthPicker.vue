<script setup lang="ts">
  import { ChevronLeft } from 'lucide-vue-next'
  import {
    MonthPickerRoot,
    MonthPickerHeader,
    MonthPickerHeading,
    MonthPickerGrid,
    MonthPickerGridBody,
    MonthPickerGridRow,
    MonthPickerCell,
    MonthPickerCellTrigger,
  } from 'reka-ui'
  import type { DateValue } from 'reka-ui'
  import { navButtonClasses, pickerCellTriggerClass } from './composables/useCalendarClasses'

  defineProps<{
    placeholderProps: Record<string, unknown>
  }>()

  const emit = defineEmits<{
    'update:modelValue': [date: DateValue | DateValue[] | undefined]
    backToYear: []
  }>()
</script>

<template>
  <!-- Month picker overlay (shown after year is selected) -->
  <div class="py-2">
    <MonthPickerRoot
      v-bind="placeholderProps"
      locale="id-ID"
      class="w-full"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <template #default="{ grid: monthGrid }">
        <MonthPickerHeader class="mb-3 flex items-center justify-between">
          <button type="button" :class="navButtonClasses" @click="emit('backToYear')">
            <ChevronLeft class="size-4" />
          </button>
          <MonthPickerHeading
            v-slot="{ headingValue }"
            class="text-sm font-semibold text-neutral-700"
          >
            {{ headingValue }}
          </MonthPickerHeading>
          <div class="h-10 w-10" />
        </MonthPickerHeader>
        <MonthPickerGrid class="w-full">
          <MonthPickerGridBody>
            <MonthPickerGridRow
              v-for="(row, rowIndex) in monthGrid.rows"
              :key="rowIndex"
              class="mb-2 flex gap-2"
            >
              <MonthPickerCell
                v-for="monthDate in row"
                :key="monthDate.toString()"
                :date="monthDate"
                class="flex-1"
              >
                <MonthPickerCellTrigger :month="monthDate" :class="pickerCellTriggerClass" />
              </MonthPickerCell>
            </MonthPickerGridRow>
          </MonthPickerGridBody>
        </MonthPickerGrid>
      </template>
    </MonthPickerRoot>
  </div>
</template>
