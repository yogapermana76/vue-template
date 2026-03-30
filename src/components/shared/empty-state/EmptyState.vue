<script setup lang="ts">
  import type { Component, HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'

  interface Props {
    icon?: Component
    title: string
    description?: string
    class?: HTMLAttributes['class']
  }

  const props = defineProps<Props>()
</script>

<template>
  <div :class="cn('py-12 text-center', props.class)">
    <component v-if="icon" :is="icon" class="text-muted-foreground mx-auto mb-4 size-12" />
    <slot v-else name="icon" />
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <p v-if="description" class="text-muted-foreground mt-1">
      {{ description }}
    </p>
    <slot name="description" />
    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>
