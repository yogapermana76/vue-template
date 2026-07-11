<script setup lang="ts">
  import type { ProgressRootProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'
  import { reactiveOmit } from '@vueuse/core'
  import { ProgressIndicator, ProgressRoot } from 'reka-ui'
  import { cn } from '@/utils/cn'

  type ProgressTone = 'default' | 'onDark'

  const props = withDefaults(
    defineProps<
      ProgressRootProps & {
        class?: HTMLAttributes['class']
        tone?: ProgressTone
      }
    >(),
    {
      modelValue: 0,
      tone: 'default',
    },
  )

  const delegatedProps = reactiveOmit(props, 'class', 'tone')

  const TONE_STYLES: Record<ProgressTone, { track: string; indicator: string }> = {
    default: { track: 'bg-slate-200', indicator: 'bg-primary-600' },
    onDark: { track: 'bg-white/15', indicator: 'bg-white' },
  }

  const tone = computed(() => TONE_STYLES[props.tone])
</script>

<template>
  <ProgressRoot
    data-slot="progress"
    v-bind="delegatedProps"
    :class="cn('relative h-1.5 w-full overflow-hidden rounded-full', tone.track, props.class)"
  >
    <ProgressIndicator
      data-slot="progress-indicator"
      :class="cn('h-full w-full flex-1 transition-all', tone.indicator)"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
    />
  </ProgressRoot>
</template>
