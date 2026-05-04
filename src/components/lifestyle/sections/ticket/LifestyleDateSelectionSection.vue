<script setup lang="ts">
  import { DatePickerCard } from '@/components/lifestyle/cards/date-picker'
  import { getMockAvailableDates } from '@/mocks/lifestyle/ticket-data'

  export interface LifestyleDateSelectionSectionProps {
    /** Section title */
    title?: string
    /** Program/Event ID to fetch available dates */
    programId?: string
    /** Selected ISO date (YYYY-MM-DD) */
    selectedDate: string | null
  }

  withDefaults(defineProps<LifestyleDateSelectionSectionProps>(), {
    title: 'Pilih Tanggal',
  })

  defineEmits<{
    'date-selected': [isoDate: string]
  }>()

  // Fetch available dates based on programId
  // TODO: Replace with actual API call using composable
  const dates = getMockAvailableDates()
</script>

<template>
  <section class="flex flex-col gap-3">
    <h2 class="body-l-semibold text-slate-950">{{ title }}</h2>
    <div class="scrollbar-none flex gap-2 overflow-x-auto pb-2">
      <DatePickerCard
        v-for="dateItem in dates"
        :key="dateItem.date"
        :date="dateItem.date"
        :available="dateItem.available"
        :status-label="dateItem.statusLabel"
        :selected="selectedDate === dateItem.date && dateItem.available !== false"
        @click="dateItem.available !== false ? $emit('date-selected', dateItem.date) : undefined"
      />
    </div>
  </section>
</template>
