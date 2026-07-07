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
    <span class="body-caption text-muted-foreground">
      {{ label }}
    </span>
    <div class="body-m body-m-medium text-foreground wrap-break-word">
      <slot>
        <span v-if="value !== null && value !== undefined && value !== ''">{{ value }}</span>
        <span v-else class="text-muted-foreground font-normal">—</span>
      </slot>
    </div>
  </div>
</template>
