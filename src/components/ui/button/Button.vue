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
  }

  const props = withDefaults(defineProps<Props>(), {
    as: 'button',
    variant: 'primary',
    size: 'md',
    layout: 'iconLeft',
    isDarkBg: false,
    state: 'default',
    disabled: false,
  })

  const computedState = computed<ButtonState>(() => {
    return props.disabled ? 'disabled' : props.state
  })

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
    if (!props.disabled) emit('click', event)
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
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <slot />
  </Primitive>
</template>
