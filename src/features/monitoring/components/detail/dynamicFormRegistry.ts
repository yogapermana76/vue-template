import type { Component } from 'vue'
import DynamicBoolField from './fields/DynamicBoolField.vue'
import DynamicCheckboxField from './fields/DynamicCheckboxField.vue'
import DynamicDateField from './fields/DynamicDateField.vue'
import DynamicRadioField from './fields/DynamicRadioField.vue'
import DynamicSelectField from './fields/DynamicSelectField.vue'
import DynamicTextAreaField from './fields/DynamicTextAreaField.vue'
import DynamicTextField from './fields/DynamicTextField.vue'
import DynamicTimeField from './fields/DynamicTimeField.vue'
import type { TicketFormHtmlType } from '@/types/services'

/**
 * Registry mapping `HtmlType` → renderer component. New field kinds are added
 * by dropping a new component and appending an entry here — no changes to
 * `DynamicFormField.vue` or the composable.
 *
 * Each renderer receives the same props (`field`, `modelValue`, `error`) and
 * emits `update:modelValue` with `{ value, valueId }`.
 */
export const DYNAMIC_FIELD_RENDERERS: Partial<Record<TicketFormHtmlType, Component>> = {
  radio: DynamicRadioField,
  dropdown: DynamicSelectField,
  bool: DynamicBoolField,
  checkbox: DynamicCheckboxField,
  textarea: DynamicTextAreaField,
  date: DynamicDateField,
  time: DynamicTimeField,
  text: DynamicTextField,
  tel: DynamicTextField,
  email: DynamicTextField,
  number: DynamicTextField,
}

export const DEFAULT_FIELD_RENDERER: Component = DynamicTextField
