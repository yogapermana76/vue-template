<script setup lang="ts" generic="T extends AcceptableValue = string">
  import type { AcceptableValue } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import type { ComboboxOption, ComboboxGroup } from '@/components/ui/combobox/types'
  import { computed } from 'vue'
  import { FormField } from '@/components/ui/form'
  import SelectOption from './SelectOption.vue'

  export interface SelectOptionFieldProps<T extends AcceptableValue = string> {
    /** v-model value */
    modelValue?: T
    /** Label text */
    label?: string
    /** Flat array of options */
    options?: ComboboxOption<T>[]
    /** Grouped options */
    groups?: ComboboxGroup<T>[]
    /** Placeholder text */
    placeholder?: string
    /** Input id (also used for label's for attribute) */
    id?: string
    /** Show required indicator (*) */
    required?: boolean
    /** Disabled state */
    disabled?: boolean
    /** Helper/description text */
    helper?: string
    /** Error message (overrides helper when present) */
    error?: string | string[]
    /** Right-side footer text */
    footerRight?: string
    /** Additional CSS classes for root */
    class?: HTMLAttributes['class']
    /** Additional CSS classes for select element */
    selectClass?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<SelectOptionFieldProps<T>>(), {
    options: () => [],
    placeholder: 'Pilih opsi...',
    required: false,
    disabled: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: T]
  }>()

  const hasError = computed(() => {
    if (Array.isArray(props.error)) return props.error.length > 0
    return !!props.error
  })
</script>

<template>
  <FormField
    :label="label"
    :for="id"
    :required="required"
    :helper="helper"
    :error="error"
    :footer-right="footerRight"
    :disabled="disabled"
    :class="props.class"
  >
    <!-- Label Right Slot -->
    <template v-if="$slots.labelRight" #labelRight>
      <slot name="labelRight" />
    </template>

    <!-- Select Option -->
    <SelectOption
      :id="id"
      :model-value="modelValue"
      :options="options"
      :groups="groups"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="hasError"
      :class="selectClass"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <!-- Pass through custom options if provided -->
      <slot />
    </SelectOption>

    <!-- Helper Slot -->
    <template v-if="$slots.helper" #helper>
      <slot name="helper" />
    </template>

    <!-- Footer Right Slot -->
    <template v-if="$slots.footerRight" #footerRight>
      <slot name="footerRight" />
    </template>
  </FormField>
</template>
