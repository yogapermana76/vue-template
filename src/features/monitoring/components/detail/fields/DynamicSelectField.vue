<script setup lang="ts">
  import { computed } from 'vue'
  import { FormField } from '@/components/ui/form'
  import { SelectOption } from '@/components/ui/native-select'
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

  const valueId = computed(() => props.modelValue?.valueId ?? '')
  const options = computed(() =>
    (props.field.Data ?? []).map(opt => ({ value: opt.id, label: opt.label })),
  )

  const onChange = (id: string) => {
    const nextId = id ?? ''
    const match = props.field.Data?.find(opt => opt.id === nextId)
    emit('update:modelValue', { value: match?.label ?? '', valueId: nextId })
  }
</script>

<template>
  <FormField
    :label="field.Label"
    :required="field.IsRequired"
    :disabled="!field.IsEditable"
    :error="error"
  >
    <SelectOption
      :model-value="valueId"
      :options="options"
      :placeholder="field.Description || `Pilih ${field.Label}`"
      :disabled="!field.IsEditable"
      :aria-invalid="error ? true : undefined"
      @update:model-value="onChange"
    />
  </FormField>
</template>
