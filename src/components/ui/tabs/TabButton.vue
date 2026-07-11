<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { TAB_COUNT_CLASSES, type TabTone } from './types'

  defineProps<{
    label: string
    active: boolean
    count?: number
    countTone?: TabTone
    /** Additional classes merged onto the button. */
    class?: HTMLAttributes['class']
  }>()

  defineEmits<{ click: [] }>()
</script>

<template>
  <button
    type="button"
    role="tab"
    :aria-selected="active"
    :class="[
      'inline-flex items-center gap-2 whitespace-nowrap transition-colors',
      active ? 'text-primary-700' : 'text-neutral-600 hover:text-neutral-900',
      $props.class,
    ]"
    @click="$emit('click')"
  >
    <span class="body-m-medium">{{ label }}</span>
    <span
      v-if="typeof count === 'number' && count > 0"
      :class="[
        'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5',
        'text-xxs leading-none font-semibold tabular-nums',
        TAB_COUNT_CLASSES[countTone ?? 'neutral'],
      ]"
    >
      {{ count }}
    </span>
  </button>
</template>
