<script setup lang="ts">
  import {
    DatePickerCard,
    type DatePickerCardProps,
  } from '@/components/lifestyle/cards/date-picker'

  interface Props {
    title?: string
    dates: DatePickerCardProps[]
    selectedIndex: number
  }

  withDefaults(defineProps<Props>(), {
    title: 'Pilih Tanggal',
  })

  const emit = defineEmits<{
    select: [index: number]
  }>()

  function handleDateSelect(index: number, available?: boolean) {
    if (available !== false) {
      emit('select', index)
    }
  }
</script>

<template>
  <section class="flex flex-col gap-3 px-4">
    <h2 class="body-l-semibold text-slate-950">{{ title }}</h2>
    <div class="scrollbar-none flex gap-2 overflow-x-auto pb-2">
      <DatePickerCard
        v-for="(dateItem, index) in dates"
        :key="index"
        :day-name="dateItem.dayName"
        :date="dateItem.date"
        :month="dateItem.month"
        :year="dateItem.year"
        :available="dateItem.available"
        :status-label="dateItem.statusLabel"
        :selected="selectedIndex === index && dateItem.available !== false"
        @click="handleDateSelect(index, dateItem.available)"
      />
    </div>
  </section>
</template>
