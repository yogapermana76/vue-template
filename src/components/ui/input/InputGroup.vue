<script setup lang="ts">
  import type { HTMLAttributes, Component } from 'vue'
  import { computed, useSlots, provide } from 'vue'
  import { cn } from '@/utils/cn'

  const props = withDefaults(
    defineProps<{
      class?: HTMLAttributes['class']
      prefix?: string
      suffix?: string
      prefixIcon?: Component
      suffixIcon?: Component
      disabled?: boolean
      invalid?: boolean
    }>(),
    {
      disabled: false,
      invalid: false,
    },
  )

  // Provide context to child Input components
  provide('input-group', true)

  const slots = useSlots()

  const hasPrefix = computed(() => props.prefix || props.prefixIcon || slots.prefix)
  const hasSuffix = computed(() => props.suffix || props.suffixIcon || slots.suffix)
</script>

<template>
  <div
    data-slot="input-group"
    :class="
      cn(
        'flex h-10 w-full items-center gap-2 rounded-lg border bg-white px-3 transition-colors',
        'border-neutral-200',
        'hover:border-neutral-300',
        'focus-within:border-primary-600 focus-within:border-2 focus-within:px-2.75',
        disabled && 'cursor-not-allowed bg-neutral-100',
        invalid && 'border-error-500 hover:border-error-500 border-2 px-2.75',
        props.class,
      )
    "
  >
    <!-- Prefix slot/icon/text -->
    <div v-if="hasPrefix" class="flex shrink-0 items-center text-sm text-neutral-500">
      <slot name="prefix">
        <component :is="prefixIcon" v-if="prefixIcon" class="size-5" />
        <span v-else-if="prefix">{{ prefix }}</span>
      </slot>
    </div>

    <!-- Input slot -->
    <div class="flex-1">
      <slot />
    </div>

    <!-- Suffix slot/icon/text -->
    <div v-if="hasSuffix" class="flex shrink-0 items-center text-sm text-neutral-500">
      <slot name="suffix">
        <component :is="suffixIcon" v-if="suffixIcon" class="size-5" />
        <span v-else-if="suffix">{{ suffix }}</span>
      </slot>
    </div>
  </div>
</template>
