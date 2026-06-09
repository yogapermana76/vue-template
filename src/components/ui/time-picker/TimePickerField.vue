<script setup lang="ts">
  import type { HTMLAttributes, Component } from 'vue'
  import { computed, ref } from 'vue'
  import { Clock as ClockIcon } from 'lucide-vue-next'
  import { FormField } from '@/components/ui/form'
  import { InputGroup } from '@/components/ui/input'
  import { cn } from '@/utils/cn'
  import TimePicker from './TimePicker.vue'

  export interface TimePickerFieldProps {
    /** Time value (v-model) - format: 'HH:mm' */
    modelValue?: string
    /** Label text */
    label?: string
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
    /** Prefix icon (from lucide-vue-next) - appears on left side */
    prefixIcon?: Component
    /** Suffix icon (from lucide-vue-next) - appears on right side (default: Clock) */
    suffixIcon?: Component
    /** Hide the suffix icon (clock icon) */
    hideSuffixIcon?: boolean
    /** Additional CSS classes for root */
    class?: HTMLAttributes['class']
    /** Use 24-hour format (default: true) */
    use24Hour?: boolean
    /** Minute step increment (default: 15) */
    minuteStep?: number
    /** Popover side positioning */
    side?: 'top' | 'right' | 'bottom' | 'left'
    /** Popover alignment */
    align?: 'start' | 'center' | 'end'
  }

  const props = withDefaults(defineProps<TimePickerFieldProps>(), {
    required: false,
    disabled: false,
    placeholder: 'Select time',
    use24Hour: true,
    minuteStep: 15,
    hideSuffixIcon: false,
    side: 'bottom',
    align: 'start',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const open = ref(false)

  const hasError = computed(() => {
    if (Array.isArray(props.error)) return props.error.length > 0
    return !!props.error
  })

  // Format time for display
  const displayValue = computed(() => {
    if (!props.modelValue) return props.placeholder

    if (props.use24Hour) {
      return props.modelValue
    }

    // Convert to 12-hour format
    const [hours, minutes] = props.modelValue.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`
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

    <!-- Time Picker: InputGroup + TimePicker Component -->
    <TimePicker
      v-model:open="open"
      :model-value="modelValue"
      :use24-hour="use24Hour"
      :minute-step="minuteStep"
      :side="side"
      :align="align"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <InputGroup
        :prefix-icon="prefixIcon"
        :suffix-icon="!hideSuffixIcon ? suffixIcon || ClockIcon : undefined"
        :disabled="disabled"
        :invalid="hasError"
        :focused="open"
        role="button"
        tabindex="0"
        :class="cn('cursor-pointer', disabled && 'cursor-not-allowed')"
      >
        <span :class="cn('flex-1 truncate text-left text-sm', !modelValue && 'text-neutral-400')">
          {{ displayValue }}
        </span>
      </InputGroup>
    </TimePicker>

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
