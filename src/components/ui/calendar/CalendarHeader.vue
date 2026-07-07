<script setup lang="ts">
  import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-vue-next'
  import { CalendarHeader, CalendarHeading, CalendarNext, CalendarPrev } from 'reka-ui'
  import { navButtonClasses } from './composables/useCalendarClasses'

  defineProps<{
    pickerMode: 'month' | 'year' | null
  }>()

  const emit = defineEmits<{
    openYearPicker: []
  }>()
</script>

<template>
  <CalendarHeader class="flex items-center justify-between pb-3">
    <CalendarPrev v-if="!pickerMode" :class="navButtonClasses">
      <ChevronLeft class="size-4" />
    </CalendarPrev>
    <div v-else class="h-10 w-10" />

    <CalendarHeading v-slot="{ headingValue }">
      <button
        type="button"
        class="text-primary-600 hover:text-primary-700 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-base font-semibold transition-colors outline-none focus-visible:ring-2"
        @click="emit('openYearPicker')"
      >
        {{ headingValue }}
        <ChevronDown
          class="size-4 transition-transform duration-200"
          :class="pickerMode ? 'rotate-180' : ''"
        />
      </button>
    </CalendarHeading>

    <CalendarNext v-if="!pickerMode" :class="navButtonClasses">
      <ChevronRight class="size-4" />
    </CalendarNext>
    <div v-else class="h-10 w-10" />
  </CalendarHeader>
</template>
