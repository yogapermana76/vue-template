<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { ArrowLeft } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { cn } from '@/utils/cn'

  /**
   * Reusable page header for admin/detail/create pages.
   *
   * Layout:
   *   [back?]  title  [badges?]           [actions?]
   *            subtitle
   *            [meta?]
   *
   *   [below? — e.g. tab bar, actionbar, secondary toolbar]
   *
   * Only `title` is required; every other piece is optional.
   */

  interface Props {
    title: string
    subtitle?: string
    /** Show the built-in back button */
    back?: boolean
    /** Aria-label for the back button */
    backLabel?: string
    /** Container class override */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<Props>(), {
    back: false,
    backLabel: 'Back',
  })

  defineEmits<{
    back: []
  }>()
</script>

<template>
  <div :class="cn('mb-5', props.class)" data-slot="page-header">
    <div class="flex flex-wrap items-start gap-3">
      <!-- Back button — aligned with the title row -->
      <slot v-if="back || $slots.back" name="back">
        <Button
          variant="secondary"
          size="sm"
          layout="iconOnly"
          class="shrink-0"
          :aria-label="backLabel"
          @click="$emit('back')"
        >
          <ArrowLeft class="size-4" />
        </Button>
      </slot>

      <!-- Title block: title + subtitle + meta all share the same left edge -->
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="heading-m text-foreground truncate leading-none">
            {{ title }}
          </h1>
          <div v-if="$slots.badges" class="flex flex-wrap items-center gap-1.5">
            <slot name="badges" />
          </div>
        </div>

        <p v-if="subtitle" class="body-m text-muted-foreground mt-1.5">
          {{ subtitle }}
        </p>

        <div v-if="$slots.meta" class="body-caption text-muted-foreground mt-1">
          <slot name="meta" />
        </div>
      </div>

      <!-- Right: actions — top-aligned with the title row -->
      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </div>

    <!-- Optional slot below the header row (tab bar, secondary toolbar, etc.) -->
    <div v-if="$slots.below" class="mt-4">
      <slot name="below" />
    </div>
  </div>
</template>
