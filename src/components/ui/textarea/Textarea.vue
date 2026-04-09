<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { useVModel } from '@vueuse/core'
  import { cn } from '@/utils/cn'

  const props = defineProps<{
    defaultValue?: string | number
    modelValue?: string | number
    class?: HTMLAttributes['class']
    unstyled?: boolean
  }>()

  const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void
  }>()

  const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
  })
</script>

<template>
  <textarea
    v-model="modelValue"
    data-slot="textarea"
    :class="
      cn(
        // Base styles (always applied)
        'w-full min-w-0 bg-transparent text-sm leading-5 text-neutral-900 outline-none',
        'placeholder:text-neutral-400',
        'disabled:cursor-not-allowed disabled:text-neutral-400',
        // Standalone styles
        !unstyled && [
          'min-h-16 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 transition-colors',
          'hover:border-neutral-300',
          'focus:border-primary-600 focus:border-2 focus:px-2.75 focus:py-2.25',
          'disabled:bg-neutral-100',
          'aria-invalid:border-error-500 aria-invalid:border-2 aria-invalid:px-2.75 aria-invalid:py-2.25',
        ],
        props.class,
      )
    "
  />
</template>
