<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'
  import type { DateValue } from '@internationalized/date'
  import type { Matcher } from 'reka-ui/date'
  import { BottomSheet } from '@/components/ui/bottom-sheet'
  import { Calendar } from '@/components/ui/calendar'
  import { Button } from '@/components/ui/button'

  // ============================================================================
  // Type Definitions
  // ============================================================================

  export type SelectionMode = 'single' | 'multiple' | 'range'
  export type DateRangeValue = { start: DateValue | undefined; end: DateValue | undefined }
  export type CalendarValue = DateValue | DateValue[] | DateRangeValue | undefined

  // ============================================================================
  // Props Interface
  // ============================================================================

  export interface DatePickerBottomSheetProps {
    /** Controls the open/close state */
    open?: boolean
    /** Title shown in the bottom sheet header */
    title?: string
    /** Whether to show the close button */
    showClose?: boolean
    /** Whether the bottom sheet can be dismissed */
    dismissible?: boolean

    // Calendar Props
    /** Current selected date value(s) */
    modelValue?: DateValue | DateValue[] | { start: DateValue; end: DateValue } | undefined
    /** Selection mode: 'single', 'multiple', or 'range' */
    mode?: SelectionMode
    /** Minimum selectable date */
    minValue?: DateValue
    /** Maximum selectable date */
    maxValue?: DateValue
    /** Dates that should be disabled */
    isDateDisabled?: Matcher
    /** Dates that are unavailable (shown with strikethrough) */
    isDateUnavailable?: Matcher
    /** Public holidays to show as red dots with tooltips */
    holidays?: { name: string; startDate: string; endDate: string }[]
    /** Number of months to display */
    numberOfMonths?: number
    /** Whether to show dates from adjacent months */
    fixedWeeks?: boolean
    /** Initial focus date when calendar opens */
    placeholder?: DateValue
    /** Locale for calendar (e.g., 'id-ID', 'en-US') */
    locale?: string
    /** First day of week (0 = Sunday, 1 = Monday, etc.) */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    /** Format for weekday labels */
    weekdayFormat?: 'narrow' | 'short' | 'long'
    /** Whether calendar is disabled */
    disabled?: boolean
    /** Whether calendar is read-only */
    readonly?: boolean

    // Action Buttons
    /** Text for confirm button */
    confirmText?: string
    /** Text for cancel button */
    cancelText?: string
    /** Whether to show action buttons */
    showActions?: boolean
    /** Whether to auto-close after selection (single mode only) */
    autoClose?: boolean
  }

  const props = withDefaults(defineProps<DatePickerBottomSheetProps>(), {
    open: false,
    title: 'Pilih Tanggal Kunjungan',
    showClose: true,
    dismissible: true,
    mode: 'single',
    numberOfMonths: 1,
    fixedWeeks: false,
    locale: 'id-ID',
    weekStartsOn: 1,
    weekdayFormat: 'short',
    disabled: false,
    readonly: false,
    confirmText: 'Konfirmasi',
    cancelText: 'Batal',
    showActions: false,
    autoClose: true,
  })

  // ============================================================================
  // Emits
  // ============================================================================

  const emit = defineEmits<{
    'update:open': [value: boolean]
    'update:modelValue': [value: CalendarValue]
    confirm: [value: CalendarValue]
    cancel: []
  }>()

  // ============================================================================
  // State
  // ============================================================================

  // reka-ui Calendar returns complex internal types that don't match the public API types exactly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const internalValue = ref<any>(props.modelValue)

  const isOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })

  // ============================================================================
  // Watchers
  // ============================================================================

  // Keep internalValue in sync when parent changes modelValue from outside
  watch(
    () => props.modelValue,
    newValue => {
      internalValue.value = newValue
    },
  )

  // isOpen guard prevents this from firing when parent sets modelValue programmatically
  // (e.g. selecting a quick-period pill that fills the date without opening the picker)
  watch(internalValue, newValue => {
    if (isOpen.value && props.mode === 'single' && props.autoClose && newValue) {
      handleConfirm()
    }
  })

  // ============================================================================
  // Computed
  // ============================================================================

  const hasSelection = computed(() => {
    if (!internalValue.value) return false
    if (props.mode === 'multiple')
      return Array.isArray(internalValue.value) && internalValue.value.length > 0
    if (props.mode === 'range') return !!(internalValue.value?.start && internalValue.value?.end)
    return true
  })

  // ============================================================================
  // Methods
  // ============================================================================

  function handleConfirm() {
    emit('update:modelValue', internalValue.value as CalendarValue)
    emit('confirm', internalValue.value as CalendarValue)
    isOpen.value = false
  }

  function handleCancel() {
    // Discard local changes — revert to whatever the parent last gave us
    internalValue.value = props.modelValue
    emit('cancel')
    isOpen.value = false
  }
</script>

<template>
  <BottomSheet
    v-model:open="isOpen"
    :title="title"
    :show-close="showClose"
    :dismissible="dismissible"
    :has-footer="showActions"
    footer-position="sticky"
    content-slot-class="!p-4"
  >
    <!-- Calendar -->
    <Calendar
      :model-value="internalValue"
      :mode="mode"
      :min-value="minValue"
      :max-value="maxValue"
      :is-date-disabled="isDateDisabled"
      :is-date-unavailable="isDateUnavailable"
      :holidays="holidays"
      :number-of-months="numberOfMonths"
      :fixed-weeks="fixedWeeks"
      :placeholder="placeholder"
      :locale="locale"
      :week-starts-on="weekStartsOn"
      :weekday-format="weekdayFormat"
      :disabled="disabled"
      :readonly="readonly"
      @update:model-value="internalValue = $event"
    />

    <!-- Action Buttons -->
    <template v-if="showActions" #footer>
      <div class="flex w-full gap-2">
        <Button variant="secondary" class="flex-1" @click="handleCancel">
          {{ cancelText }}
        </Button>
        <Button class="flex-1" :disabled="!hasSelection" @click="handleConfirm">
          {{ confirmText }}
        </Button>
      </div>
    </template>
  </BottomSheet>
</template>
