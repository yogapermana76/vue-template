<script setup lang="ts">
  import { computed } from 'vue'
  import type { SubmissionQuantityDetail } from '../../types'

  const props = defineProps<{
    quantities: SubmissionQuantityDetail[]
    approvedInputs?: Record<number, number>
    disabled?: boolean
  }>()

  const rows = computed(() =>
    props.quantities.map(q => ({
      id: q.ticketId,
      label: q.type,
      approved: props.approvedInputs?.[q.ticketId] ?? q.approved ?? 0,
      requested: q.requested,
    })),
  )

  const totals = computed(() => ({
    approved: rows.value.reduce((s, r) => s + r.approved, 0),
    requested: rows.value.reduce((s, r) => s + r.requested, 0),
    cutCount: rows.value.filter(r => r.approved < r.requested).length,
  }))
</script>

<template>
  <div v-if="rows.length" class="flex flex-col gap-2">
    <div class="flex items-center justify-between gap-2">
      <span class="body-caption tracking-wide text-neutral-500 uppercase">
        Yang akan disetujui
      </span>
      <span v-if="totals.cutCount > 0" class="body-caption text-warning-700">
        {{ totals.cutCount }} tipe dipotong
      </span>
    </div>

    <div
      class="border-primary-100 bg-primary-50/40 divide-primary-100/70 flex flex-col divide-y overflow-hidden rounded-lg border transition-opacity"
      :class="disabled && 'pointer-events-none opacity-70'"
    >
      <div
        v-for="row in rows"
        :key="row.id"
        class="flex items-center justify-between gap-4 px-4 py-2.5"
      >
        <div class="flex min-w-0 items-center gap-2">
          <span class="bg-primary-500 size-1.5 shrink-0 rounded-full" aria-hidden="true" />
          <span class="body-m-medium truncate text-neutral-900" :title="row.label">
            {{ row.label }}
          </span>
        </div>
        <span class="shrink-0 tabular-nums">
          <span
            :class="[
              'body-m-semibold',
              row.approved < row.requested ? 'text-warning-700' : 'text-primary-700',
            ]"
          >
            {{ row.approved }}
          </span>
          <span class="body-caption text-neutral-500"> / {{ row.requested }}</span>
        </span>
      </div>

      <div class="bg-primary-100/40 flex items-center justify-between gap-4 px-4 py-2.5">
        <span class="body-caption tracking-wide text-neutral-600 uppercase">Total</span>
        <span class="shrink-0 tabular-nums">
          <span class="body-l-semibold text-primary-800">{{ totals.approved }}</span>
          <span class="body-caption text-neutral-500"> / {{ totals.requested }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
