<script setup lang="ts">
  import type { HTMLAttributes, Component } from 'vue'
  import type { DateValue } from '@internationalized/date'
  import { computed, ref } from 'vue'
  import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
  import type { Matcher } from 'reka-ui/date'
  import { Calendar as CalendarIcon } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
  import { Calendar } from '@/components/ui/calendar'
  import { FormField } from '@/components/ui/form'
  import { InputGroup } from '@/components/ui/input'

  export interface DatePickerFieldProps {
    /** Date value (v-model) - DateValue from @internationalized/date */
    modelValue?: DateValue
    /** Label text */
    label?: string
    /** Placeholder text when no date is selected */
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
    /** Prefix icon (from lucide-vue-next) - appears on left side */
    prefixIcon?: Component
    /** Suffix icon (from lucide-vue-next) - appears on right side (default: Calendar) */
    suffixIcon?: Component
    /** Hide the suffix icon (calendar icon) */
    hideSuffixIcon?: boolean
    /** Locale for date formatting (e.g., 'en-US', 'id-ID') */
    locale?: string
    /** Function to determine if a date should be disabled */
    isDateDisabled?: Matcher
    /** Function to determine if a date is unavailable */
    isDateUnavailable?: Matcher
    /** Minimum selectable date */
    minValue?: DateValue
    /** Maximum selectable date */
    maxValue?: DateValue
    /** Number of months to display */
    numberOfMonths?: number
    /** Day of week to start calendar (0 = Sunday, 1 = Monday, etc.) */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    /** Always show 6 weeks in the calendar */
    fixedWeeks?: boolean
    /** Popover side positioning */
    side?: 'top' | 'right' | 'bottom' | 'left'
    /** Popover alignment */
    align?: 'start' | 'center' | 'end'
  }

  const props = withDefaults(defineProps<DatePickerFieldProps>(), {
    placeholder: 'Pick a date',
    required: false,
    disabled: false,
    hideSuffixIcon: false,
    locale: 'en-US',
    side: 'bottom',
    align: 'start',
    numberOfMonths: 1,
    weekStartsOn: 1,
    fixedWeeks: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: DateValue | undefined]
  }>()

  const open = ref(false)

  const hasError = computed(() => {
    if (Array.isArray(props.error)) return props.error.length > 0
    return !!props.error
  })

  // Date formatter for display
  const df = computed(
    () =>
      new DateFormatter(props.locale, {
        dateStyle: 'long',
      }),
  )

  // Formatted date string for button display
  const displayValue = computed(() => {
    if (props.modelValue) {
      return df.value.format(props.modelValue.toDate(getLocalTimeZone()))
    }
    return props.placeholder
  })

  // Handle date selection
  const handleSelect = (value: DateValue | undefined) => {
    emit('update:modelValue', value)
    // Auto-close popover after selection
    if (value) {
      open.value = false
    }
  }
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

    <!-- Date Picker: InputGroup + Popover + Calendar -->
    <Popover v-model:open="open">
      <PopoverTrigger as-child :disabled="disabled">
        <InputGroup
          :prefix-icon="prefixIcon"
          :suffix-icon="!hideSuffixIcon ? suffixIcon || CalendarIcon : undefined"
          :disabled="disabled"
          :invalid="hasError"
          :focused="open"
          role="button"
          tabindex="0"
          :class="cn('cursor-pointer', disabled && 'pointer-events-none cursor-not-allowed')"
        >
          <span :class="cn('flex-1 truncate text-left text-sm', !modelValue && 'text-neutral-400')">
            {{ displayValue }}
          </span>
        </InputGroup>
      </PopoverTrigger>

      <PopoverContent :class="cn('w-auto p-3')" :align="align" :side="side">
        <Calendar
          :model-value="modelValue"
          :locale="locale"
          :is-date-disabled="isDateDisabled"
          :is-date-unavailable="isDateUnavailable"
          :min-value="minValue"
          :max-value="maxValue"
          :number-of-months="numberOfMonths"
          :week-starts-on="weekStartsOn"
          :fixed-weeks="fixedWeeks"
          :disabled="disabled"
          class="w-72"
          @update:model-value="handleSelect"
        />
      </PopoverContent>
    </Popover>

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
