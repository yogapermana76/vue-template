<script setup lang="ts">
  import { computed } from 'vue'
  import type { TicketFormField } from '@/types/services'
  import type { DynamicFieldValue } from './fields/types'
  import { DEFAULT_FIELD_RENDERER, DYNAMIC_FIELD_RENDERERS } from './dynamicFormRegistry'

  const props = defineProps<{
    field: TicketFormField
    modelValue?: DynamicFieldValue
    error?: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [payload: DynamicFieldValue]
  }>()

  const renderer = computed(
    () => DYNAMIC_FIELD_RENDERERS[props.field.HtmlType] ?? DEFAULT_FIELD_RENDERER,
  )

  const onUpdate = (payload: DynamicFieldValue) => emit('update:modelValue', payload)
</script>

<template>
  <component
    :is="renderer"
    :field="field"
    :model-value="modelValue"
    :error="error"
    @update:model-value="onUpdate"
  />
</template>
