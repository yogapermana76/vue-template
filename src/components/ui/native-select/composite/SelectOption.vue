<script setup lang="ts" generic="T extends AcceptableValue = string">
  import type { AcceptableValue } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import type { ComboboxOption, ComboboxGroup } from '@/components/ui/combobox/types'
  import { computed } from 'vue'
  import NativeSelect from '../NativeSelect.vue'
  import NativeSelectOption from '../NativeSelectOption.vue'
  import NativeSelectOptGroup from '../NativeSelectOptGroup.vue'

  export interface SelectOptionProps<T extends AcceptableValue = string> {
    /** v-model value */
    modelValue?: T
    /** Flat array of options */
    options?: ComboboxOption<T>[]
    /** Grouped options */
    groups?: ComboboxGroup<T>[]
    /** Placeholder text */
    placeholder?: string
    /** Disabled state */
    disabled?: boolean
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<SelectOptionProps<T>>(), {
    options: () => [],
    placeholder: 'Pilih opsi...',
    disabled: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: T]
  }>()

  const internalValue = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value as T),
  })
</script>

<template>
  <NativeSelect v-model="internalValue" :disabled="disabled" :class="props.class" v-bind="$attrs">
    <!-- Placeholder option -->
    <NativeSelectOption value="" disabled>{{ placeholder }}</NativeSelectOption>

    <!-- Flat options -->
    <template v-if="options && options.length > 0">
      <NativeSelectOption
        v-for="option in options"
        :key="String(option.value)"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </NativeSelectOption>
    </template>

    <!-- Grouped options -->
    <template v-if="groups && groups.length > 0">
      <NativeSelectOptGroup v-for="group in groups" :key="group.label" :label="group.label">
        <NativeSelectOption
          v-for="option in group.options"
          :key="String(option.value)"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </NativeSelectOption>
      </NativeSelectOptGroup>
    </template>

    <!-- Custom slot for manual option definition -->
    <slot />
  </NativeSelect>
</template>
