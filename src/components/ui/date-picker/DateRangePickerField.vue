<script setup lang="ts">
  /**
   * Sibling of `DatePickerField` for picking a **date range** in a single
   * field. Uses reka-ui's `RangeCalendarRoot` inside the same Popover +
   * InputGroup shell as the single-date variant, so consumers can swap
   * between single/range without learning a new component surface.
   *
   * External contract: `modelValue` is `{ start: DateValue|undefined,
   * end: DateValue|undefined }`. Wire from ISO strings via a thin adapter
   * (see `LoketDateRangeAdapter` example in the loket-dashboard feature).
   */
  import type { HTMLAttributes, Component } from 'vue'
  import type { DateValue } from '@internationalized/date'
  import { computed, ref } from 'vue'
  import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
  import type { DateRange } from 'reka-ui'
  import { Calendar as CalendarIcon, X } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
  import { FormField } from '@/components/ui/form'
  import { InputGroup } from '@/components/ui/input'
  import { RangeCalendar } from '@/components/ui/calendar'

  export interface DateRangePickerFieldProps {
    /** Range value (v-model). `undefined` for either side = unset. */
    modelValue?: { start: DateValue | undefined; end: DateValue | undefined }
    label?: string
    placeholder?: string
    id?: string
    required?: boolean
    disabled?: boolean
    helper?: string
    error?: string | string[]
    footerRight?: string
    class?: HTMLAttributes['class']
    prefixIcon?: Component
    /** Suffix icon (default: Calendar). Set `hideSuffixIcon` to remove. */
    suffixIcon?: Component
    hideSuffixIcon?: boolean
    /** Show a clear (X) button when a range is set. Default: true. */
    clearable?: boolean
    /** Locale for the display formatter + calendar text. Default: 'id-ID'. */
    locale?: string
    /** Number of calendar months shown side-by-side. Default: 2. */
    numberOfMonths?: number
    /** Day the calendar week starts on. Default: 1 (Monday). */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    /** Popover side. Default: 'bottom'. */
    side?: 'top' | 'right' | 'bottom' | 'left'
    /** Popover alignment. Default: 'start'. */
    align?: 'start' | 'center' | 'end'
  }

  const props = withDefaults(defineProps<DateRangePickerFieldProps>(), {
    placeholder: 'Pilih rentang tanggal',
    required: false,
    disabled: false,
    hideSuffixIcon: false,
    clearable: true,
    locale: 'id-ID',
    numberOfMonths: 2,
    weekStartsOn: 1,
    side: 'bottom',
    align: 'start',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: DateRangePickerFieldProps['modelValue']]
  }>()

  const open = ref(false)

  const hasError = computed(() => {
    if (Array.isArray(props.error)) return props.error.length > 0
    return !!props.error
  })

  const df = computed(
    () =>
      new DateFormatter(props.locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
  )

  const rangeValue = computed<DateRange>({
    get: () => ({
      start: props.modelValue?.start,
      end: props.modelValue?.end,
    }),
    set: v =>
      emit('update:modelValue', {
        start: v?.start,
        end: v?.end,
      } as DateRangePickerFieldProps['modelValue']),
  })

  const hasValue = computed(() => !!props.modelValue?.start || !!props.modelValue?.end)

  const displayValue = computed(() => {
    const v = props.modelValue
    if (!v?.start && !v?.end) return props.placeholder
    const start = v.start ? df.value.format(v.start.toDate(getLocalTimeZone())) : 'Awal'
    const end = v.end ? df.value.format(v.end.toDate(getLocalTimeZone())) : 'Akhir'
    return `${start} — ${end}`
  })

  const clear = (event: MouseEvent) => {
    event.stopPropagation()
    emit('update:modelValue', { start: undefined, end: undefined })
  }

  const onRangeUpdate = (v: DateRange) => {
    rangeValue.value = v
    // Auto-close only once BOTH ends are set — otherwise the user is
    // mid-selection and closing would drop the second click.
    if (v?.start && v?.end) {
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
    <template v-if="$slots.labelRight" #labelRight>
      <slot name="labelRight" />
    </template>

    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <InputGroup
          :prefix-icon="prefixIcon"
          :disabled="disabled"
          :invalid="hasError"
          :focused="open"
          role="button"
          tabindex="0"
          :class="cn('cursor-pointer', disabled && 'cursor-not-allowed')"
        >
          <!-- Display value fills the input area; truncation lives here so
               the suffix (clear or calendar) stays pinned to the trailing
               edge and never gets pushed by long date labels. -->
          <span :class="cn('truncate text-sm', !hasValue && 'text-neutral-400')">
            {{ displayValue }}
          </span>

          <!-- Trailing control lives in `InputGroup`'s dedicated `#suffix`
               slot, which is right-anchored + `shrink-0` by construction.
               We swap between (clearable + hasValue) → X button and the
               default calendar icon so the affordance is always aligned
               to the right edge of the field. -->
          <template #suffix>
            <button
              v-if="clearable && hasValue && !disabled"
              type="button"
              class="-mr-1 flex size-6 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              :aria-label="'Hapus rentang tanggal'"
              @mousedown.stop
              @click="clear"
            >
              <X class="size-4" />
            </button>
            <component
              v-else-if="!hideSuffixIcon"
              :is="suffixIcon || CalendarIcon"
              class="size-5"
            />
          </template>
        </InputGroup>
      </PopoverTrigger>

      <PopoverContent class="w-auto p-3" :align="align" :side="side">
        <!-- Grid rendering is delegated to the `RangeCalendar` primitive so
             this component stays focused on trigger + popover concerns.
             The primitive handles theming, month navigation, and cell
             states — swapping it for a themed variant is a one-line change. -->
        <RangeCalendar
          :model-value="rangeValue"
          :locale="locale"
          :number-of-months="numberOfMonths"
          :week-starts-on="weekStartsOn"
          :disabled="disabled"
          @update:model-value="onRangeUpdate"
        />
      </PopoverContent>
    </Popover>

    <template v-if="$slots.helper" #helper>
      <slot name="helper" />
    </template>

    <template v-if="$slots.footerRight" #footerRight>
      <slot name="footerRight" />
    </template>
  </FormField>
</template>
