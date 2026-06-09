<script setup lang="ts">
  import type { HTMLAttributes, InputHTMLAttributes } from 'vue'
  import { useVModel } from '@vueuse/core'
  import { inject, computed, useAttrs } from 'vue'
  import { cn } from '@/utils/cn'

  const props = defineProps<{
    defaultValue?: string | number
    modelValue?: string | number
    class?: HTMLAttributes['class']
    unstyled?: boolean
    readonly?: boolean
    disabled?: boolean
    type?: InputHTMLAttributes['type']
  }>()

  const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void
  }>()

  const attrs = useAttrs()

  const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
  })

  // Check if inside InputGroup by looking for parent data-slot
  const isInsideGroup = inject('input-group', false)

  // Determine input type from props or attrs
  const inputType = computed(() => {
    return props.type || (attrs.type as string) || 'text'
  })

  // Add no-spinner class for number inputs
  const isNumberInput = computed(() => inputType.value === 'number')
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :readonly="readonly"
    :disabled="disabled"
    :tabindex="readonly ? -1 : undefined"
    :class="
      cn(
        // Base styles (always applied)
        'w-full min-w-0 bg-transparent text-sm leading-5 text-neutral-900 outline-none',
        'placeholder:text-neutral-400',
        'disabled:cursor-not-allowed disabled:text-neutral-400',
        // Hide spinner for number inputs
        isNumberInput && 'no-spinner',
        // Standalone styles (not inside group)
        !unstyled &&
          !isInsideGroup && [
            'h-10 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 transition-colors',
            'hover:border-neutral-300',
            'focus:border-primary-600 focus:border-2 focus:px-2.75 focus:py-2.25',
            'disabled:bg-neutral-100',
            'aria-invalid:border-error-500 aria-invalid:border-2 aria-invalid:px-2.75 aria-invalid:py-2.25',
          ],
        // Readonly styles - prevent focus styles and interaction
        readonly && [
          'cursor-default focus:border focus:border-neutral-200 focus:px-3 focus:py-2.5 focus:outline-none',
          !isInsideGroup && 'hover:border-neutral-200',
        ],
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        props.class,
      )
    "
  />
</template>
