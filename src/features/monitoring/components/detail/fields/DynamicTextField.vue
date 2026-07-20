<script setup lang="ts">
  import { computed } from 'vue'
  import { FormField } from '@/components/ui/form'
  import { Input } from '@/components/ui/input'
  import type { TicketFormField } from '@/types/services'
  import type { DynamicFieldValue } from './types'

  const NATIVE_INPUT_TYPES = new Set(['text', 'tel', 'email', 'date', 'time', 'number'])

  const props = defineProps<{
    field: TicketFormField
    modelValue?: DynamicFieldValue
    error?: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [payload: DynamicFieldValue]
  }>()

  const value = computed(() => props.modelValue?.value ?? '')
  const type = computed(() =>
    NATIVE_INPUT_TYPES.has(props.field.HtmlType) ? props.field.HtmlType : 'text',
  )

  const onInput = (v: string | number) =>
    emit('update:modelValue', { value: String(v ?? ''), valueId: '' })
</script>

<template>
  <FormField
    :label="field.Label"
    :required="field.IsRequired"
    :disabled="!field.IsEditable"
    :error="error"
  >
    <Input
      :model-value="value"
      :type="type"
      :disabled="!field.IsEditable"
      :placeholder="field.Description || undefined"
      :aria-invalid="error ? true : undefined"
      @update:model-value="onInput"
    />
  </FormField>
</template>
