<script setup lang="ts">
  import type { Component } from 'vue'
  import { computed } from 'vue'

  type Size = 'sm' | 'md'
  type Variant = 'divided' | 'card'

  interface SizeStyle {
    title: string
    subtitle: string
    divider: string
    iconWrap: string
    iconSize: string
  }

  // Size presets. Add a new size = add an entry here; template stays untouched.
  const SIZE_STYLES: Record<Size, SizeStyle> = {
    sm: {
      title: 'text-primary-700 body-caption font-bold uppercase tracking-wider',
      subtitle: 'body-caption text-neutral-500',
      divider: 'from-neutral-200',
      iconWrap: 'size-4',
      iconSize: 'size-3.5',
    },
    md: {
      title: 'body-l-semibold text-slate-900',
      subtitle: 'body-caption text-neutral-500',
      divider: 'from-primary-200',
      iconWrap: 'size-6',
      iconSize: 'size-5',
    },
  }

  const props = withDefaults(
    defineProps<{
      title: string
      subtitle?: string
      /** Icon shorthand for the `#leading` slot. */
      icon?: Component
      size?: Size
      variant?: Variant
    }>(),
    { size: 'sm', variant: 'divided' },
  )

  const styles = computed(() => SIZE_STYLES[props.size])
  const showDivider = computed(() => props.variant === 'divided')
</script>

<template>
  <div class="flex flex-col gap-0.5">
    <div class="flex items-center gap-3">
      <span
        v-if="$slots.leading || icon"
        :class="['text-primary-600 flex shrink-0 items-center justify-center', styles.iconWrap]"
      >
        <slot name="leading">
          <component :is="icon" :class="styles.iconSize" />
        </slot>
      </span>

      <span :class="['shrink-0', styles.title]">{{ title }}</span>

      <div
        v-if="showDivider"
        :class="['h-px flex-1 bg-linear-to-r to-transparent', styles.divider]"
      />

      <div v-if="$slots.trailing" class="shrink-0">
        <slot name="trailing" />
      </div>
    </div>

    <span v-if="subtitle" :class="styles.subtitle">{{ subtitle }}</span>
  </div>
</template>
