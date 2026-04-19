<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { CoinsIcon } from 'lucide-vue-next'
  import { cn } from '@/utils/cn'
  import { formatNumber } from '@/utils'

  export interface PointsInfoSectionProps {
    /** Current points balance */
    points?: number
    /** Active until date */
    activeUntil?: string
    /** Additional CSS classes */
    class?: HTMLAttributes['class']
  }

  const props = withDefaults(defineProps<PointsInfoSectionProps>(), {
    points: 0,
    activeUntil: '30 Dec 2026',
  })
</script>

<template>
  <div :class="cn('flex flex-col gap-2', props.class)">
    <!-- Points Info -->
    <div class="flex flex-col items-start gap-1 self-stretch">
      <!-- Points Label -->
      <p class="body-caption-medium self-stretch text-slate-700">Poin Kamu</p>

      <!-- Points Value -->
      <div class="flex flex-row items-center gap-2 self-stretch">
        <CoinsIcon class="size-4 shrink-0 text-slate-950" />
        <span class="heading-l flex-1 leading-none text-slate-950">{{ formatNumber(points) }}</span>
      </div>
    </div>

    <!-- Active Until -->
    <div
      class="body-caption-semibold flex flex-row items-center justify-between gap-1 self-stretch rounded-full bg-slate-100 px-4 py-2 text-slate-700"
    >
      <span>Aktif sampai</span>
      <span>{{ activeUntil }}</span>
    </div>
  </div>
</template>
