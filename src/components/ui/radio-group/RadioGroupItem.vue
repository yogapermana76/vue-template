<script setup lang="ts">
  import type { RadioGroupItemProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import { reactiveOmit } from '@vueuse/core'
  import { RadioGroupIndicator, RadioGroupItem, useForwardProps } from 'reka-ui'
  import { cn } from '@/utils/cn'

  const props = defineProps<RadioGroupItemProps & { class?: HTMLAttributes['class'] }>()

  const delegatedProps = reactiveOmit(props, 'class')

  const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RadioGroupItem
    data-slot="radio-group-item"
    v-bind="forwardedProps"
    :class="
      cn(
        'peer size-4 shrink-0 rounded-full border border-neutral-200 bg-white shadow-xs transition-shadow outline-none',
        'hover:bg-primary-50 hover:border-primary-600',
        'focus-visible:border-primary-200 focus-visible:ring-primary-50 focus-visible:ring-4',
        'data-[state=checked]:bg-primary-50 data-[state=checked]:border-primary-600',
        'disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100',
        'aria-invalid:ring-error-500/20 aria-invalid:border-error-500',
        props.class,
      )
    "
  >
    <RadioGroupIndicator
      data-slot="radio-group-indicator"
      class="flex size-full items-center justify-center"
    >
      <slot>
        <span class="bg-primary-600 size-1.5 rounded-full peer-disabled:bg-neutral-500" />
      </slot>
    </RadioGroupIndicator>
  </RadioGroupItem>
</template>
