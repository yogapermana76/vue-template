<script setup lang="ts">
  import type { Component } from 'vue'

  interface Props {
    title: string
    description: string
    icon?: Component
  }

  defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="bg-primary-100 flex size-8 shrink-0 items-center justify-center rounded-full">
      <component v-if="icon" :is="icon" class="text-primary-600 size-3.5" />
      <slot v-else name="icon" />
    </div>
    <div class="min-w-0 flex-1">
      <p class="truncate text-xs font-medium text-neutral-800">{{ title }}</p>
      <p class="text-[10px] text-neutral-500">{{ description }}</p>
    </div>
    <slot name="action" />
  </div>
</template>
