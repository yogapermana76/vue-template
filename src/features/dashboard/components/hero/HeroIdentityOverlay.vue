<script setup lang="ts">
  import { CalendarDays, Ticket } from 'lucide-vue-next'
  import { Spinner } from '@/components/ui/spinner'

  defineProps<{
    title: string
    periodLabel: string | null
    loading?: boolean
  }>()
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-6">
    <div class="flex items-start justify-between gap-3">
      <span
        class="pointer-events-auto inline-flex items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1 text-white backdrop-blur-sm"
      >
        <Ticket class="size-3.5" />
        <span class="text-xxs font-semibold tracking-wider uppercase">Program Aktif</span>
      </span>
      <div v-if="$slots.switcher" class="pointer-events-auto shrink-0">
        <slot name="switcher" />
      </div>
    </div>

    <div class="pointer-events-auto flex min-w-0 flex-col gap-1.5">
      <Spinner v-if="loading" size="sm" tone="white" label="Memuat program..." />
      <template v-else>
        <h2
          class="animate-in fade-in slide-in-from-bottom-2 truncate text-lg leading-tight font-bold text-white duration-500 sm:text-2xl"
          :title="title"
        >
          {{ title }}
        </h2>
        <p
          v-if="periodLabel"
          class="body-caption animate-in fade-in inline-flex items-center gap-1.5 truncate text-white/80 tabular-nums duration-700"
        >
          <CalendarDays class="size-3.5 shrink-0" />
          {{ periodLabel }}
        </p>
      </template>
    </div>
  </div>
</template>
