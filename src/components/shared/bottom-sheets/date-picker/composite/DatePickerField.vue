<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { parseDate } from '@internationalized/date'
  import { formatDate } from '@/utils/date'
  import {
    DatePickerBottomSheet,
    type DatePickerBottomSheetProps,
  } from '@/components/shared/bottom-sheets/date-picker'
  import { TextField, type TextFieldProps } from '@/components/ui/form'

  type Props = Omit<DatePickerBottomSheetProps, 'open' | 'modelValue' | 'placeholder'> &
    Pick<
      TextFieldProps,
      | 'label'
      | 'placeholder'
      | 'id'
      | 'name'
      | 'required'
      | 'helper'
      | 'error'
      | 'footerRight'
      | 'class'
      | 'inputClass'
    > & {
      modelValue?: string | null
    }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Pilih tanggal',
    autoClose: true,
    mode: 'single',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | null]
  }>()

  const showPicker = ref(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calendarValue = computed<any>({
    get: () => (props.modelValue ? parseDate(props.modelValue) : undefined),
    set: dv => emit('update:modelValue', dv?.toString() ?? null),
  })

  const displayValue = computed(() =>
    props.modelValue ? formatDate(props.modelValue, 'd MMMM yyyy') : '',
  )
</script>

<template>
  <TextField
    :label="label"
    :model-value="displayValue"
    :placeholder="placeholder"
    :id="id"
    :name="name"
    :required="required"
    :disabled="disabled"
    :helper="helper"
    :error="error"
    :footer-right="footerRight"
    :class="props.class"
    :input-class="['cursor-pointer', inputClass]"
    readonly
    @click="showPicker = true"
  />

  <DatePickerBottomSheet
    v-model:open="showPicker"
    v-model="calendarValue"
    :title="title"
    :show-close="showClose"
    :dismissible="dismissible"
    :mode="mode"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-disabled="isDateDisabled"
    :is-date-unavailable="isDateUnavailable"
    :number-of-months="numberOfMonths"
    :fixed-weeks="fixedWeeks"
    :locale="locale"
    :week-starts-on="weekStartsOn"
    :weekday-format="weekdayFormat"
    :disabled="disabled"
    :readonly="readonly"
    :confirm-text="confirmText"
    :cancel-text="cancelText"
    :show-actions="showActions"
    :auto-close="autoClose"
  />
</template>
