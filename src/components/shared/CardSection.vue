<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { Card } from '@/components/ui'

  interface Props {
    /** Section title */
    title: string
    /** Optional description below title */
    description?: string
    /** Custom class for the card wrapper */
    class?: HTMLAttributes['class']
    /** Custom class for the title */
    titleClass?: HTMLAttributes['class']
    /** Custom class for the description */
    descriptionClass?: HTMLAttributes['class']
    /** Custom class for the content area */
    contentClass?: HTMLAttributes['class']
  }

  const props = defineProps<Props>()
</script>

<template>
  <Card :class="cn('flex flex-col py-0 pt-4', props.class)">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4 px-6">
      <div class="flex-1">
        <h3 :class="cn('heading-s text-slate-900', titleClass)">
          {{ title }}
        </h3>
        <p v-if="description" :class="cn('body-m mt-1 text-slate-600', descriptionClass)">
          {{ description }}
        </p>
      </div>

      <!-- Header slot for custom content (actions, search, filters, etc.) -->
      <div v-if="$slots.header" class="shrink-0">
        <slot name="header" />
      </div>
    </div>

    <!-- Content -->
    <div :class="cn('flex-1', contentClass)">
      <slot />
    </div>
  </Card>
</template>
