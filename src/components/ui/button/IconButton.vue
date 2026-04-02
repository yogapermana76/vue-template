<script setup lang="ts">
  import type { PrimitiveProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import type { ButtonVariants } from '.'
  import { Button } from '.'
  import { cn } from '@/utils/cn'

  interface Props extends PrimitiveProps {
    variant?: ButtonVariants['variant']
    size?: 'sm' | 'md' | 'lg'
    isDarkBg?: ButtonVariants['isDarkBg']
    title?: string
    class?: HTMLAttributes['class']
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'tertiary',
    size: 'md',
    isDarkBg: false,
    disabled: false,
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  // Map size to button size - size represents both button and icon size
  const buttonSize = computed(() => {
    return props.size === 'lg' ? 'lg' : 'xs'
  })

  // Computed class combining all tailwind classes
  const computedClass = computed(() => {
    // Map size to icon size - proportional to button size
    const iconSizeClassMap = {
      sm: '[&_svg]:size-3', // 12px for button 32x32
      md: '[&_svg]:size-5', // 20px for button 32x32 (default)
      lg: '[&_svg]:size-6', // 24px for button 48x48
    }

    const buttonDimensionClassMap = {
      sm: 'w-8 h-8', // 32x32px
      md: 'w-8 h-8', // 32x32px
      lg: 'w-12 h-12', // 48x48px
    }

    return cn(
      'p-1 gap-2.5',
      buttonDimensionClassMap[props.size],
      iconSizeClassMap[props.size],
      props.class,
    )
  })

  const handleClick = (event: MouseEvent) => {
    if (!props.disabled) emit('click', event)
  }
</script>

<template>
  <Button
    :variant="variant"
    :size="buttonSize"
    layout="iconOnly"
    :is-dark-bg="isDarkBg"
    :disabled="disabled"
    :title="title"
    :class="computedClass"
    :as="as"
    :as-child="asChild"
    @click="handleClick"
  >
    <slot />
  </Button>
</template>
