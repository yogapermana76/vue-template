<script setup lang="ts">
  import { computed } from 'vue'
  import { CalendarClock } from 'lucide-vue-next'
  import { EmptyState } from '@/components/ui/empty-state'
  import { Spinner } from '@/components/ui/spinner'
  import { SectionHeader } from '@/components/shared'
  import type { LoketSchedule } from '@/types/services/loket'
  import { formatScheduleDateOrDay, formatScheduleTime } from '../utils/formatSchedule'
  import ScheduleCard from './schedule/ScheduleCard.vue'

  const props = defineProps<{
    schedules: LoketSchedule[]
    loading?: boolean
  }>()

  interface ScheduleView {
    id: number
    category: string
    type: string
    dateOrDay: string
    startTime: string
    endTime: string
    isDaily: boolean
  }

  const rows = computed<ScheduleView[]>(() =>
    props.schedules.map(s => ({
      id: s.ID,
      category: s.Category ?? '-',
      type: s.Type ?? '-',
      dateOrDay: formatScheduleDateOrDay(s),
      startTime: formatScheduleTime(s.StartTime, s.Timezone),
      endTime: formatScheduleTime(s.EndTime, s.Timezone),
      isDaily: s.ScheduleCode === 'DAILY',
    })),
  )
</script>

<template>
  <section class="flex flex-col gap-4">
    <SectionHeader
      title="Jadwal Event"
      subtitle="Daftar sesi/event terjadwal untuk program terpilih"
    />

    <div
      v-if="props.loading"
      class="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-neutral-200 py-10"
    >
      <Spinner size="md" tone="primary" label="Memuat jadwal event..." />
    </div>

    <EmptyState
      v-else-if="!props.schedules.length"
      :icon="CalendarClock"
      title="Belum ada jadwal"
      description="Belum ada jadwal event untuk program ini."
      class="rounded-lg border border-dashed border-neutral-200 py-10"
    />

    <ul v-else class="animate-in fade-in grid grid-cols-1 gap-3 duration-500 md:grid-cols-2">
      <ScheduleCard
        v-for="row in rows"
        :key="row.id"
        :category="row.category"
        :type="row.type"
        :date-or-day="row.dateOrDay"
        :start-time="row.startTime"
        :end-time="row.endTime"
        :is-daily="row.isDaily"
      />
    </ul>
  </section>
</template>
