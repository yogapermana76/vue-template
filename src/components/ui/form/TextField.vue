<script setup lang="ts">
  import type { HTMLAttributes, Component, InputHTMLAttributes } from 'vue'
  import { computed, useSlots } from 'vue'
  import { FormField } from '.'
  import { Input } from '@/components/ui/input'
  import { InputGroup } from '@/components/ui/input'
  import { getInputFormat, type InputFormat } from '@/config/input-formats'

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
    /** Predefined format (currency, percentage, etc.) - Alternative to prefix/suffix props */
    format?: string
    /** Prefix text (overrides format if both provided) */
    prefix?: string
    /** Suffix text (overrides format if both provided) */
    suffix?: string
    /** Prefix icon (from lucide-vue-next) - overrides format */
    prefixIcon?: Component
    /** Suffix icon (from lucide-vue-next) - overrides format */
    suffixIcon?: Component
    /** Additional CSS classes for root */
    class?: HTMLAttributes['class']
    /** Additional CSS classes for input */
    inputClass?: HTMLAttributes['class']
  }

  const slots = useSlots()

  const props = withDefaults(defineProps<TextFieldProps>(), {
    type: 'text',
    required: false,
    disabled: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | number]
    blur: [event: FocusEvent]
  }>()

  const hasError = computed(() => {
    if (Array.isArray(props.error)) return props.error.length > 0
    return !!props.error
  })

  // Get format configuration from predefined formats
  const formatConfig = computed<InputFormat | undefined>(() => {
    if (!props.format) return undefined
    return getInputFormat(props.format)
  })

  // Computed prefix/suffix that prioritizes explicit props over format config
  const computedPrefix = computed(() => {
    return props.prefix ?? formatConfig.value?.prefix
  })

  const computedSuffix = computed(() => {
    return props.suffix ?? formatConfig.value?.suffix
  })

  const computedPrefixIcon = computed(() => {
    return props.prefixIcon ?? formatConfig.value?.prefixIcon
  })

  const computedSuffixIcon = computed(() => {
    return props.suffixIcon ?? formatConfig.value?.suffixIcon
  })

  const hasInputGroup = computed(
    () =>
      !!computedPrefix.value ||
      !!computedSuffix.value ||
      !!computedPrefixIcon.value ||
      !!computedSuffixIcon.value ||
      !!slots.suffix,
  )

  const computedInputClass = computed(() => {
    const classes = [props.inputClass]
    if (props.readonly) {
      classes.push('pointer-events-none bg-white text-neutral-900')
    }
    return classes.filter(Boolean).join(' ')
  })

  const inputProps = computed(() => ({
    id: props.id,
    name: props.name,
    type: props.type,
    modelValue: props.modelValue,
    placeholder: props.placeholder,
    disabled: props.disabled,
    readonly: props.readonly,
    ariaInvalid: hasError.value || undefined,
    class: computedInputClass.value,
  }))
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
      :prefix="computedPrefix"
      :suffix="computedSuffix"
      :prefix-icon="computedPrefixIcon"
      :suffix-icon="slots.suffix ? undefined : computedSuffixIcon"
      :disabled="disabled"
      :invalid="hasError"
    >
      <template v-if="slots.suffix" #suffix>
        <slot name="suffix" />
      </template>
      <Input
        v-bind="inputProps"
        @update:model-value="emit('update:modelValue', $event)"
        @blur="emit('blur', $event)"
      />
    </InputGroup>

    <Input
      v-else
      v-bind="inputProps"
      @update:model-value="emit('update:modelValue', $event)"
      @blur="emit('blur', $event)"
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
