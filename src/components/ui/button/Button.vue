<script setup lang="ts">
  import type { PrimitiveProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import type { ButtonVariants } from '.'
  import { Primitive } from 'reka-ui'
  import { cn } from '@/utils/cn'
  import { buttonVariants } from '.'

  type ButtonState = 'default' | 'pressed' | 'disabled'

  interface Props extends PrimitiveProps {
    variant?: ButtonVariants['variant']
    size?: ButtonVariants['size']
    layout?: ButtonVariants['layout']
    isDarkBg?: ButtonVariants['isDarkBg']
    state?: ButtonState
    class?: HTMLAttributes['class']
    disabled?: boolean
    loading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    as: 'button',
    variant: 'primary',
    size: 'md',
    layout: 'iconLeft',
    isDarkBg: false,
    state: 'default',
    disabled: false,
    loading: false,
  })

  const computedState = computed<ButtonState>(() => {
    return props.disabled || props.loading ? 'disabled' : props.state
  })

  const isDisabled = computed(() => props.disabled || props.loading)

  const buttonClasses = computed(() => {
    return cn(
      buttonVariants({
        variant: props.variant,
        size: props.size,
        layout: props.layout,
        isDarkBg: props.isDarkBg,
      }),
      props.class,
    )
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const handleClick = (event: MouseEvent) => {
    if (!isDisabled.value) emit('click', event)
  }
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :data-layout="layout"
    :data-dark-bg="isDarkBg"
    :data-state="computedState"
    :as="as"
    :as-child="asChild"
    :disabled="isDisabled"
    :class="cn(buttonClasses, loading && 'relative opacity-70')"
    @click="handleClick"
  >
    <span :class="loading && 'invisible'">
      <slot />
    </span>
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <svg
        class="h-5 w-5 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
  </Primitive>
</template>
