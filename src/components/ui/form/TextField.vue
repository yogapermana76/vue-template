<script setup lang="ts">
  import type { HTMLAttributes, Component, InputHTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { FormField } from '.'
  import { Input } from '@/components/ui/input'
  import { InputGroup } from '@/components/ui/input'

  export interface TextFieldProps {
    /** Input value (v-model) */
    modelValue?: string | number
    /** Default value */
    defaultValue?: string | number
    /** Label text */
    label?: string
    /** Placeholder text */
    placeholder?: string
    /** Input type */
    type?: InputHTMLAttributes['type']
    /** Input id (also used for label's for attribute) */
    id?: string
    /** Name attribute */
    name?: string
    /** Show required indicator (*) */
    required?: boolean
    /** Disabled state */
    disabled?: boolean
    /** Readonly state */
    readonly?: boolean
    /** Helper/description text */
    helper?: string
    /** Error message (overrides helper when present) */
    error?: string | string[]
    /** Right-side footer text */
    footerRight?: string
    /** Prefix text */
    prefix?: string
    /** Suffix text */
    suffix?: string
    /** Prefix icon (from lucide-vue-next) */
    prefixIcon?: Component
    /** Suffix icon (from lucide-vue-next) */
    suffixIcon?: Component
    /** Additional CSS classes for root */
    class?: HTMLAttributes['class']
    /** Additional CSS classes for input */
    inputClass?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<TextFieldProps>(), {
    type: 'text',
    required: false,
    disabled: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | number]
  }>()

  const hasError = computed(() => {
    if (Array.isArray(props.error)) return props.error.length > 0
    return !!props.error
  })

  const hasInputGroup = computed(
    () => props.prefix || props.suffix || props.prefixIcon || props.suffixIcon,
  )

  const computedInputClass = computed(() => {
    const classes = [props.inputClass]
    if (props.readonly) {
      classes.push('pointer-events-none bg-white text-neutral-900')
    }
    return classes.filter(Boolean).join(' ')
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

    <!-- Input with or without Group -->
    <InputGroup
      v-if="hasInputGroup"
      :prefix="prefix"
      :suffix="suffix"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      :disabled="disabled"
      :invalid="hasError"
    >
      <Input
        :id="id"
        :name="name"
        :type="type"
        :model-value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="hasError || undefined"
        :class="computedInputClass"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </InputGroup>

    <Input
      v-else
      :id="id"
      :name="name"
      :type="type"
      :model-value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="hasError || undefined"
      :class="computedInputClass"
      @update:model-value="emit('update:modelValue', $event)"
    />

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
