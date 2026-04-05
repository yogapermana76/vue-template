<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { cn } from '@/utils/cn'

  export type DividerVariant = 'solid' | 'dashed'
  export type DividerOrientation = 'horizontal' | 'vertical'

  const props = withDefaults(
    defineProps<{
      class?: HTMLAttributes['class']
      variant?: DividerVariant
      orientation?: DividerOrientation
      thick?: boolean
      connector?: boolean
    }>(),
    {
      variant: 'solid',
      orientation: 'horizontal',
      thick: false,
      connector: false,
    },
  )

  // Check if custom size is provided via class prop
  const hasCustomSize = computed(() => {
    if (!props.class) return false
    const classStr = String(props.class)
    if (props.orientation === 'horizontal') {
      return /\bw-\d+|\bw-\[|\bw-full|\bw-auto/.test(classStr)
    }
    return /\bh-\d+|\bh-\[|\bh-full|\bh-auto/.test(classStr)
  })

  const dividerClasses = computed(() => ({
    horizontal: {
      base: hasCustomSize.value ? '' : 'w-full',
      thin: 'h-px',
      thick: 'h-1',
    },
    vertical: {
      base: hasCustomSize.value ? '' : 'h-full',
      thin: 'w-px',
      thick: 'w-1',
    },
  }))

  const variantClasses = {
    solid: {
      thin: 'border-0 bg-neutral-200',
      thick: 'border-0 bg-neutral-100',
    },
    dashed: {
      thin: 'bg-transparent',
      thick: 'bg-transparent',
    },
  }
</script>

<template>
  <div
    v-if="connector && orientation === 'horizontal'"
    data-slot="divider"
    :class="cn('flex w-full items-center', props.class)"
  >
    <!-- Connector line (vertical dashed) -->
    <div class="flex size-5 shrink-0 items-center justify-center">
      <div class="border-primary-500 h-5 w-px border-l border-dashed" />
    </div>
    <!-- Main divider line -->
    <div
      :class="
        cn(
          'flex-1',
          dividerClasses.horizontal.thin,
          variantClasses[variant].thin,
          variant === 'dashed' && 'border-t border-dashed border-neutral-200',
        )
      "
    />
  </div>

  <div
    v-else-if="connector && orientation === 'vertical'"
    data-slot="divider"
    :class="cn('flex h-full flex-col items-center', props.class)"
  >
    <!-- Connector line (horizontal dashed) -->
    <div class="flex size-5 shrink-0 items-center justify-center">
      <div class="border-primary-500 h-px w-5 border-t border-dashed" />
    </div>
    <!-- Main divider line -->
    <div
      :class="
        cn(
          'flex-1',
          dividerClasses.vertical.thin,
          variantClasses[variant].thin,
          variant === 'dashed' && 'border-l border-dashed border-neutral-200',
        )
      "
    />
  </div>

  <hr
    v-else
    data-slot="divider"
    :class="
      cn(
        dividerClasses[orientation].base,
        thick ? dividerClasses[orientation].thick : dividerClasses[orientation].thin,
        thick ? variantClasses[variant].thick : variantClasses[variant].thin,
        variant === 'dashed' &&
          !thick &&
          (orientation === 'horizontal'
            ? 'border-t border-dashed border-neutral-200'
            : 'border-l border-dashed border-neutral-200'),
        props.class,
      )
    "
  />
</template>
