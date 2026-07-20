<script setup lang="ts">
  import { computed } from 'vue'
  import { TextAreaField } from '@/components/ui/form'
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

  const onInput = (v: string | number) =>
    emit('update:modelValue', { value: String(v ?? ''), valueId: '' })
</script>

<template>
  <TextAreaField
    :model-value="value"
    :label="field.Label"
    :required="field.IsRequired"
    :placeholder="field.Description || undefined"
    :error="error"
    :disabled="!field.IsEditable"
    @update:model-value="onInput"
  />
</template>
