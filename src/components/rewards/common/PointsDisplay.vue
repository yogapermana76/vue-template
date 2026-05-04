<script setup lang="ts">
  import { computed } from 'vue'
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import { formatNumber } from '@/utils'
  import CoinIcon from '@/assets/icons/coin-24.svg?component'

  export interface PointsDisplayProps {
    /** Current points balance */
    points?: number
    /** Points label text */
    label?: string
    /** Theme variant */
    variant?: 'light' | 'dark'
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<PointsDisplayProps>(), {
    points: 0,
    label: 'Poin Kamu',
    variant: 'light',
  })

  const colorClasses = computed(() => {
    return props.variant === 'dark'
      ? {
          label: 'text-white',
          value: 'text-white',
        }
      : {
          label: 'text-slate-700',
          value: 'text-slate-950',
        }
  })
</script>

<template>
  <div :class="cn('flex flex-col items-start gap-1 self-stretch', props.class)">
    <!-- Points Label -->
    <p :class="cn('body-caption-medium self-stretch', colorClasses.label)">{{ label }}</p>

    <!-- Points Value and Action -->
    <div class="flex flex-row items-center gap-2 self-stretch">
      <CoinIcon />

      <!-- Points Value -->
      <span :class="cn('heading-l flex-1 leading-none', colorClasses.value)">
        {{ formatNumber(points) }}
      </span>

      <!-- Optional Action Slot -->
      <slot name="action" />
    </div>
  </div>
</template>
