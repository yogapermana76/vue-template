<script setup lang="ts">
  import { computed } from 'vue'
  import { FormField } from '@/components/ui/form'
  import { Checkbox } from '@/components/ui/checkbox'
  import { Label } from '@/components/ui/label'
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

  const parseIds = (raw: string): string[] =>
    raw
      ? raw
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      : []

  const selectedIds = computed(() => new Set(parseIds(props.modelValue?.valueId ?? '')))

  const options = computed(() =>
    (props.field.Data ?? []).map(opt => ({ value: opt.id, label: opt.label })),
  )

  const idFor = (optionId: string) => `${props.field.Name}-${optionId}`

  const toggle = (optionId: string, checked: boolean | 'indeterminate') => {
    const next = new Set(selectedIds.value)
    if (checked === true) next.add(optionId)
    else next.delete(optionId)

    const orderedIds = options.value.map(o => o.value).filter(id => next.has(id))
    const orderedLabels = options.value.filter(o => next.has(o.value)).map(o => o.label)
    emit('update:modelValue', {
      value: orderedLabels.join(', '),
      valueId: orderedIds.join(','),
    })
  }
</script>

<template>
  <FormField
    :label="field.Label"
    :required="field.IsRequired"
    :disabled="!field.IsEditable"
    :error="error"
  >
    <div class="flex flex-col gap-2">
      <div v-for="opt in options" :key="opt.value" class="flex items-start gap-2">
        <Checkbox
          :id="idFor(opt.value)"
          :checked="selectedIds.has(opt.value)"
          :disabled="!field.IsEditable"
          class="mt-0.5"
          @update:checked="v => toggle(opt.value, v)"
        />
        <Label :for="idFor(opt.value)" class="cursor-pointer">
          {{ opt.label }}
        </Label>
      </div>
    </div>
  </FormField>
</template>
