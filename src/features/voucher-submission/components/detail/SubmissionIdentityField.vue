<script setup lang="ts">
  import type { Component } from 'vue'

  defineProps<{
    icon: Component
    label: string
    value: string
    /** Override truncate — use `break-all` for emails, `truncate` for names. */
    valueClass?: string
  }>()
</script>

<template>
  <div class="flex items-start gap-3">
    <span
      class="bg-primary-50 text-primary-700 flex size-8 shrink-0 items-center justify-center rounded-md"
    >
      <component :is="icon" class="size-4" />
    </span>
    <div class="min-w-0">
      <dt class="body-caption text-neutral-500">{{ label }}</dt>
      <dd :class="['body-m-semibold text-neutral-950', valueClass ?? 'truncate']">
        {{ value }}
      </dd>
    </div>
  </div>
</template>
