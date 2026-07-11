<script setup lang="ts">
  import type { Component } from 'vue'
  import { DetailField } from '@/components/shared'

  defineProps<{
    label: string
    value: string
    icon: Component
  }>()
</script>

<template>
  <DetailField :label="label">
    <span class="body-m-medium inline-flex items-center gap-1.5 text-neutral-950 tabular-nums">
      <component :is="icon" class="size-3.5 shrink-0 text-neutral-500" />
      {{ value }}
    </span>
  </DetailField>
</template>
