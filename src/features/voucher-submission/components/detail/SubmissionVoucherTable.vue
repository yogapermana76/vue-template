<script setup lang="ts">
  import { RotateCcw, Ticket } from 'lucide-vue-next'
  import { Badge } from '@/components/ui/badge'
  import { Button } from '@/components/ui/button'
  import { DataTable, TableActions, type TableAction } from '@/components/ui/table'
  import { SectionHeader } from '@/components/shared'
  import { formatDateInTZ } from '@/utils/date'
  import { submissionVoucherColumns } from './submissionVoucherColumns'
  import type { SubmissionVoucherCode } from '../../types'

  defineProps<{
    vouchers: SubmissionVoucherCode[]
  }>()

  const emit = defineEmits<{
    release: [code: string]
  }>()

  // Server dictates whether a voucher can be released via `releasable`.
  const rowActions = (row: SubmissionVoucherCode): TableAction[] =>
    row.releasable
      ? [
          {
            key: 'release',
            label: 'Release Kode',
            icon: RotateCcw,
            onClick: () => emit('release', row.code),
          },
        ]
      : []
</script>

<template>
  <DataTable
    :data="vouchers"
    :columns="submissionVoucherColumns"
    row-key="code"
    bordered
    :sortable="false"
    empty-message="Belum ada kode voucher"
  >
    <template #toolbar>
      <div class="flex items-center justify-between gap-3 px-5 py-4">
        <SectionHeader
          title="Detail Voucher"
          subtitle="Kode voucher yang telah di-generate"
          :icon="Ticket"
          size="md"
          class="min-w-0 flex-1"
        />
        <Badge variant="primary-soft" class="shrink-0 tabular-nums">
          {{ vouchers.length }} voucher
        </Badge>
      </div>
    </template>

    <template #cell-code="{ value }">
      <span class="body-m-medium rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-neutral-950">
        {{ value }}
      </span>
    </template>

    <template #cell-generatedAt="{ value }">
      <span class="body-m text-neutral-700 tabular-nums">
        {{ formatDateInTZ(String(value), 'd MMM yyyy') }}
      </span>
    </template>

    <template #cell-status="{ row }">
      <Badge :variant="(row as SubmissionVoucherCode).status === 'used' ? 'success' : 'error-soft'">
        {{ (row as SubmissionVoucherCode).status === 'used' ? 'Terpakai' : 'Belum Terpakai' }}
      </Badge>
    </template>

    <template #cell-actions="{ row }">
      <!-- Single action → render the button inline; skip the menu wrapper.
           Multiple actions → fall back to the overflow menu. -->
      <template v-if="rowActions(row as SubmissionVoucherCode).length === 1">
        <Button
          variant="danger"
          soft
          size="xs"
          @click.stop="rowActions(row as SubmissionVoucherCode)[0].onClick?.()"
        >
          <component
            :is="rowActions(row as SubmissionVoucherCode)[0].icon"
            v-if="rowActions(row as SubmissionVoucherCode)[0].icon"
            class="size-3.5"
          />
          {{ rowActions(row as SubmissionVoucherCode)[0].label }}
        </Button>
      </template>
      <TableActions
        v-else-if="rowActions(row as SubmissionVoucherCode).length"
        :actions="rowActions(row as SubmissionVoucherCode)"
        @click.stop
      />
      <span v-else class="text-neutral-400">—</span>
    </template>
  </DataTable>
</template>
