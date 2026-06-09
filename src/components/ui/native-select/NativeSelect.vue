<script setup lang="ts">
  import type { AcceptableValue } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import { reactiveOmit, useVModel } from '@vueuse/core'
  import { ChevronDownIcon } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'

  defineOptions({
    inheritAttrs: false,
  })

  const props = defineProps<{
    modelValue?: AcceptableValue | AcceptableValue[]
    class?: HTMLAttributes['class']
  }>()

  const emit = defineEmits<{
    'update:modelValue': AcceptableValue
  }>()

  const modelValue = useVModel(props, 'modelValue', emit, {
    passive: true,
    defaultValue: '',
  })

  const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <div class="group/native-select relative w-full" data-slot="native-select-wrapper">
    <select
      v-bind="{ ...$attrs, ...delegatedProps }"
      v-model="modelValue"
      data-slot="native-select"
      :class="
        cn(
          'h-10 w-full min-w-0 appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 pr-9 text-sm leading-5 text-neutral-900 transition-colors outline-none',
          'placeholder:text-neutral-400',
          'hover:border-neutral-300',
          'focus:border-primary-600 focus:border-2 focus:px-2.75 focus:py-2.25 focus:pr-8.75',
          'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400',
          'aria-invalid:border-error-500 aria-invalid:border-2 aria-invalid:px-2.75 aria-invalid:py-2.25 aria-invalid:pr-8.75',
          props.class,
        )
      "
    >
      <slot />
    </select>
    <ChevronDownIcon
      class="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-neutral-500 select-none"
      aria-hidden="true"
      data-slot="native-select-icon"
    />
  </div>
</template>
