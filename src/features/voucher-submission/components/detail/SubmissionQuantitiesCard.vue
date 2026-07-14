<script setup lang="ts">
  import { computed } from 'vue'
  import { z } from 'zod'
  import { FileText } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { DataTable } from '@/components/ui/table'
  import { SectionHeader } from '@/components/shared'
  import { buildSubmissionQuantityColumns } from './submissionQuantityColumns'
  import type { SubmissionQuantityDetail } from '../../types'

  const props = defineProps<{
    quantities: SubmissionQuantityDetail[]
    mode: 'view' | 'edit'
    approvedInputs?: Record<number, number>
    submitting?: boolean
  }>()

  const emit = defineEmits<{
    'update:approvedInputs': [value: Record<number, number>]
    approve: []
    reject: []
  }>()

  const columns = computed(() => buildSubmissionQuantityColumns(props.mode))

  const schemaFor = (max: number) =>
    z
      .number({ invalid_type_error: `maksimal ${max}` })
      .min(0)
      .max(max, `maksimal ${max}`)

  const errorFor = (row: SubmissionQuantityDetail): string | null => {
    const value = props.approvedInputs?.[row.ticketId]
    if (value === undefined) return null
    const result = schemaFor(row.requested).safeParse(value)
    return result.success ? null : (result.error.issues[0]?.message ?? null)
  }

  const hasErrors = computed(() => props.quantities.some(q => errorFor(q) !== null))

  const setApprovedFor = (ticketId: number, raw: string | number) => {
    const n = Number(raw)
    const value = Number.isFinite(n) ? Math.max(0, n) : 0
    const next = { ...(props.approvedInputs ?? {}) }
    next[ticketId] = value
    emit('update:approvedInputs', next)
  }
</script>

<template>
  <section
    class="bg-card shadow-card flex min-w-0 flex-col overflow-hidden rounded-lg border border-neutral-200"
  >
    <DataTable
      :data="quantities"
      :columns="columns"
      row-key="ticketId"
      empty-message="Tidak ada data pengajuan"
    >
      <template #toolbar>
        <div
          class="from-primary-50 to-background border-b border-neutral-200 bg-linear-to-b px-5 py-4"
        >
          <SectionHeader
            title="Pengajuan"
            subtitle="Kuota per kategori dan tipe voucher"
            :icon="FileText"
            size="md"
          />
        </div>
      </template>

      <template #cell-approved="{ row }">
        <template v-if="mode === 'edit'">
          <div class="flex flex-col gap-1">
            <Input
              :model-value="approvedInputs?.[(row as SubmissionQuantityDetail).ticketId] ?? ''"
              type="number"
              min="0"
              :max="(row as SubmissionQuantityDetail).requested"
              size="sm"
              placeholder="Tulis angka"
              class="w-28"
              :aria-invalid="errorFor(row as SubmissionQuantityDetail) !== null || undefined"
              @update:model-value="
                v => setApprovedFor((row as SubmissionQuantityDetail).ticketId, v)
              "
            />
            <span
              v-if="errorFor(row as SubmissionQuantityDetail)"
              class="body-caption text-error-600"
            >
              {{ errorFor(row as SubmissionQuantityDetail) }}
            </span>
          </div>
        </template>
        <template v-else>
          <span class="body-m-medium text-neutral-900 tabular-nums">
            {{ (row as SubmissionQuantityDetail).approved ?? '—' }}
          </span>
        </template>
      </template>
    </DataTable>

    <footer
      v-if="mode === 'edit'"
      class="flex items-center justify-end gap-2 bg-neutral-50/50 px-5 py-3"
    >
      <Button variant="danger" soft size="md" :disabled="submitting" @click="emit('reject')">
        Tolak
      </Button>
      <Button
        variant="primary"
        size="md"
        :loading="submitting"
        :disabled="hasErrors"
        @click="emit('approve')"
      >
        Setujui
      </Button>
    </footer>
  </section>
</template>
