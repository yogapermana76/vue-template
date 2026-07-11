<script setup lang="ts">
  import { computed } from 'vue'
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
    approvedInputs?: Record<string, number>
    submitting?: boolean
  }>()

  const emit = defineEmits<{
    'update:approvedInputs': [value: Record<string, number>]
    approve: []
    reject: []
  }>()

  const columns = computed(() => buildSubmissionQuantityColumns(props.mode))

  const setApprovedFor = (id: string, raw: string | number) => {
    const n = Number(raw)
    const next = { ...(props.approvedInputs ?? {}) }
    next[id] = Number.isFinite(n) && n >= 0 ? n : 0
    emit('update:approvedInputs', next)
  }
</script>

<template>
  <section
    class="bg-card shadow-card flex min-w-0 flex-col overflow-hidden rounded-md border border-neutral-200"
  >
    <DataTable
      :data="quantities"
      :columns="columns"
      row-key="id"
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
          <Input
            :model-value="approvedInputs?.[(row as SubmissionQuantityDetail).id] ?? ''"
            type="number"
            min="0"
            :max="(row as SubmissionQuantityDetail).requested"
            size="sm"
            placeholder="Tulis angka"
            class="w-28"
            @update:model-value="v => setApprovedFor((row as SubmissionQuantityDetail).id, v)"
          />
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
      class="flex items-center justify-end gap-2 border-t border-neutral-200 bg-neutral-50/50 px-5 py-3"
    >
      <Button variant="danger" soft size="md" :disabled="submitting" @click="emit('reject')">
        Tolak
      </Button>
      <Button variant="primary" size="md" :loading="submitting" @click="emit('approve')">
        Setujui
      </Button>
    </footer>
  </section>
</template>
