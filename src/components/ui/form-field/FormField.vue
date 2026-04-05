<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed, useSlots } from 'vue'
  import { Label } from '@/components/ui/label'
  import { cn } from '@/utils/cn'

  const props = withDefaults(
    defineProps<{
      class?: HTMLAttributes['class']
      /** Label text */
      label?: string
      /** For attribute to link label to input */
      for?: string
      /** Show required indicator (*) */
      required?: boolean
      /** Helper/description text */
      helper?: string
      /** Error message (overrides helper when present) */
      error?: string | string[]
      /** Right-side footer text */
      footerRight?: string
      /** Disabled state */
      disabled?: boolean
    }>(),
    {
      required: false,
      disabled: false,
    },
  )

  const slots = useSlots()

  const hasHeader = computed(() => props.label || slots.label || slots.labelRight)
  const hasFooter = computed(
    () => props.helper || props.error || props.footerRight || slots.helper || slots.footerRight,
  )
  const hasError = computed(() => {
    if (Array.isArray(props.error)) return props.error.length > 0
    return !!props.error
  })

  const errorMessages = computed(() => {
    if (!props.error) return []
    return Array.isArray(props.error) ? props.error : [props.error]
  })
</script>

<template>
  <div
    data-slot="form-field"
    :data-disabled="disabled || undefined"
    :data-invalid="hasError || undefined"
    :class="cn('group flex w-full flex-col gap-2', props.class)"
  >
    <!-- Header: Label + Action -->
    <div v-if="hasHeader" class="flex items-center justify-between gap-2">
      <!-- Label -->
      <Label v-if="label || $slots.label" :for="props.for" class="flex items-center gap-0.5">
        <slot name="label">{{ label }}</slot>
        <span v-if="required" class="text-error-500">*</span>
      </Label>

      <!-- Label Right: action, info, or any content -->
      <div v-if="$slots.labelRight" class="shrink-0 text-xs">
        <slot name="labelRight" />
      </div>
    </div>

    <!-- Input slot -->
    <div class="w-full">
      <slot />
    </div>

    <!-- Footer: Helper/Error + Right Helper -->
    <div v-if="hasFooter" class="flex items-start justify-between gap-2">
      <!-- Left: Helper or Error -->
      <div class="flex-1">
        <!-- Error messages -->
        <template v-if="hasError">
          <p
            v-for="(msg, index) in errorMessages"
            :key="index"
            class="body-small-medium text-error-500"
          >
            {{ msg }}
          </p>
        </template>
        <!-- Helper text -->
        <template v-else-if="helper || $slots.helper">
          <p class="body-small-medium text-neutral-800">
            <slot name="helper">{{ helper }}</slot>
          </p>
        </template>
      </div>

      <!-- Right: Footer Right -->
      <div
        v-if="footerRight || $slots.footerRight"
        class="body-small-medium shrink-0 text-neutral-800"
      >
        <slot name="footerRight">{{ footerRight }}</slot>
      </div>
    </div>
  </div>
</template>
