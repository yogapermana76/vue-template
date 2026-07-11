<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { ArrowLeft } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { cn } from '@/utils/cn'

  // Layout:
  //   [back?]  title [badges?]                       [actions?]
  //            subtitle
  //            [meta?]
  //
  //   [below? — tab bar, secondary toolbar, etc.]

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

  const slots = defineSlots<{
    back?: () => unknown
    badges?: () => unknown
    meta?: () => unknown
    actions?: () => unknown
    below?: () => unknown
  }>()

  // Single-line title (no subtitle/meta/badges) → center the whole row so the back
  // button and actions align with the title vertically. Otherwise top-align.
  const alignItems = computed(() =>
    props.subtitle || slots.meta || slots.badges ? 'items-start' : 'items-center',
  )
</script>

<template>
  <div :class="cn('mb-5', props.class)" data-slot="page-header">
    <div :class="['flex flex-wrap gap-3', alignItems]">
      <slot v-if="back || $slots.back" name="back">
        <Button
          variant="secondary"
          size="xs"
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
          <!-- `leading-tight` (not `leading-none`) so descenders like "g"/"y"
               aren't clipped by `truncate`'s overflow-hidden box. -->
          <h1 class="heading-m text-foreground truncate leading-tight">
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

      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="$slots.below" class="mt-4">
      <slot name="below" />
    </div>
  </div>
</template>
