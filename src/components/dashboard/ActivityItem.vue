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
    <div class="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-full">
      <component v-if="icon" :is="icon" class="text-primary size-3.5" />
      <slot v-else name="icon" />
    </div>
    <div class="min-w-0 flex-1">
      <p class="truncate text-xs font-medium">{{ title }}</p>
      <p class="text-muted-foreground text-[10px]">{{ description }}</p>
    </div>
    <slot name="action" />
  </div>
</template>
