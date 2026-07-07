<script setup lang="ts">
  import { formatDateRange } from '@/utils/date'
  import { Divider } from '@/components/ui/divider'
  import type { HolidayMarker } from './composables/useHolidayMap'

  defineProps<{ holidays: HolidayMarker[] }>()
</script>

<template>
  <div v-if="holidays.length" class="mt-3 flex flex-col gap-1.5">
    <Divider variant="dashed" class="mb-1.5" />
    <div v-for="h in holidays" :key="h.name" class="flex items-center gap-2">
      <span
        class="relative inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-red-50 ring-1 ring-red-200 ring-inset"
      >
        <span class="absolute size-2.5 animate-ping rounded-full bg-red-300 opacity-60" />
        <span class="relative size-1.5 rounded-full bg-red-400" />
      </span>
      <div class="flex flex-col">
        <span class="text-xs font-medium text-neutral-700">{{ h.name }}</span>
        <span class="text-xs text-neutral-400">{{ formatDateRange(h.startDate, h.endDate) }}</span>
      </div>
    </div>
  </div>
</template>
