<script setup lang="ts" generic="T extends string | number | Record<string, unknown>">
  import type { HTMLAttributes, Component } from 'vue'
  import type { ComboboxOption, ComboboxGroup } from '../types'
  import { computed, ref } from 'vue'
  import { ChevronsUpDown } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'
  import { FormField } from '@/components/ui/form'
  import { InputGroup } from '@/components/ui/input'
  import SearchableSelect from '../SearchableSelect.vue'

  export interface SearchableSelectFieldProps<T> {
    /** v-model value */
    modelValue?: T
    /** Array of options (required if groups is not provided) */
    options?: ComboboxOption<T>[]
    /** Grouped options (alternative to options) */
    groups?: ComboboxGroup<T>[]
    /** Label text */
    label?: string
    /** Placeholder text for trigger */
    placeholder?: string
    /** Search input placeholder text */
    searchPlaceholder?: string
    /** Empty state text */
    emptyText?: string
    /** Input id (also used for label's for attribute) */
    id?: string
    /** Show required indicator (*) */
    required?: boolean
    /** Disabled state */
    disabled?: boolean
    /** Hide search input field */
    hideSearch?: boolean
    /** Helper/description text */
    helper?: string
    /** Error message (overrides helper when present) */
    error?: string | string[]
    /** Right-side footer text */
    footerRight?: string
    /** Additional CSS classes for root */
    class?: HTMLAttributes['class']
    /** Custom class for the popover content */
    contentClass?: HTMLAttributes['class']
    /** Prefix icon (from lucide-vue-next) */
    prefixIcon?: Component
    /** Suffix icon (from lucide-vue-next) - default: ChevronsUpDown */
    suffixIcon?: Component
    /** Hide the suffix icon */
    hideSuffixIcon?: boolean
    /** Popover side positioning */
    side?: 'top' | 'right' | 'bottom' | 'left'
    /** Popover alignment */
    align?: 'start' | 'center' | 'end'
  }

  const props = withDefaults(defineProps<SearchableSelectFieldProps<T>>(), {
    options: () => [],
    placeholder: 'Pilih opsi...',
    searchPlaceholder: 'Cari...',
    emptyText: 'Tidak ada hasil ditemukan.',
    required: false,
    disabled: false,
    hideSearch: false,
    hideSuffixIcon: false,
    side: 'bottom',
    align: 'start',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: T]
  }>()

  const open = ref(false)

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

    <!-- Searchable Select: Using headless SearchableSelect with InputGroup trigger -->
    <SearchableSelect
      v-model:open="open"
      :model-value="modelValue"
      :options="options"
      :groups="groups"
      :search-placeholder="searchPlaceholder"
      :empty-text="emptyText"
      :disabled="disabled"
      :hide-search="hideSearch"
      :content-class="contentClass"
      :side="side"
      :align="align"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <template #trigger="{ selectedOption }">
        <InputGroup
          :prefix-icon="prefixIcon"
          :suffix-icon="!hideSuffixIcon ? suffixIcon || ChevronsUpDown : undefined"
          :disabled="disabled"
          :invalid="hasError"
          :focused="open"
          role="combobox"
          :aria-expanded="open"
          tabindex="0"
          :class="cn('cursor-pointer', disabled && 'cursor-not-allowed')"
        >
          <span
            :class="cn('flex-1 truncate text-left text-sm', !selectedOption && 'text-neutral-400')"
          >
            {{ selectedOption?.label || placeholder }}
          </span>
        </InputGroup>
      </template>

      <!-- Forward option slot -->
      <template v-if="$slots.option" #option="{ option }">
        <slot name="option" :option="option" />
      </template>
    </SearchableSelect>

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
