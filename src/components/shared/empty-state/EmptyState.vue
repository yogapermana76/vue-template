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
    <component v-if="icon" :is="icon" class="text-primary-400 mx-auto mb-4 size-12" />
    <slot v-else name="icon" />
    <h3 class="text-lg font-semibold text-neutral-800">{{ title }}</h3>
    <p v-if="description" class="mt-1 text-neutral-500">
      {{ description }}
    </p>
    <slot name="description" />
    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>
