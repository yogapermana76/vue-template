<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { cn } from '@/utils/cn'
  import PointsDisplay from '@/components/rewards/common/PointsDisplay.vue'

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
    <PointsDisplay :points="points" variant="light" />

    <!-- Active Until -->
    <div
      class="body-caption-semibold flex flex-row items-center justify-between gap-1 self-stretch rounded-full bg-slate-100 px-4 py-2 text-slate-700"
    >
      <span>Aktif sampai</span>
      <span>{{ activeUntil }}</span>
    </div>
  </div>
</template>
