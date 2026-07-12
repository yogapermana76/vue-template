<script setup lang="ts">
  import { CalendarClock, Clock, Tag, Ticket } from 'lucide-vue-next'
  import { Badge } from '@/components/ui/badge'
  import ScheduleField from './ScheduleField.vue'

  defineProps<{
    category: string
    type: string
    dateOrDay: string
    startTime: string
    endTime: string
    isDaily: boolean
  }>()
</script>

<template>
  <li
    class="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 hover:shadow-xs"
  >
    <div class="flex flex-wrap items-center gap-1.5">
      <Badge variant="secondary-soft">
        <Tag class="size-3" />
        {{ category }}
      </Badge>
      <Badge variant="neutral">
        <Ticket class="size-3" />
        {{ type }}
      </Badge>
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <ScheduleField
        :label="isDaily ? 'Hari' : 'Tanggal'"
        :value="dateOrDay"
        :icon="CalendarClock"
      />
      <div class="grid grid-cols-2 gap-3">
        <ScheduleField label="Mulai" :value="startTime" :icon="Clock" />
        <ScheduleField label="Selesai" :value="endTime" :icon="Clock" />
      </div>
    </div>
  </li>
</template>
