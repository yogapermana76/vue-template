<script setup lang="ts">
  import { computed } from 'vue'
  import { TimePickerField } from '@/components/ui/time-picker'
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

  const value = computed(() => props.modelValue?.value ?? '')

  const onChange = (v: string) => {
    emit('update:modelValue', { value: v ?? '', valueId: '' })
  }
</script>

<template>
  <TimePickerField
    :model-value="value"
    :label="field.Label"
    :required="field.IsRequired"
    :placeholder="field.Description || `Pilih ${field.Label}`"
    :error="error"
    :disabled="!field.IsEditable"
    @update:model-value="onChange"
  />
</template>
