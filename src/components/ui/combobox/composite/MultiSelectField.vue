<script setup lang="ts" generic="T extends string | number | Record<string, unknown>">
  import type { HTMLAttributes, Component } from 'vue'
  import type { ComboboxOption, ComboboxGroup } from '../types'
  import { computed, ref } from 'vue'
  import { ChevronsUpDown, X } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'
  import { Badge } from '@/components/ui/badge'
  import { FormField } from '@/components/ui/form'
  import { InputGroup } from '@/components/ui/input'
  import MultiSelect from '../MultiSelect.vue'

  export interface MultiSelectFieldProps<T> {
    /** v-model value (array for multi-select) */
    modelValue?: T[]
    /** Array of options (required if groups is not provided) */
    options?: ComboboxOption<T>[]
    /** Grouped options (alternative to options) */
    groups?: ComboboxGroup<T>[]
    /** Label text */
    label?: string
    /** Placeholder text */
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
    /** Maximum number of badges to show before collapsing */
    maxDisplayedBadges?: number
    /** Popover side positioning */
    side?: 'top' | 'right' | 'bottom' | 'left'
    /** Popover alignment */
    align?: 'start' | 'center' | 'end'
  }

  const props = withDefaults(defineProps<MultiSelectFieldProps<T>>(), {
    modelValue: () => [],
    options: () => [],
    placeholder: 'Pilih opsi...',
    searchPlaceholder: 'Cari...',
    emptyText: 'Tidak ada hasil ditemukan.',
    required: false,
    disabled: false,
    hideSearch: false,
    hideSuffixIcon: false,
    maxDisplayedBadges: 3,
    side: 'bottom',
    align: 'start',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: T[]]
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

    <!-- Multi Select: Using headless MultiSelect with InputGroup trigger -->
    <MultiSelect
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
      <template #trigger="{ selectedOptions, remove }">
        <InputGroup
          :prefix-icon="prefixIcon"
          :suffix-icon="!hideSuffixIcon ? suffixIcon || ChevronsUpDown : undefined"
          :disabled="disabled"
          :invalid="hasError"
          :focused="open"
          role="combobox"
          :aria-expanded="open"
          tabindex="0"
          :class="cn('h-auto min-h-10 cursor-pointer py-2', disabled && 'cursor-not-allowed')"
        >
          <!-- Content area -->
          <div class="flex flex-1 flex-wrap items-center gap-1">
            <!-- Selected badges -->
            <template v-if="selectedOptions.length > 0">
              <Badge
                v-for="option in selectedOptions.slice(0, maxDisplayedBadges)"
                :key="String(option.value)"
                :variant="option.badge?.variant || 'neutral'"
                class="shrink-0 gap-1 pr-1"
              >
                {{ option.label }}
                <button
                  type="button"
                  class="ml-0.5 rounded-full p-0.5 hover:bg-black/10 focus:outline-none"
                  @click.stop="remove(option.value)"
                >
                  <X class="size-3" />
                </button>
              </Badge>

              <Badge
                v-if="selectedOptions.length > maxDisplayedBadges"
                variant="neutral"
                class="shrink-0"
              >
                +{{ selectedOptions.length - maxDisplayedBadges }} lainnya
              </Badge>
            </template>

            <!-- Placeholder -->
            <span v-else class="text-sm text-neutral-400">
              {{ placeholder }}
            </span>
          </div>
        </InputGroup>
      </template>

      <!-- Forward option slot -->
      <template v-if="$slots.option" #option="{ option }">
        <slot name="option" :option="option" />
      </template>
    </MultiSelect>

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
