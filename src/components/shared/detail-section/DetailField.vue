<script lang="ts" setup>
  interface Props {
    label: string
    /** Value shown when no slot provided */
    value?: string | number | null
    /** Span both columns in 2-col grid */
    wide?: boolean
  }

  defineProps<Props>()
</script>

<template>
  <div :class="['flex flex-col gap-0.5', wide && 'sm:col-span-2']">
    <!-- Tiny-uppercase label — matches SectionHeader treatment + prototype
         `.sec .st` convention so the same field style renders identically
         in sheets, dialogs, and pages. -->
    <span class="text-xxs font-semibold tracking-wider text-neutral-500 uppercase">
      {{ label }}
    </span>
    <div class="body-m body-m-medium wrap-break-word text-neutral-950">
      <slot>
        <span v-if="value !== null && value !== undefined && value !== ''">{{ value }}</span>
        <span v-else class="font-normal text-neutral-400">—</span>
      </slot>
    </div>
  </div>
</template>
