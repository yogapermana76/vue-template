<script setup lang="ts">
  import type { HTMLAttributes, Component } from 'vue'
  import type { BadgeVariants } from '@/components/ui/badge'
  import { computed } from 'vue'
  import { FormField } from '@/components/ui/form'
  import TagInput from './TagInput.vue'

  export interface TagInputFieldProps {
    /** v-model value (array of strings) */
    modelValue?: string[]
    /** Label text */
    label?: string
    /** Placeholder text for input */
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
    /** Prefix icon (from lucide-vue-next) */
    prefixIcon?: Component
    /** Allow duplicate tags */
    allowDuplicates?: boolean
    /** Maximum number of tags allowed */
    maxTags?: number
    /** Validation function - return error message or null */
    validate?: (tag: string) => string | null
    /** Separator characters (default: Enter, comma) */
    separators?: string[]
    /** Badge variant for tags */
    variant?: BadgeVariants['variant']
  }

  const props = withDefaults(defineProps<TagInputFieldProps>(), {
    modelValue: () => [],
    placeholder: 'Ketik dan tekan Enter...',
    required: false,
    disabled: false,
    allowDuplicates: false,
    variant: 'neutral',
    separators: () => ['Enter', ','],
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string[]]
    'tag-added': [tag: string]
    'tag-removed': [tag: string]
    'validation-error': [message: string]
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

    <!-- Tag Input -->
    <TagInput
      :model-value="modelValue"
      :placeholder="placeholder"
      :prefix-icon="prefixIcon"
      :disabled="disabled"
      :invalid="hasError"
      :allow-duplicates="allowDuplicates"
      :max-tags="maxTags"
      :validate="validate"
      :separators="separators"
      :variant="variant"
      @update:model-value="emit('update:modelValue', $event)"
      @tag-added="emit('tag-added', $event)"
      @tag-removed="emit('tag-removed', $event)"
      @validation-error="emit('validation-error', $event)"
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
