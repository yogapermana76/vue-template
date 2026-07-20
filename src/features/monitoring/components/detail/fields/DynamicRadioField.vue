<script setup lang="ts">
  import { computed } from 'vue'
  import { FormField } from '@/components/ui/form'
  import { Label } from '@/components/ui/label'
  import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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

  const idFor = (optionId: string) => `${props.field.Name}-${optionId}`

  const onChange = (id: unknown) => {
    const nextId = id == null ? '' : String(id)
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
    <RadioGroup
      :model-value="valueId"
      :disabled="!field.IsEditable"
      class="flex flex-wrap gap-x-6 gap-y-2"
      @update:model-value="onChange"
    >
      <div v-for="opt in options" :key="opt.value" class="flex items-center gap-2">
        <RadioGroupItem :id="idFor(opt.value)" :value="opt.value" />
        <Label :for="idFor(opt.value)" class="cursor-pointer">
          {{ opt.label }}
        </Label>
      </div>
    </RadioGroup>
  </FormField>
</template>
