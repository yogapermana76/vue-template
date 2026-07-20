<script setup lang="ts">
  import { computed } from 'vue'
  import { Checkbox } from '@/components/ui/checkbox'
  import { FormField } from '@/components/ui/form'
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

  const checked = computed(() => {
    const raw = props.modelValue?.value ?? props.field.Value
    return raw === 'true' || raw === '1'
  })

  const onToggle = (v: boolean | 'indeterminate') => {
    emit('update:modelValue', { value: String(v === true), valueId: '' })
  }
</script>

<template>
  <FormField :disabled="!field.IsEditable" :error="error">
    <div class="flex items-start gap-3">
      <Checkbox
        :id="field.Name"
        :checked="checked"
        :disabled="!field.IsEditable"
        class="mt-0.5"
        @update:checked="onToggle"
      />
      <Label :for="field.Name" class="inline cursor-pointer leading-snug">
        {{ field.Label }}
        <span v-if="field.IsRequired" class="text-error-500">*</span>
      </Label>
    </div>
  </FormField>
</template>
