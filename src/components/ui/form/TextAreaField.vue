<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { FormField } from '.'
  import { Textarea } from '@/components/ui/textarea'

  export interface TextAreaFieldProps {
    /** Textarea value (v-model) */
    modelValue?: string | number
    /** Default value */
    defaultValue?: string | number
    /** Label text */
    label?: string
    /** Placeholder text */
    placeholder?: string
    /** Textarea id (also used for label's for attribute) */
    id?: string
    /** Name attribute */
    name?: string
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
    /** Number of visible text lines */
    rows?: number
    /** Maximum number of characters */
    maxlength?: number
    /** Minimum number of characters */
    minlength?: number
    /** Auto-resize behavior */
    resize?: 'none' | 'both' | 'horizontal' | 'vertical'
    /** Additional CSS classes for root */
    class?: HTMLAttributes['class']
    /** Additional CSS classes for textarea */
    textareaClass?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<TextAreaFieldProps>(), {
    required: false,
    disabled: false,
    rows: 3,
    resize: 'vertical',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | number]
  }>()

  const hasError = computed(() => {
    if (Array.isArray(props.error)) return props.error.length > 0
    return !!props.error
  })

  const textareaStyles = computed(() => {
    return {
      resize: props.resize,
    }
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

    <!-- Textarea -->
    <Textarea
      :id="id"
      :name="name"
      :model-value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxlength"
      :minlength="minlength"
      :aria-invalid="hasError || undefined"
      :class="textareaClass"
      :style="textareaStyles"
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
