<script setup lang="ts">
  import { computed } from 'vue'
  import { DatePickerField, parseDate, type DateValue } from '@/components/ui/date-picker'
  import type { TicketFormField } from '@/types/services'
  import type { DynamicFieldValue } from './types'

  const props = defineProps<{
    field: TicketFormField
    modelValue?: DynamicFieldValue
    error?: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [payload: DynamicFieldValue]
  }>()

  const dateValue = computed<DateValue | undefined>(() => {
    const raw = props.modelValue?.value ?? ''
    if (!raw) return undefined
    try {
      return parseDate(raw)
    } catch {
      return undefined
    }
  })

  const onChange = (v: DateValue | undefined) => {
    emit('update:modelValue', { value: v?.toString() ?? '', valueId: '' })
  }
</script>

<template>
  <DatePickerField
    :model-value="dateValue"
    :label="field.Label"
    :required="field.IsRequired"
    :placeholder="field.Description || `Pilih ${field.Label}`"
    :error="error"
    :disabled="!field.IsEditable"
    locale="id-ID"
    @update:model-value="onChange"
  />
</template>
